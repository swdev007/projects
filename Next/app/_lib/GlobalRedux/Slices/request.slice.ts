'use client'; //this is a client side component

import { SelectModes } from '@/components/Banner/BannerForm/BannerForm.constants';
import { RequestState, RequestType } from '@/app/_lib/interfaces/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: RequestState = {
  currentInputRequestData: {
    vehicleLink: '',
    make: '',
    model: '',
    color: '',
    mode: SelectModes.ManualSelect,
  },
  myRequest: [],
};

const setCurrentRequestDataHandler = (
  state: RequestState,
  action: PayloadAction<RequestType>
) => {
  const { payload } = action;
  state.currentInputRequestData = payload;
};

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setCurrentRequestData: setCurrentRequestDataHandler,
  },
});

export const { setCurrentRequestData } = requestSlice.actions;

export default requestSlice.reducer;
