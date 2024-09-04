import { StorageEnums } from '@/app/_lib/enum/storage';

export class StorageService {
  setKey(key: StorageEnums, data: any) {
    try {
      let stringifiedData = JSON.stringify(data);
      localStorage.setItem(key, stringifiedData);
    } catch (error) {
      console.error('erro in setKey StorageService', error);
    }
  }

  removeKey(key: StorageEnums) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('erro in removeKey StorageService', error);
    }
  }

  getKey(key: StorageEnums) {
    try {
      const stringifiedData = localStorage.getItem(key);
      if (stringifiedData) {
        return JSON.parse(stringifiedData);
      }
      return null;
    } catch (error) {
      console.error('erro in getKey StorageService', error);
    }
  }
}
