package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

func register(w http.ResponseWriter, r *http.Request) {
	var user User
	var id int
	var login, email string

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		fmt.Println(err)
		Handler500(w, r)
		return
	}

	err := conn.QueryRow(
		context.Background(),
		"insert into ToDoUser(login, password, email) values($1, $2, $3) returning id, login, email",
		user.Login, user.Password, user.Email,
	).Scan(&id, &login, &email)
	if err != nil {
		fmt.Println(err)
		Handler409(w, r)
		return
	}

	jwtToken, err := GenerateJWT(id, login, email)
	if err != nil {
		fmt.Println(err)
		Handler500(w, r)
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
		Handler500(w, r)
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
		Handler404(w, r)
		return
	}

	jwtToken, err := GenerateJWT(id, login, email)
	if err != nil {
		fmt.Println(err)
		Handler500(w, r)
		return
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"token": jwtToken,
	})
}
