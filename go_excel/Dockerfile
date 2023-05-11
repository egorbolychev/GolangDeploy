FROM golang:1.19

WORKDIR  /excel

COPY ./go_excel/go.mod ./go_excel/go.sum ./
COPY ./go_excel/ya-config.toml ./
RUN go mod download

COPY ./go_excel/main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-excel-server

CMD ["/docker-excel-server"]
