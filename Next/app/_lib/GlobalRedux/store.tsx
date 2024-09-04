'use client';
import { AuthState, RequestState } from '@/app/_lib/interfaces/interfaces';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AuthReducer from './Slices/auth.slice';
import RequestReducer from './Slices/request.slice';
import ModalReducer, { ModalState } from './Slices/modal.slice';
export interface StoreInterface {
  auth: AuthState;
  request: RequestState;
  modal: ModalState;
}
const rootReducer = combineReducers({
  auth: AuthReducer,
  request: RequestReducer,
  modal: ModalReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
