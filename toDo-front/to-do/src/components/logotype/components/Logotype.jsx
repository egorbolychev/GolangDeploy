import React from 'react';
// import { Link } from 'react-router-dom';
import { Icon } from '/src/components';
import classNames from 'classnames';
import './Logotype.pcss';
import { useNavigate } from 'react-router-dom';

const Logotype = () => {
  const navigate = useNavigate()

  return(
  <div className='logotype-area' onClick={() => navigate('/')}>
    <Icon
      className={classNames('logotype-icon logotype_margin')}
      type={'edit'}
      width="28"
      height="28"
    />
  </div>
  );
};

export default Logotype;
