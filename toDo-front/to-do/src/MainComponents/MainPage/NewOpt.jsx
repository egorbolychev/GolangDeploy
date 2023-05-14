import React, { useEffect, useState } from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from "antd";
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import {SqrButton} from '/src/components'
import './NewOpt.pcss'
import axios from "axios";
import {API_SERVER} from "/src/Variables"
import { useSelector } from 'react-redux';

const MainPage = ({setIsNew, refreshOptions}) => {
  const user = useSelector(state => state.user)
  const [title, setTitle] = useState('')
  const [newList, setNewList] = useState(['', ])
  const [numList, setNumList] = useState(['', ])

  const handleSubmit = () => {
    let url =  API_SERVER + '/api/new-list'
    axios.post(url,
        JSON.stringify({
            'userId': user.id,
            'name': title,
        }),{
        headers: {
            'Content-Type': 'application/json',
            Token: user.token
        }
        }).then(data => {
            if (data.status === 200)  {
                url = API_SERVER + '/api/new-items'
                axios.post(url,
                    JSON.stringify({
                        'itemList': newList,
                        'listId': data.data.listId,
                    }),{
                    headers: {
                        'Content-Type': 'application/json',
                        Token: user.token
                    }
                    }).then(data => {
                        console.log(data.data)
                        alert('Успешно сохранено!')
                        refreshOptions()
                        setIsNew(false)
                    }).catch(error => {
                    console.log(error)
                    });
            }
        }).catch(error => {
        console.log(error)
        });
  }

  const changeList = (e, i) => {
    setNewList(prevState => {
        prevState[i] = e.target.value
        return [...prevState]})
  }
  const addNew = () => {
    setNewList(prevState => [...prevState, ''])
    setNumList(prevState => [...prevState, ''])
  }

  const deleteNew = (i) => {
    console.log(i)
    setNewList(prevState => [...prevState.slice(0, i), ...prevState.slice(i + 1, newList.length)])
    setNumList(prevState => [...prevState.slice(0, i), ...prevState.slice(i + 1, numList.length)])
  }


  return (
    <div>
        <Form name="basic"
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            className='new-form'
            autoComplete="off">
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Введите название' }]}>
                    <Input onChange={(e) => setTitle(e.target.value)} className='new-input' size="large"  placeholder="Название списка" prefix={<EditOutlined />} />
                </Form.Item>
                {numList.map((item, i) => (
                    <div key={i} className='new-item'>
                        <Form.Item>
                            <Input value={newList[i]} onChange={(e) => changeList(e, i)}  className='new-input' size="large"  placeholder="Введите задачу" prefix={<CheckOutlined />} />
                        </Form.Item>
                        {newList.length - 1 === i ?
                        <SqrButton
                            className='new-sqr'
                            onClick={addNew}
                            icon="plus"
                            size="s"
                            theme='blue'
                        />:
                        <SqrButton
                            className='new-sqr'
                            onClick={() => deleteNew(i)}
                            icon="minus"
                            size="s"
                            theme='blue'
                        />
                        }
                    </div>
                ))}

                <Form.Item>
                    <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button new-input"
                    onClick={handleSubmit}
                    size='large'
                    >
                    Сохранить
                    </Button>
                </Form.Item>
            </Form>
    </div>
    );
  };

  export default MainPage;