import React from 'react';
import style from '../auth.module.scss';
import ForgotPassword from './Forgotpassword';
export default function page() {
  return (
    <div className={style.auth}>
      <ForgotPassword />
    </div>
  );
}
