import React from 'react';
import classNames from 'classnames';
import { Icon } from '/src/components';
// import { isAuth } from '/src/modules/account/helpers';
import './UserMenuSwitcher.pcss';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '/src/store/userSlice';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setIsScrollActive } from '/src/store/scrollSlice';


const UserMenuSwitcher = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const user = useSelector(state => state.user)

  const userMenuRef = useRef()


  const logout = () => {
    dispatch(removeUser())
    navigate('/')
  }

  useEffect(() => {
    let clickHandler = (e) => {
      if (!userMenuRef.current.contains(e.target)) {
        setShowMenu(false)
      } 
    }

    document.addEventListener('mousedown', clickHandler)

    return () => {
      document.removeEventListener('mousedown', clickHandler)
    }
  })

  useEffect(() => {
    if(showMenu){
      document.body.style.overflowY = "hidden";
      dispatch(setIsScrollActive({isScrollActive: false}));
    } else {
      document.body.style.overflowY = "scroll";
      dispatch(setIsScrollActive({isScrollActive: true}));
    }
  }, [showMenu])

  return(
  <><div
    id="userMenuSwitcher"
    className={classNames('user-menu-switcher', {
      'user-menu-switcher_active': showMenu,
    })}
    onClick={() => {
      setShowMenu(!showMenu);
    }}
    ref={userMenuRef}
    >
    <div className="user-menu-switcher__switcher ">
      <Icon className="user-menu-switcher__arrow" type="dropdown" width="9" height="9" />
      <span className="user-menu-switcher__name">{user.email}</span>
    </div>
    {showMenu?
    <div className='user-menu-stretch'>
      <div className='user-menu-switcher-b' onClick={logout}>
        Выход
      </div>
    </div>
    : null}
  </div></>
  );
};

export default UserMenuSwitcher;
