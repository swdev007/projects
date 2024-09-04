import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageKeys } from '../enums/enums';
import { IObj } from '../interface/interface';
import { getStorage, setStorage, removeStorage } from '../utils/utils';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { ErrorHandlingService } from './error-handling.service';
import { NftTokenService } from './nft-token.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  connectMetaMaskSubjectArtist = new BehaviorSubject(this.isMetaMaskConnectedForArtist());

  constructor(private apiService: ApiService, private nftTokenService: NftTokenService, private commonService: CommonService, private errorHandlingService: ErrorHandlingService) { }

  isMetaMaskConnectedForArtist() {
    if (getStorage(StorageKeys.ACCESS_TOKEN_ARTIST)) {
      return true;
    }
    return false;
  }

  public getHeadersForArtist() {
    const accessToken = getStorage(StorageKeys.ACCESS_TOKEN_ARTIST);
    return { authorization: `Bearer ${accessToken}` };
  }

  connectMetaMaskArtist(data: { access: string, refresh: string }) {
    setStorage(StorageKeys.ACCESS_TOKEN_ARTIST, data.access);
    setStorage(StorageKeys.REFRESH_TOKEN_ARTIST, data.refresh);
    this.connectMetaMaskSubjectArtist.next(true);
  }

  public logoutArtist() {
    removeStorage(StorageKeys.ACCESS_TOKEN_ARTIST);
    removeStorage(StorageKeys.REFRESH_TOKEN_ARTIST);
    this.connectMetaMaskSubjectArtist.next(false);
  }

  public generateJwtTokenForArtist(signature: string, nonce: string): Observable<{ access: string, refresh: string; }> {
    return this.apiService.post("users/get-jwt", { signature: signature, nonce: nonce })
  }

  public getNonceForArtist(publicAddress: string): Observable<{ nonce: string }> {
    return this.apiService.post("users/get-nonce", { publicAddress: publicAddress, })
  }


  public createArtist(formValue: {
    username: string;
    email: string;
    publicAddress: string,
    firstName: string,
    lastName: string
  }): Observable<any> {
    const headers = this.getHeadersForArtist()
    return this.apiService.post("users/create", {
      ...formValue,
    }, { headers });
  }

  public validatePublicAddressForArtist(public_address: string): Observable<IObj> {
    const options = {
      search: public_address
    }
    return this.apiService.get(`users/is-unique`, { ...options });
  }

  public ValidateIfUserIsArtist(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const public_address = await this.nftTokenService.getPublicAddress();
        this.validatePublicAddressForArtist(public_address).subscribe(() => {
          reject(false);
          return;
        }, (err) => {
          if (this.isMetaMaskConnectedForArtist()) {
            this.connectMetaMaskSubjectArtist.next(true);
            resolve(true);
            return;
          }
          this.getNonceForArtist(public_address).subscribe((res) => {
            this.nftTokenService.signMessage(public_address, res.nonce).then((data) => {
              this.generateJwtTokenForArtist(data.signature, data.nonce).subscribe((access_and_refresh) => {
                this.connectMetaMaskArtist(access_and_refresh);
                resolve(true);
                return;
              }, error => {
                reject(false);
                return;
              })
            }).catch((err) => {
              this.errorHandlingService.handleMetaMaskError(err,public_address);
              reject(err);
              return;
            })
          }, (err) => {
            reject(err);
            return;
          })
        })
      } catch (error) {
        this.errorHandlingService.handleMetaMaskError(error)
        reject(error);
        return;
      }

    })
  }

}
