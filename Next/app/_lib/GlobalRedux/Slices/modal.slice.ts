'use client'; //this is a client side component

import { AuthTab } from '@/app/_lib/enum/modal.enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  authModal: boolean;
  messageModal: boolean;
  currentAuthtab: AuthTab;
}

const initialState: ModalState = {
  authModal: false,
  messageModal: false,
  currentAuthtab: AuthTab.SIGN_UP,
};

let setAuthModalHandler = (
  state: ModalState,
  action: PayloadAction<boolean>
) => {
  state.authModal = action.payload;
};

let setAuthTabHandler = (state: ModalState, action: PayloadAction<any>) => {
  state.currentAuthtab = action.payload;
};

let setMessageModalHandler = (
  state: ModalState,
  action: PayloadAction<boolean>
) => {
  state.messageModal = action.payload;
};

export const modalSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setAuthModal: setAuthModalHandler,
    setAuthTab: setAuthTabHandler,
    setMessageModal: setMessageModalHandler,
  },
});

export const { setAuthModal, setAuthTab, setMessageModal } = modalSlice.actions;

export default modalSlice.reducer;
