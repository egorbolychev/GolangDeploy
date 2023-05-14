package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
)

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

func IsAuthorized(w http.ResponseWriter, r *http.Request) {
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
