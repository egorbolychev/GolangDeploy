package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/pelletier/go-toml"
	"github.com/segmentio/kafka-go"
	"github.com/xuri/excelize/v2"
)

var alphabet = [...]string{"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}
var ynxUrl = "https://cloud-api.yandex.net/v1/disk"
var config Config
var kafkaConn *kafka.Reader

type TableData struct {
	TableName string  `json:"tableName"`
	UserName  string  `json:"userName"`
	Data      [][]any `json:"data"`
}

func main() {
	kafkaConn = kafka.NewReader(kafka.ReaderConfig{Brokers: []string{"broker:9092"}, Topic: "ya-excel", Partition: 0, MinBytes: 10e3, MaxBytes: 10e6})
	kafkaConn.SetOffset(-1)

	for {
		m, err := kafkaConn.ReadMessage(context.Background())

		if err != nil {
			continue
		}
		fmt.Printf("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))

		tableData := TableData{}
		err = json.Unmarshal(m.Value, &tableData)

		if err != nil {
			fmt.Println(err)
		}
		index(tableData)

	}

	defer kafkaConn.Close()
}

func index(tableData TableData) {

	// create xlsx table
	filename, err := NewExcel(tableData.Data)
	if err != nil {
		fmt.Println(err)
		return
	}

	// read token from ya-config.toml
	ReadConfig()

	// create user folder in disk
	err = CreateFolder("todo-lists/")
	if err != nil {
		fmt.Printf("error createFolder %s", "todo-lists")
	}

	err = CreateFolder("todo-lists/" + tableData.UserName)
	if err != nil {
		fmt.Printf("error createFolder %s", tableData.UserName)
	}

	fullPath := "./" + filename
	// dt := time.Now()
	// datename := fmt.Sprintf("-%v.xlsx", dt.Format("15:04:05"))
	// upload file in ya drive
	err = UploadFile(fullPath, "todo-lists/"+tableData.UserName+"/"+
		tableData.TableName+".xlsx")
	if err != nil {
		fmt.Printf("error uploadFile %s err:%s", fullPath, err)
	}
	fmt.Printf("ya-excel: %s uploaded to Yandex Disk\n", tableData.TableName+".xlsx")

	// remove used file
	if err := os.Remove(filename); err != nil {
		fmt.Println(err)
		return
	}

}

type Config struct {
	AuthToken string
}

func ReadConfig() {
	tree, err := toml.LoadFile("./ya-config.toml")
	if err != nil {
		log.Fatalf("load config %s", err)
	}
	if !tree.Has("authToken") {
		log.Fatalf("missed authToken in config")
	}
	config.AuthToken = tree.Get("authToken").(string)
}

func NewExcel(table_list [][]any) (string, error) {
	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	index, err := f.NewSheet("Sheet1")
	if err != nil {
		fmt.Println(err)
		return "", http.ErrMissingFile
	}

	rowCounter := 1

	for _, row := range table_list {
		for ind, cell := range row {
			letters := ""
			if ind/26 > 0 {
				letters += alphabet[ind/26-1]
			}
			letters += alphabet[ind%26]
			cellName := letters + fmt.Sprintf("%v", rowCounter)
			f.SetCellValue("Sheet1", cellName, cell)
		}
		rowCounter++
	}

	f.SetActiveSheet(index)

	dt := time.Now()
	filename := fmt.Sprintf("Book-%v.xlsx", dt.Format("15:04:05.000000000"))
	if err := f.SaveAs(filename); err != nil {
		fmt.Println(err)
		return "", http.ErrMissingFile
	}

	return filename, nil
}
func ApiRequest(path, method string) (*http.Response, error) {
	client := http.Client{}
	url := fmt.Sprintf("%s/%s", ynxUrl, path)
	req, _ := http.NewRequest(method, url, nil)
	req.Header.Add("Authorization", fmt.Sprintf("OAuth %s", config.AuthToken))
	return client.Do(req)
}

func CreateFolder(path string) error {
	_, err := ApiRequest(fmt.Sprintf("resources?path=%s", path), "PUT")
	return err
}

func UploadFile(localPath, remotePath string) error {
	// функция получения url для загрузки файла
	getUploadUrl := func(path string) (string, error) {
		res, err := ApiRequest(fmt.Sprintf("resources/upload?path=%s&overwrite=true", path), "GET")
		if err != nil {
			return "", err
		}
		var resultJson struct {
			Href string `json:"href"`
		}
		err = json.NewDecoder(res.Body).Decode(&resultJson)
		if err != nil {
			return "", err
		}
		return resultJson.Href, err
	}

	data, err := os.Open(localPath)
	if err != nil {
		return err
	}

	href, err := getUploadUrl(remotePath)
	if err != nil {
		return err
	}
	defer data.Close()

	req, err := http.NewRequest("PUT", href, data)
	if err != nil {
		return err
	}

	req.Header.Add("Authorization", fmt.Sprintf("OAuth %s", config.AuthToken))

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()
	return nil
}
