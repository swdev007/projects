'use client'; //this is a client side component

import {
  AuthState,
  AuthUserInput,
  UserDataTypes,
} from '@/app/_lib/interfaces/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: {
    id: '',
    emailVerified: false,
    name: '',
    email: '',
    role: '',
  },
  isLoggedIn: false,
  userInput: {
    email: '',
  },
};

const setUserDataHandler = (
  state: AuthState,
  action: PayloadAction<AuthState>
) => {
  const { payload } = action;
  state.user = { ...state.user, ...payload.user };
  state.isLoggedIn = payload.isLoggedIn;
};

const resetUserDataHandler = (state: AuthState) => {
  state = initialState;
};

const setAuthUserInputHandler = (
  state: AuthState,
  action: PayloadAction<AuthUserInput>
) => {
  state.userInput = action.payload;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: setUserDataHandler,
    resetUserData: resetUserDataHandler,
    setAuthUserInput: setAuthUserInputHandler,
  },
});

export const { setUserData, resetUserData, setAuthUserInput } =
  authSlice.actions;

export default authSlice.reducer;
