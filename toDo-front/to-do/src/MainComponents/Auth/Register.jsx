import React, {useState} from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import '/src/App.css'
import axios from "axios";
import {API_SERVER} from "/src/Variables"
import jwt from 'jwt-decode'
import { useDispatch } from 'react-redux';
import { setUser } from '/src/store/userSlice'

const Register = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()

    const handleSubmit = () => {
        let url =  API_SERVER + '/api/register'
            axios.post(url,
                JSON.stringify({
                    'login': login,
                    'password': password,
                    'email': email
                }),{
                headers: {
                  'Content-Type': 'application/json'
                }
                }).then(data => {
    
                  if (data.data.token) {
                      
                    let token_data = jwt(data.data.token)
                    
                    localStorage.setItem('token', data.data.token);
        
                    dispatch(setUser({
                        id: token_data.id,
                        token: data.data.token,
                        login: token_data.login,
                        email: token_data.email,
                    }))
                    }
              }).catch(error => {
                console.log(error)
              });
      }


    return (
        <div>
            <Form name="basic"
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off" 
            className="login-form">
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Пожалуйста, введите логин' }]}>
                    <Input onChange={(e) => setLogin(e.target.value)} size="large"  placeholder="Логин" prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста введите пароль' }]}>
                    <Input onChange={(e) => setPassword(e.target.value)} size="large"  placeholder="Пароль" prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Пожалуйста введите email' }]}>
                    <Input onChange={(e) => setEmail(e.target.value)} size="large"  placeholder="Email" prefix={<MailOutlined />} />
                </Form.Item>

                <Form.Item>
                    <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    onClick={handleSubmit}
                    >
                    Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register