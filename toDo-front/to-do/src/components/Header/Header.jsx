import React, {useState, useEffect} from 'react';

import Logotype from '/src/components/logotype/components/Logotype.jsx';
import SignCallButton from '/src/components/sign-call-button/components/SignCallButton.jsx';

import './Header.pcss';

const Header = () => {

  return (
    <header id="header" className="header">
      <Logotype />
      <div style={{display: 'flex', marginLeft: 'auto'}}>
        <SignCallButton className={{marginLeft: 'auto'}}/>
      </div>
    </header>
  )
};

export default Header;
