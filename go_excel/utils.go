package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/pelletier/go-toml"
	"github.com/xuri/excelize/v2"
)

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
