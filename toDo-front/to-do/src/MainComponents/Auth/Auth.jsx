import React, { useState } from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from "antd";
import { UserOutlined } from '@ant-design/icons';
import loginImg from '/src/login.png'
import '/src/App.css'
import './Auth.pcss'
import Register from './Register.jsx'
import Login from './Login.jsx'


const Auth = () => {
  const [isLoggedIn, setIsLogged] = useState(false)
  const [title, setTitle] = useState('Вход')
  const [subTitle, setSubTitle] = useState('Регистрация')

  const Change = () => {
    if (title === 'Вход') {
        setTitle('Регистрация')
        setSubTitle('Вход')
    } else {
        setTitle('Вход')
        setSubTitle('Регистрация')
    }
  }


  return (
    <div>
      <div className={isLoggedIn ? ' ' : ' hidden'}>
        Successfully logged in...
      </div>
      <div className={"lContainer" +(isLoggedIn ? ' hidden' : ' ')}>
      <div className="lItem">
          <div className="loginImage">
            <img src={loginImg} width="300" style={{position: 'relative'}} alt="login"/>
          </div>
          <div className="loginForm">
            <div className='auth-new-title-form'>
                <h2>{title}</h2>
                <p onClick={Change} className='auth-subtitle'>{subTitle}</p>
            </div>
            {title === 'Вход' ?
            <Login />
            :<Register />}
          </div>
      </div>
      <div className="footer">
        <a href="" target="_blank" rel="noopener noreferrer" className="footerLink">Powered by React</a>
      </div>
      </div>
      </div>
    );
  };

  export default Auth;