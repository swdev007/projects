import React from 'react';
import SignUpPage from './SignUp';
import style from '../auth.module.scss';
export default function page() {
  return (
    <div className={style.auth}>
      <SignUpPage />
    </div>
  );
}
