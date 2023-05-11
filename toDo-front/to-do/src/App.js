import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from '/src/MainComponents/Auth/Auth.jsx'
import { useSelector } from 'react-redux';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from '/src/components/Header/Header.jsx'
import { useDispatch } from 'react-redux';
import jwt from 'jwt-decode'
import { setUser } from '/src/store/userSlice'
import MainPage from './MainComponents/MainPage/MainPage.jsx';

function App() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    try {
        let token = localStorage.getItem('token')
        let token_data = jwt(token)
        dispatch(setUser({
            id: token_data.id,
            token: token,
            login: token_data.login,
            email: token_data.email,
        }))
    } catch (e) { console.log(e) }

    }, []);

  if (!user.login) {
    return (
      <Auth />
    );
  }

  return (
    <div className="main-container">
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path='/' element={<MainPage />}/>
        </Routes>
    </BrowserRouter>
</div>
  );
}

export default App;
