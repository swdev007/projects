'use client';
import ForgotPassword from '@/app/_auth/forgot-password/Forgotpassword';
import LoginPage from '@/app/_auth/login/Login';
import ResetPasswordPage from '@/app/_auth/reset-password/ResetPassword';
import SignUpPage from '@/app/_auth/signup/SignUp';
import VerifyAccountPage from '@/app/_auth/verify-account/VerifyAccount';
import { AuthTab } from '@/app/_lib/enum/modal.enum';
import { setAuthTab } from '@/app/_lib/GlobalRedux/Slices/modal.slice';
import { StoreInterface } from '@/app/_lib/GlobalRedux/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function AuthModal() {
  const authTabData = useSelector((store: StoreInterface) => store.modal);
  const dispatch = useDispatch();
  switch (authTabData.currentAuthtab) {
    case AuthTab.SIGN_UP: {
      return (
        <SignUpPage
          isModal={true}
          setModalPage={(tab: any) => dispatch(setAuthTab(tab))}
        />
      );
    }
    case AuthTab.LOG_IN: {
      return (
        <LoginPage
          isModal={true}
          setModalPage={(tab: any) => dispatch(setAuthTab(tab))}
        />
      );
    }
    case AuthTab.FORTGOT_PASSWORD: {
      return (
        <ForgotPassword
          isModal={true}
          setModalPage={(tab: any) => dispatch(setAuthTab(tab))}
        />
      );
    }
    case AuthTab.RESET_PASSWORD: {
      return (
        <ResetPasswordPage
          isModal={true}
          setModalPage={(tab: any) => dispatch(setAuthTab(tab))}
        />
      );
    }
    case AuthTab.VERIFY_ACCOUNT: {
      return (
        <VerifyAccountPage
          isModal={true}
          setModalPage={(tab: any) => dispatch(setAuthTab(tab))}
        />
      );
    }
    default: {
      return (
        <SignUpPage
          isModal={true}
          setModalPage={(tab: any) => dispatch(setAuthTab(tab))}
        />
      );
    }
  }
}
