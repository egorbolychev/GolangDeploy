package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/segmentio/kafka-go"
)

type ToDoList struct {
	UserId string `json:"userId"`
	Name   string `json:"name"`
}

func newList(w http.ResponseWriter, r *http.Request) {
	IsAuthorized(w, r)
	var todoList ToDoList
	var id int

	if err := json.NewDecoder(r.Body).Decode(&todoList); err != nil {
		fmt.Println(err)
		Handler500(w, r)
		return
	}

	err := conn.QueryRow(
		context.Background(),
		"insert into ToDoList(name, userid) values($1, $2) returning id",
		todoList.Name, todoList.UserId,
	).Scan(&id)
	if err != nil {
		fmt.Println(err)
		Handler409(w, r)
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
	IsAuthorized(w, r)
	var itemList ItemList
	var id int

	if err := json.NewDecoder(r.Body).Decode(&itemList); err != nil {
		fmt.Println(err)
		Handler500(w, r)
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
			Handler409(w, r)
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
	IsAuthorized(w, r)
	listArr := make([]ToDoOptList, 0, 10)
	var date, userId string

	date = r.URL.Query().Get("date")
	userId = r.URL.Query().Get("userId")

	if userId == "" || date == "" {
		Handler400(w, r)
		return
	}

	rows, err := conn.Query(
		context.Background(),
		"select id, name from ToDoList where userid=$1 and date=$2",
		userId, date,
	)
	if err != nil {
		fmt.Println(err)
		Handler500(w, r)
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
			Handler500(w, r)
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
	IsAuthorized(w, r)
	var list TodoListWithitems
	var listId string

	listId = r.URL.Query().Get("listId")

	if listId == "" {
		Handler400(w, r)
		return
	}

	rows, err := conn.Query(
		context.Background(),
		"select x.id, x.name, b.id, b.value, b.done from todolist x inner join todoitem b on x.id=b.listid where x.id=$1 order by b.done desc",
		listId,
	)
	if err != nil {
		fmt.Println(err)
		Handler500(w, r)
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
			Handler500(w, r)
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
	IsAuthorized(w, r)
	var list TodoListPut
	var id int

	if err := json.NewDecoder(r.Body).Decode(&list); err != nil {
		fmt.Println(err)
		Handler500(w, r)
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
			Handler409(w, r)
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
	IsAuthorized(w, r)
	userId := r.Context().Value("userId")

	var listId, email string
	var list SaveToDoList

	listId = r.URL.Query().Get("listId")

	if listId == "" {
		Handler400(w, r)
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
		Handler404(w, r)
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
		Handler500(w, r)
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
			Handler500(w, r)
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
		Handler500(w, r)
		return
	}

	fmt.Println(list)

	kafkaConn.SetDeadline(time.Now().Add(time.Second * 10))
	kafkaConn.WriteMessages(kafka.Message{Value: []byte(message)})
}
