import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageKeys } from '../enums/enums';
import { IObj } from '../interface/interface';
import { getStorage, setStorage ,removeStorage} from '../utils/utils';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { ErrorHandlingService } from './error-handling.service';
import { NftTokenService } from './nft-token.service';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  collectorData!: any;

  connectMetaMaskSubjectCollector = new BehaviorSubject(this.isMetaMaskConnectedForCollector());

  constructor(private apiService: ApiService, private nftTokenService: NftTokenService, private commonService: CommonService, private errorHandlingService: ErrorHandlingService) { }

  public getNonceForCollector(publicAddress: string, isExisting: boolean = false): Observable<{ nonce: string }> {
    return this.apiService.post("metamask/get-nonce", { publicAddress: publicAddress, isExisting: isExisting })
  }

  public generateJwtTokenForCollector(signature: string, nonce: string, isExisting = false): Observable<{ access: string, refresh: string; }> {
    return this.apiService.post("metamask/get-jwt", { signature: signature, nonce: nonce, isExisting: isExisting })
  }

  public updateWhiteListingForCollectorAddress(obj : { publicAddress  : string , inviteId? : string , daoName? : string } ): Observable<{ body : { exist: boolean , whitelisted : boolean } }> {
    return this.apiService.post("collector/updateStatus", obj)
  }

  public checkERC721Token(obj : { publicAddress  : string, daoName: string} ): Observable<number | null> {
    return this.apiService.post("erc721sc/balance", obj)
  }

  public checkERC20Token(obj : { publicAddress  : string  , daoName : string} ): Observable<number> {
    return this.apiService.post("erc20sc/balance", obj)
  }

  public createCollector(formValue: {
    inviteId: string;
    fullName: string;
    email: string;
    phone: string;
    publicAddress: string
  }): Observable<any> {
    const headers = this.getHeadersForCollector();
    return this.apiService.post("collector/create", {
      ...formValue,
    }, { headers });
  }

  public getHeadersForCollector() {
    const accessToken = getStorage(StorageKeys.ACCESS_TOKEN_COLLECTOR);
    return { authorization: `Bearer ${accessToken}` };
  }

  public isMetaMaskConnectedForCollector() {
    if (getStorage(StorageKeys.ACCESS_TOKEN_COLLECTOR)) {
      return true;
    }
    return false;
  }

  public logoutCollector(){
    removeStorage(StorageKeys.ACCESS_TOKEN_COLLECTOR);
    removeStorage(StorageKeys.REFRESH_TOKEN_COLLECTOR);
    this.collectorData = undefined;
    this.connectMetaMaskSubjectCollector.next(false);
  }
  public connectMetaMaskCollector(data: { access: string, refresh: string }) {
    setStorage(StorageKeys.ACCESS_TOKEN_COLLECTOR, data.access);
    setStorage(StorageKeys.REFRESH_TOKEN_COLLECTOR, data.refresh);
    this.connectMetaMaskSubjectCollector.next(true);
  }

  public getCollectorDataBasedOnPublicAddress(public_address: string): Observable<IObj> {
    return this.apiService.get(`collector/${public_address}`);
  }

  async getCollectorData(): Promise<IObj> {
    return new Promise(async (resolve, reject) => {
      if (this.collectorData) {
        resolve(this.collectorData);
      }
      try {
        const provider = await this.nftTokenService.hasMetaMask();
        const publicAddress = await this.nftTokenService.getPublicAddress();
        this.getCollectorDataBasedOnPublicAddress(publicAddress).subscribe((collectorData) => {
          if (collectorData.body) {
            this.collectorData = collectorData.body;
            resolve(this.collectorData);
          } else {
            reject({})
          }
        }, error => {
          reject({ error })
        })
      } catch (error) {
        reject(error);
      }
    })
  }

  public ValidateIfUserIsCollector(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const provider = await this.nftTokenService.hasMetaMask();
        const publicAddress = await this.nftTokenService.getPublicAddress();
        if (this.isMetaMaskConnectedForCollector()) {
          resolve(true);
          return;
        }
        this.getNonceForCollector(publicAddress).subscribe(async (res) => {
          await this.nftTokenService.signMessage(publicAddress, res.nonce).then((data)=>{
            this.generateJwtTokenForCollector(data?.signature, data?.nonce).subscribe((access_and_refresh) => {
                this.connectMetaMaskCollector(access_and_refresh);
                resolve(access_and_refresh);
                }, error => {
                reject(error);
                return;
            })
            }).catch((err) => {
              this.errorHandlingService.handleMetaMaskError(err,publicAddress);
              reject(err);
              return;
            });
        }, (err) => {
          reject(err);
        });
      } catch (error: any) {
        this.errorHandlingService.handleMetaMaskError(error);
        reject(error);
      }
    })
  }
}
