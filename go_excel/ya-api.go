package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

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
