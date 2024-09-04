import { SelectModes } from '@/components/Banner/BannerForm/BannerForm.constants';
import { ChangeEventHandler } from 'react';
import { types } from 'sass';

export interface ApiDataObject {
  url: string;
  data?: any;
  headerToken?: string;
  Authorization?: String;
  PresignedUrl?: boolean;
  contentType?: string;
  params?: object;
}

export interface CustomInputProps {
  label?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  errorMessage?: any;
  register?: any;
  registerName?: string;
  control?: any;
  disabled?: boolean;
  min?: string;
  marginBottom?: boolean;
  readOnly?: boolean;
  prefixIcon?: string;
  textArea?: boolean;
}

export interface AuthState {
  user?: UserDataTypes;
  isLoggedIn?: boolean;
  userInput?: AuthUserInput;
}

export interface AuthUserInput {
  email: string;
}
export interface RequestState {
  currentInputRequestData: RequestType;
  myRequest: any;
}

export interface RequestType {
  year?: any;
  vehicleLink?: string;
  make?: string;
  model?: string;
  color?: string;
  link?: string;
  mode?: string;
  selectMode?: any;
}

export interface UserDataTypes {
  id?: number | string;
  emailVerified?: boolean;
  name?: string;
  email?: string;
  role?: string;
}
