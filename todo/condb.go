package main

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

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
