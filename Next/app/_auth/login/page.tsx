import React from 'react';
import LoginPage from './Login';
import style from '../auth.module.scss';
export default function page() {
  return (
    <div className={style.auth}>
      <LoginPage />
    </div>
  );
}
