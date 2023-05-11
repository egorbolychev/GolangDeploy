import React from 'react';
import './SignCallButton.pcss';
import UserMenuSwitcher from '/src/components/user-menu-switcher/UserMenuSwitcher.jsx'

const SignCallButton = () => {

  return (
    
    <div className="sign-call-button">
      <UserMenuSwitcher />
    </div>
  );
};

export default SignCallButton;
