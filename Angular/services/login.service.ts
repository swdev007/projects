import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ArtistService } from './artist.service';
import { CollectorService } from './collector.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  connectMetaMaskSubject = new BehaviorSubject(false);
  loggedIn = false;

  constructor(private artistService: ArtistService, private collectorService: CollectorService) {
    this.artistService.connectMetaMaskSubjectArtist.subscribe((isLoggedIn) => {
      if (isLoggedIn)
        this.isLoggedIn()
    })

    this.collectorService.connectMetaMaskSubjectCollector.subscribe((isLoggedIn) => {
      if (isLoggedIn)
        this.isLoggedIn()
    })
  }

  isLoggedIn() {
    this.loggedIn = true;
    this.connectMetaMaskSubject.next(true);
  }
  logout() {
    this.loggedIn = false;
    this.collectorService.logoutCollector();
    this.artistService.logoutArtist();
    this.connectMetaMaskSubject.next(false);
  }
}
