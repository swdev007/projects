import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { ArtistService } from './artist.service';
import { CollectorService } from './collector.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(
    private artistService: ArtistService,
    private collectorService : CollectorService,
    private notificationService : NotificationService,
    private router : Router
  ){}

  private readonly connectMetaMaskLoadingSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  connectMetaMaskLoading = this.connectMetaMaskLoadingSubject.asObservable();

  private readonly captchaShownSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  captchaShown = this.captchaShownSubject.asObservable();

  setLoadingState(state : boolean){
    this.connectMetaMaskLoadingSubject.next(state);
  }

  setCaptchaState(state : boolean){
    this.captchaShownSubject.next(state);
  }

  connectMetamask(tokenId: string) {
    this.setLoadingState(true);
    this.artistService.ValidateIfUserIsArtist().then(() => {
      this.setLoadingState(false);
      this.checkCollectorData(tokenId);
    }).catch((err) => {
      if(err.message ==='MetaMask Message Signature: User denied message signature.'){
        this.notificationService.showErrorNotification(err.message); 
        this.setLoadingState(false);
        return;
      }
      this.setLoadingState(true);
      this.collectorService.ValidateIfUserIsCollector().then(() => {
        this.setLoadingState(false);
        this.checkCollectorData(tokenId);
      }).catch((error) => {
        this.setLoadingState(false);
        if(error.message == 'Metamask not found'){
          this.router.navigate([`mintlist/collector`]);
          return;
        }
        this.notificationService.showErrorNotification(error.message);
      })
    })
  }

  checkCollectorData(tokenId: string){
    this.setLoadingState(true);
    this.collectorService
    .getCollectorData()
    .then((collectorData) => {
      this.setLoadingState(false);
      if(collectorData.whitelistRequestSubmitted){
        this.notificationService.showErrorNotification('You have already requested to join mintlist');
        return;
      }
      if (!collectorData.whitelisted) {
        this.router.navigate([`/request/${tokenId}`])
      }
    })
    .catch((err) => {
      this.setLoadingState(false);
      console.log(err);
    });
  }
}
