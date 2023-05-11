package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/segmentio/kafka-go"
)

var conn *pgx.Conn
var kafkaConn *kafka.Conn
var secretKey []byte

type User struct {
	Id       int    `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	secretKey = []byte(os.Getenv("SECRET_KEY"))
	if len(secretKey) == 0 {
		log.Fatal("SECRET_KEY is empty")
	}

	err = ConnectDB()
	if err != nil {
		log.Fatal(err)
	}

	kafkaConn, err = kafka.DialLeader(context.Background(), "tcp", "broker:9092", "ya-excel", 0)
	if err != nil {
		log.Fatal(err)
	}

	defer conn.Close(context.Background())
	defer kafkaConn.Close()

	r := chi.NewRouter()
	r.Use(AuthMiddleware)
	r.Get("/api", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})
	r.Post("/api/register", register)
	r.Post("/api/login", login)
	r.Post("/api/new-list", newList)
	r.Post("/api/new-items", newItems)
	r.Post("/api/save-list", saveToDoList)
	r.Put("/api/change-list", changeList)
	r.Get("/api/get-lists", getListsByDate)
	r.Get("/api/get-list", getList)

	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{
			http.MethodPost,
			http.MethodGet,
			http.MethodDelete,
			http.MethodPut,
		},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
	})

	handler := cors.Handler(r)

	err = http.ListenAndServe(":8000", handler)
	if err != nil {
		panic(err)
	}
}

func register(w http.ResponseWriter, r *http.Request) {
	var user User
	var id int
	var login, email string

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	err := conn.QueryRow(
		context.Background(),
		"insert into ToDoUser(login, password, email) values($1, $2, $3) returning id, login, email",
		user.Login, user.Password, user.Email,
	).Scan(&id, &login, &email)
	if err != nil {
		fmt.Println(err)
		handler409(w, r)
		return
	}

	jwtToken, err := GenerateJWT(id, login, email)
	if err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"token": jwtToken,
	})
}

func login(w http.ResponseWriter, r *http.Request) {
	var user User
	var id int
	var login, email string

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	row := conn.QueryRow(
		context.Background(),
		"select id, login, email from todouser where login=$1 and password=$2",
		user.Login, user.Password,
	)
	err := row.Scan(&id, &login, &email)
	if err != nil {
		fmt.Println(err)
		handler404(w, r)
		return
	}

	jwtToken, err := GenerateJWT(id, login, email)
	if err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"token": jwtToken,
	})
}

type ToDoList struct {
	UserId string `json:"userId"`
	Name   string `json:"name"`
}

func newList(w http.ResponseWriter, r *http.Request) {
	isAuthorized(w, r)
	var todoList ToDoList
	var id int

	if err := json.NewDecoder(r.Body).Decode(&todoList); err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	err := conn.QueryRow(
		context.Background(),
		"insert into ToDoList(name, userid) values($1, $2) returning id",
		todoList.Name, todoList.UserId,
	).Scan(&id)
	if err != nil {
		fmt.Println(err)
		handler409(w, r)
		return
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"listId": id,
	})
}

type ItemList struct {
	Items  []string `json:"itemList"`
	ListId int      `json:"listId"`
}

func newItems(w http.ResponseWriter, r *http.Request) {
	isAuthorized(w, r)
	var itemList ItemList
	var id int

	if err := json.NewDecoder(r.Body).Decode(&itemList); err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	for _, item := range itemList.Items {
		err := conn.QueryRow(
			context.Background(),
			"insert into ToDoItem(value, listId) values($1, $2) returning id",
			item, itemList.ListId,
		).Scan(&id)
		if err != nil {
			fmt.Println(err)
			handler409(w, r)
			return
		}
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"ok": true,
	})
}

type ToDoOptList struct {
	Value int    `json:"value"`
	Label string `json:"label"`
}

func getListsByDate(w http.ResponseWriter, r *http.Request) {
	isAuthorized(w, r)
	listArr := make([]ToDoOptList, 0, 10)
	var date, userId string

	date = r.URL.Query().Get("date")
	userId = r.URL.Query().Get("userId")

	if userId == "" || date == "" {
		handler400(w, r)
		return
	}

	rows, err := conn.Query(
		context.Background(),
		"select id, name from ToDoList where userid=$1 and date=$2",
		userId, date,
	)
	if err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var list ToDoOptList
		err := rows.Scan(
			&list.Value,
			&list.Label,
		)
		if err != nil {
			fmt.Println(err)
			handler500(w, r)
			return
		}
		listArr = append(listArr, list)
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(listArr)
}

type ToDoItem struct {
	Id    int    `json:"id"`
	Value string `json:"value"`
	Done  bool   `json:"done"`
}

type TodoListWithitems struct {
	Id    int        `json:"id"`
	Name  string     `json:"name"`
	Items []ToDoItem `json:"items"`
}

func getList(w http.ResponseWriter, r *http.Request) {
	isAuthorized(w, r)
	var list TodoListWithitems
	var listId string

	listId = r.URL.Query().Get("listId")

	if listId == "" {
		handler400(w, r)
		return
	}

	rows, err := conn.Query(
		context.Background(),
		"select x.id, x.name, b.id, b.value, b.done from todolist x inner join todoitem b on x.id=b.listid where x.id=$1 order by b.done desc",
		listId,
	)
	if err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var item ToDoItem
		err := rows.Scan(
			&list.Id,
			&list.Name,
			&item.Id,
			&item.Value,
			&item.Done,
		)

		if err != nil {
			fmt.Println(err)
			handler500(w, r)
			return
		}
		list.Items = append(list.Items, item)
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(list)
}

type TodoListPut struct {
	Id    int        `json:"listId"`
	Items []ToDoItem `json:"items"`
}

func changeList(w http.ResponseWriter, r *http.Request) {
	isAuthorized(w, r)
	var list TodoListPut
	var id int

	if err := json.NewDecoder(r.Body).Decode(&list); err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	for _, item := range list.Items {
		err := conn.QueryRow(
			context.Background(),
			"update todoitem set done=$1 where id=$2 returning id;",
			item.Done, item.Id,
		).Scan(&id)
		if err != nil {
			fmt.Println(err)
			handler409(w, r)
			return
		}
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"ok": true,
	})

}

type SaveToDoList struct {
	UserName  string  `json:"userName"`
	TableName string  `json:"tableName"`
	Data      [][]any `json:"data"`
}

func saveToDoList(w http.ResponseWriter, r *http.Request) {
	isAuthorized(w, r)
	userId := r.Context().Value("userId")

	var listId, email string
	var list SaveToDoList

	listId = r.URL.Query().Get("listId")

	if listId == "" {
		handler400(w, r)
		return
	}

	row := conn.QueryRow(
		context.Background(),
		"select email from todouser where id=$1",
		userId,
	)
	err := row.Scan(&email)
	if err != nil {
		fmt.Println(err)
		handler404(w, r)
		return
	}

	list.UserName = email

	rows, err := conn.Query(
		context.Background(),
		"select x.name, b.value, b.done from todolist x inner join todoitem b on x.id=b.listid where x.id=$1 order by b.done desc",
		listId,
	)
	if err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var data_item []any
		var value string
		var done bool
		err := rows.Scan(
			&list.TableName,
			&value,
			&done,
		)

		if err != nil {
			fmt.Println(err)
			handler500(w, r)
			return
		}

		data_item = append(data_item, value)
		if done {
			data_item = append(data_item, "Done")
		} else {
			data_item = append(data_item, "In progress")
		}

		list.Data = append(list.Data, data_item)
	}

	message, err := json.Marshal(list)
	if err != nil {
		fmt.Println(err)
		handler500(w, r)
		return
	}

	fmt.Println(list)

	kafkaConn.SetDeadline(time.Now().Add(time.Second * 10))
	kafkaConn.WriteMessages(kafka.Message{Value: []byte(message)})
}

func isAuthorized(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userId")
	if userId == nil {
		w.WriteHeader(http.StatusUnauthorized)
		_, err := w.Write([]byte("You're Unauthorized due to invalid token"))
		if err != nil {
			return
		}
		return
	}
}

func handler500(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("500 Server Error"))
}

func handler409(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusConflict)
	w.Write([]byte("409 Conflict"))
}

func handler404(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404 Page Not Found"))
}

func handler400(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte("400 Bad Request"))
}

func AuthMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header["Token"] != nil {
			claims := jwt.MapClaims{}
			token, _ := jwt.ParseWithClaims(r.Header["Token"][0], claims, func(token *jwt.Token) (interface{}, error) {

				return []byte(secretKey), nil

			})

			var login = claims["login"]
			var id int

			row := conn.QueryRow(
				context.Background(),
				"select id from todouser where login=$1",
				login,
			)
			err := row.Scan(&id)
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				_, err := w.Write([]byte("You're Unauthorized due to invalid token"))
				if err != nil {
					return
				}
			}
			fmt.Println(token)

			ctx := r.Context()
			ctx = context.WithValue(ctx, "userId", id)
			r = r.WithContext(ctx)
			handler.ServeHTTP(w, r)
		} else {
			handler.ServeHTTP(w, r)
		}

	})
}

func GenerateJWT(id int, login, email string) (string, error) {
	id_str := fmt.Sprintf("%d", id)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":   time.Now().Add(1000 * time.Hour),
		"id":    id_str,
		"login": login,
		"email": email,
	})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return tokenString, err
}

func ConnectDB() error {
	err := godotenv.Load()
	if err != nil {
		return errors.New("Error loading .env file")
	}

	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		return errors.New("DATABASE_URL is empty")
	}

	conn, err = pgx.Connect(context.Background(), databaseUrl)
	if err != nil {
		return errors.New(fmt.Sprintf("Unable to connect to database: %v\n", err))
	}

	_, err = conn.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS ToDoUser (
		id SERIAL PRIMARY KEY,
		login varchar(50) UNIQUE NOT NULL,
		password varchar(50) NOT NULL,
		email varchar(50) NOT NULL
	);`)
	if err != nil {
		fmt.Println("Table ToDoUser already exists")
		fmt.Println(err)
	}

	_, err = conn.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS ToDoList (
		id SERIAL PRIMARY KEY,
		name varchar(50) NOT NULL,
		date DATE DEFAULT CURRENT_DATE,
		userId integer NOT NULL,
		FOREIGN KEY (userId) REFERENCES ToDoUser(id)
	)`)
	if err != nil {
		fmt.Println("Table ToDoList already exists")
		fmt.Println(err)
	}

	_, err = conn.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS ToDoItem (
		id SERIAL PRIMARY KEY,
		value varchar(255) NOT NULL,
		done BOOLEAN DEFAULT False,
		listId integer NOT NULL,
		FOREIGN KEY (listId) REFERENCES ToDoList(id)
	)`)
	if err != nil {
		fmt.Println("Table ToDoItem already exists")
		fmt.Println(err)
	}

	return nil
}
