import React, { useEffect, useState } from 'react';
import { Form, Button} from "antd";
import { SaveOutlined } from '@ant-design/icons';
import './Option.pcss'
import axios from "axios";SaveOutlined
import {API_SERVER} from "/src/Variables"
import { useSelector } from 'react-redux';
import {SqrButton} from '/src/components'

const Option = ({list, listItems, setListItems}) => {
  const user = useSelector(state => state.user)
  const [changed, setChanged] = useState(false)
  const [qwe, setQwe] = useState(false)

  const handleSubmit = () => {
    let url =  API_SERVER + '/api/change-list'
    axios.put(url,
        JSON.stringify({
            'listId': Number(list.id),
            'items': listItems,
        }),{
        headers: {
            'Content-Type': 'application/json',
            Token: user.token
        }
        }).then(data => {
            if (data.status === 200)  {
                console.log(data.data)
                alert('Успешно сохранено!')
                setChanged(false)
            }
        }).catch(error => {
        console.log(error)
        });
  }

  const setDone = (i) => {
    setListItems(prevState => {prevState[i].done = !prevState[i].done
                         return prevState} )

    setChanged(true)
    setQwe(!qwe)
  }

  const saveInDisk = () => {
    let params = '?listId=' + list.id
    let url =  API_SERVER + '/api/save-list' + params

    axios.post(url,
        JSON.stringify({
        }),{
        headers: {
            'Content-Type': 'application/json',
            Token: user.token
        }
        }).then(data => {
            if (data.status === 200)  {
                console.log(data.data)
                alert('Сохранено на яндекс диск!')
            }
        }).catch(error => {
        console.log(error)
        });
  }

  return (
    <div>
        <ul>
        <SqrButton
            title='Сохранить список на яндекс диск'
            className='list-sqrt'
            onClick={saveInDisk}
            icon="mail"
            size="s"
            theme='blue'
        />
        <Form.Item className='item-title'>
            <h1>{list.name}</h1>
        </Form.Item>
        {listItems.map((item, i) => (
            <li className={item.done ? 'item-done' : null} onClick={() => {setDone(i); console.log(item)}}>{item.value}</li>
        ))}
        {changed &&
        <Form.Item className='item-title'>
            <Button
            type="primary"
            htmlType="submit"
            className="item-button"
            onClick={handleSubmit}
            >
            Сохранить
            </Button>
        </Form.Item>
        }
        </ul>
    </div>
    );
  };

  export default Option;