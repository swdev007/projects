import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { MatMenuTrigger } from "@angular/material/menu";
import { IProfileDetails } from "src/app/pages/tags/interface/tags.interface";
import { ArtistService } from "src/app/services/artist.service";
import { CommonService } from "src/app/services/common.service";
import { LoginService } from "src/app/services/login.service";
import { NftTokenService } from "src/app/services/nft-token.service";
import { CollectorService } from "src/app/services/collector.service";
import { NotificationService } from "src/app/services/notification.service";
import { PublicAddressPipe } from "@shared/pipes/public-address.pipe";
import { ProfileService } from "src/app/pages/profile/services/profile.service";
import { environment } from "@environments/environment";
import { getDummyProfileImage } from "src/app/utils/utils";
import { ErrorHandlingService } from "src/app/services/error-handling.service";
import { RequestService } from "src/app/services/request.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  isLoggedIn: boolean = false;
  openMenu: boolean = false;

  profileDetails!: IProfileDetails;
  @Input() nonWhiteListFlow = false;
  inputFocused = false;
  constructor(private commonService: CommonService, private loginService: LoginService, public nftTokenService: NftTokenService, public artistService: ArtistService, private router: Router, private collectorService: CollectorService, private notificationService: NotificationService, private publicAddressPipe: PublicAddressPipe,private profileService : ProfileService, private errorHandlingService: ErrorHandlingService, private requestService : RequestService, private location: Location) { }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;
  @ViewChild('searchElement') searchElement! : ElementRef;

  animationTimeOut!: NodeJS.Timeout
  metMenuTimeout!: NodeJS.Timeout
  searchString = "";
  @Input() isHomePage = false;
  @Input() aboutPage = false;

  search: boolean = false;
  isLoading = false;
  animated = false;
  connectMetaMaskLoading = this.requestService.connectMetaMaskLoading;
  searchHasResult = false;
  
  token: string | undefined = undefined;
  captchaShown = this.requestService.captchaShown;
  changedCaptchaState = false;
  metamaskSubscription!: Subscription;

  ngOnInit(): void {
    this.createAnimation();
    this.subscribeToProfileImageSubject()
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        document.getElementById('header')?.classList.add('active');
      } else {
        document.getElementById('header')?.classList.remove('active');
      }
    })
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.aboutPage.currentValue === true){
      this.metamaskSubscription.unsubscribe();
    }else{
      this.subscribeToConnectMetaMask();
    }
  }

  subscribeToProfileImageSubject(){
    this.commonService.profilePageSubject.subscribe((res)=>{
      if(this.profileDetails){
        this.profileDetails.avatar = res || 'assets/images/profile.png';
      }
    })
  }
  createAnimation() {
    clearTimeout(this.animationTimeOut);
    this.animationTimeOut = setTimeout(() => {
      if (this.animated) {
        this.animated = false;
      } else {
        this.animated = true;
      }
      this.createAnimation();
    }, Math.random() * 10000);
  }
  subscribeToConnectMetaMask() {
    if(this.aboutPage || this.location.path() === ''){
      this.metamaskSubscription.unsubscribe();
      return;
    }
    this.isLoading = true;
    this.metamaskSubscription = this.loginService.connectMetaMaskSubject.subscribe((isLoggedIn) => {
      this.isLoading = false;
      if (isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        this.isLoading = true;
        this.nftTokenService.getPublicAddress().then((publicAddress) => {
          this.isLoading = false;
        this.getProfileData(publicAddress);
        }).catch((error) => {
            this.errorHandlingService.handleMetaMaskError(error);
            this.isLoggedIn = false;
            this.loginService.logout();
        })
      } else {
        this.isLoggedIn = false;
      }
    }, error => {
      this.isLoading = false;
    })
  }

  getProfileData(publicAddress : string){
    this.isLoading = true;
    this.profileService.getUserProfile().subscribe((res: any)=>{
      this.isLoading = false;
      this.commonService.setProfileData(res);
      this.commonService.profileData = res;
      this.profileDetails= {
        name : this.publicAddressPipe.transform(publicAddress),
        avatar : res.collector?.imageThumbnail || res.user?.imageThumbnail || res.user?.image || getDummyProfileImage(publicAddress),
      }
    }, error => {
        this.isLoading = false;
    })
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
    if (this.openMenu) {
      document.body.classList.add("active");
    } else {
      document.body.classList.remove("active");
    }
  }

  toggleSearch() {
    this.search = !this.search;
    this.searchString = "";
    this.showSearchDropdown();
    if(this.search){
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.searchElement.nativeElement.focus();
      },0);
      this.focusInput()
    }else{  
        setTimeout(()=>{
          this.searchElement.nativeElement.blur();
        },0);
      this.checkSearchString();
    }
  }

  searchMenuClosed() {
    this.searchString = "";
    this.search = false;
  }
  checkSearchString() {
    this.inputFocused = false;
    if (!this.searchString) {
      this.search = false;
    }
  }
  closeFilters() {
    this.commonService.updateFilterSubject(false);
  }


  connectMetaMask() {
    this.changeCaptchaState(false);
    this.requestService.setLoadingState(true);
    this.artistService.ValidateIfUserIsArtist().then(() => {
      this.requestService.setLoadingState(false);
    }).catch((err) => {
      if(err.message ==='MetaMask Message Signature: User denied message signature.'){
        this.notificationService.showErrorNotification(err.message);
        this.requestService.setLoadingState(false);
        return;
      }
      this.requestService.setLoadingState(true);
      this.collectorService.ValidateIfUserIsCollector().then(() => {
        this.requestService.setLoadingState(false);
      }).catch((error) => {
        this.requestService.setLoadingState(false);
        if(error.message == 'Metamask not found'){
          this.router.navigate([`mintlist/collector`]);
          return;
        }
        this.notificationService.showErrorNotification(error.message);
      })
    })
  }

  gotToHome(){
    if(environment.checkStatus && !sessionStorage.getItem('isVerified')){
      return;
    }else{
        this.goToRoute('');
    }
  }
  goToRoute(url: string) {
    this.router.navigate([url]);
    this.openMenu = false;
    document.body.classList.remove("active");
  }
  showSearchDropdown() {
    clearTimeout(this.metMenuTimeout);
    if (this.searchString.length) {
      this.metMenuTimeout = setTimeout(() => {
        this.trigger?.openMenu();
      }, 300)
    } else {
      this.trigger?.closeMenu();
      setTimeout(()=>{
        this.searchElement.nativeElement.blur();
      },0);
    }
  }

  logout() {
    this.loginService.logout();
    this.openMenu = false;
    document.body.classList.remove("active");
    this.goToRoute('');
    this.notificationService.showSuccessNotification('Logged out');
  }
  ngOnDestroy() {
    clearTimeout(this.animationTimeOut);
  }

  focusInput() {
    this.inputFocused = true;
  }
  giftToken(){
    this.nftTokenService.mintERC20();
  }
  giftToken2(){
    this.nftTokenService.mintERC721();
  }

  checkValueInSearchResult(data: boolean){
      this.searchHasResult = data
  }
  
  changeCaptchaState(state: boolean){
    if(state === true){
      this.token = '';
    }
    this.changedCaptchaState = true;
    this.requestService.setCaptchaState(state);
  }
}
