import axios from "axios";
export enum TokenData {
  REFRESH = "REFRESH",
  ACCESS = "ACCESS",
}

const API_BASE_URL = process.env.REACT_APP_API_URL;

export enum API_URL {
  LOGIN = "auth/admin/login",
  REQUEST_RESET_PASSWORD = "auth/admin/request-reset-password",
  RESET_PASSWORD = "auth/admin/reset-password",
  USER = "admin/user",
  FREEZE = "admin/user/freeze",
  UNFREEZE = "admin/user/unfreeze",
  SHOPPING_LIST = "admin/user/shopping-cart",
  DELETE_ITEM = "shopping-cart",
  REFRESH_TOKEN = "auth/refresh",
}

export interface IDataObject {
  url: string;
  data?: object;
  headers?: object;
  headerToken?: TokenData;
  dataBody?: object;
}
const UseApiService = () => {
  return {
    async get(obj: IDataObject) {
      return axios.get(API_BASE_URL + obj.url, {
        params: {
          ...obj.data,
        },
        headers: {
          ...obj.headers,
        },
        data: {
          headerToken: obj.headerToken,
          ...obj.dataBody,
        },
      });
    },
    async post(obj: IDataObject) {
      return axios.post(
        API_BASE_URL + obj.url,
        {
          ...obj.data,
          headerToken: obj.headerToken,
        },
        { headers: { ...obj.headers } }
      );
    },
    async delete(obj: IDataObject) {
      return axios.delete(API_BASE_URL + obj.url, {
        headers: {
          ...obj.headers,
        },
        data: {
          headerToken: obj.headerToken,
          ...obj.data,
        },
      });
    },
    async put(obj: IDataObject) {
      return axios.put(
        API_BASE_URL + obj.url,
        {
          ...obj.data,
          headerToken: obj.headerToken,
        },
        { headers: { ...obj.headers } }
      );
    },
    async getUrl(obj: IDataObject) {
      return axios.get(obj.url, {
        params: {
          ...obj.data,
        },
        headers: {
          ...obj.headers,
        },
      });
    },
  };
};

export default UseApiService;
