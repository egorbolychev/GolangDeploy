package main

import "net/http"

func Handler500(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("500 Server Error"))
}

func Handler409(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusConflict)
	w.Write([]byte("409 Conflict"))
}

func Handler404(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404 Page Not Found"))
}

func Handler400(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte("400 Bad Request"))
}
