import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageKeys, USERTYPE } from 'src/app/enums/enums';
import { ArtistService } from 'src/app/services/artist.service';
import { CollectorService } from 'src/app/services/collector.service';
import { NftTokenService } from 'src/app/services/nft-token.service';
import { getStorage } from 'src/app/utils/utils';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(private nftTokenService: NftTokenService, private profileService: ProfileService, private router: Router, private artistService: ArtistService, private collectorService: CollectorService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      let publicAddress = "";
      if (route.params.publicAddress) {
        publicAddress = route.params.publicAddress;
        if (publicAddress == this.nftTokenService.getPublicAddressIfPresent()) {
          this.router.navigate(['/profile']);
          reject(false);
          return;
        }
        this.profileService.anotherProfile = true;
        this.profileService.publicAddress = publicAddress;
        resolve(true);
      } else {
        try{
          publicAddress = await this.nftTokenService.getPublicAddress();
        }catch(error){
          this.router.navigate(['']);
          reject(false);
        }
        this.profileService.anotherProfile = false;
        this.profileService.publicAddress = publicAddress;
        try {
          await this.connectMetaMask();
        }
        catch (error) {
          this.router.navigate(['']);
          reject(false);
        }
        resolve(true);
      }
    })
  }

  connectMetaMask() {
    return new Promise((resolve, reject) => {
      if (!(getStorage(StorageKeys.ACCESS_TOKEN_ARTIST) || getStorage(StorageKeys.ACCESS_TOKEN_COLLECTOR))) {
        this.artistService.ValidateIfUserIsArtist().then(() => {
        }).catch(() => {
          this.collectorService.ValidateIfUserIsCollector().then(() => {
            resolve(true);
          }).catch(() => {
            reject(false);
          })
        })
      } else {
        resolve(true);
      }
    })
  }
}
