import { Injectable } from '@angular/core';
import { StorageKeys, USERTYPE } from 'src/app/enums/enums';
import { ApiService } from 'src/app/services/api.service';
import { getStorage } from 'src/app/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private apiService: ApiService) { }

  profileData: any;
  publicAddress!: string;
  anotherProfile = false;
  userType! : USERTYPE;

  getHeaders() {
    const accessToken = getStorage(StorageKeys.ACCESS_TOKEN_ARTIST) || getStorage(StorageKeys.ACCESS_TOKEN_COLLECTOR);
    return { authorization: `Bearer ${accessToken}` };
  }

  getUserProfile() {
    const headers = this.getHeaders()
    return this.apiService.get(`users/profile/my`, undefined, headers);
  }


  getUserProfileByPublicAddress(publicAddress: string) {
    return this.apiService.get(`users/profile/other/${publicAddress}`);
  }

  getUserCollections(page: number, limit: number, publicAddress?: string) {
    let headers = {};
    headers = this.getHeaders();
    let obj = { page: page, limit: limit }
    return this.apiService.get(`users/profile/collection${publicAddress ? `/${publicAddress}` : ''}`, obj, headers);
  }


  getUserCreatedCollection(page: number, limit: number, publicAddress?: string) {
    let headers = {};
    headers = this.getHeaders();
    let obj = { page: page, limit: limit }
    return this.apiService.get(`users/profile/created${publicAddress ? `/${publicAddress}` : ''}`, obj, headers);
  }


  editProfile(data: any) {
    const headers = this.getHeaders();
    return this.apiService.put(`users/update-profile`, { ...data }, { headers });
  }
}
