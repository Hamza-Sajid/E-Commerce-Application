import React from 'react';
import Logo from '../../assets/bannerLogo.svg';
import Styles from './simple_navbar_style.module.css';
import { useNavigate } from 'react-router-dom';
function SimpleNavbar() {
  const navigate = useNavigate();
  return (
    <div className={Styles.container}>
      <img
        onClick={() => navigate('/')}
        width={150}
        src={Logo}
        alt="logo"
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default SimpleNavbar;
