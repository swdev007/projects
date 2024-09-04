import { StorageEnums } from '@/app/_lib/enum/storage';
import axios from 'axios';
import { ApiDataObject } from '../interfaces/interfaces';
import { StorageService } from './storageServices';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_KEY,
});
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const storageService = new StorageService();

//     if (error.response.status === 400 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = storageService.getKey(
//           StorageEnums.CREDENTIALS
//         ).refreshToken;
//         const response = await axios.post(`${baseurl}auth/refresh`, {
//           refreshToken: refreshToken,
//         });
//         storageService.setKey(StorageEnums.CREDENTIALS, response.data);
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error('Failed to refresh token:', refreshError);
//       }
//     }

//     // Return any other errors
//     return Promise.reject(error);
//   }
// );
export class ApiService {
  async get(obj: ApiDataObject) {
    return await api.get(`${obj.url}`, {
      params: obj?.data,
      headers: {
        Authorization: obj.headerToken,
      },
    });
  }
  async post(obj: ApiDataObject) {
    return await api.post(`${obj.url}`, obj?.data, {
      params: obj.params,
      headers: {
        Authorization: obj.headerToken,
      },
    });
  }

  async delete(obj: ApiDataObject) {
    return await api.delete(`${obj.url}`, {
      params: obj?.data,
      headers: {
        Authorization: obj.headerToken,
      },
    });
  }
  async put(obj: ApiDataObject) {
    return await api.put(`${obj.url}`, obj?.data, {
      headers: {
        Authorization: obj.headerToken,
      },
    });
  }
  async patch(obj: ApiDataObject) {
    return await api.patch(`${obj.url}`, obj?.data, {
      headers: {
        Authorization: obj.headerToken,
      },
    });
  }
}
