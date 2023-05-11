FROM golang:1.19

WORKDIR  /app

COPY ./todo/go.mod ./todo/go.sum ./
COPY ./todo/.env ./
RUN go mod download

COPY ./todo/*.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-server

EXPOSE 8000

CMD ["/docker-server"]
