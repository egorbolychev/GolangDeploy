package main

import (
	"context"
	"log"
	"net/http"
	"os"

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
			if err != nil || !token {
				w.WriteHeader(http.StatusUnauthorized)
				_, err := w.Write([]byte("You're Unauthorized due to invalid token"))
				if err != nil {
					return
				}
			}

			ctx := r.Context()
			ctx = context.WithValue(ctx, "userId", id)
			r = r.WithContext(ctx)
			handler.ServeHTTP(w, r)
		} else {
			handler.ServeHTTP(w, r)
		}

	})
}
