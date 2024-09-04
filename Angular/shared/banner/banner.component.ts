import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { IFeaturedVideo } from "@shared/interface/interface";
import { NftTokenService } from "src/app/services/nft-token.service";
import { RequestService } from "src/app/services/request.service";
import { WebSocketService } from "src/app/services/socket.service";
import { launchDateIsInFuture , getDummyProfileImage } from "src/app/utils/utils";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {
  constructor(
    private router: Router,
    private webSocketService: WebSocketService,
    private nftTokenService: NftTokenService,
    private requestService: RequestService
  ) {}
  @Input() showContent: boolean = false;
  @Input() bannerOverlay!: IFeaturedVideo;
  @Input() showCounter: boolean = false;
  @Input() className: string = "";
  @Input() whiteListedCollector: boolean = false;
  @Input() showShare: boolean = false;
  @Output() zeroEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() loggedIn = false;
  @Input() whitelistRequestSubmitted = false;

  metamaskLoading = this.requestService.connectMetaMaskLoading;
  showCopiedToolTip = false;
  textCopyTimeout!: NodeJS.Timeout;
  showImageSkeleton = true;
  squareTypeVideo: boolean = false;
  fullVideo = false;
  nftStreamUrl = "";
  verticalVideoStreamUrl = "";
  showImage = false;
  showLoader = false;

  // @ViewChild("myCanvas") canvasRef!: ElementRef;
  // @ViewChild("myCanvas2") canvasRef2!: ElementRef;

  @ViewChild("image") image!: ElementRef;
  @ViewChild("image2") image2!: ElementRef;

  aspect16by9VerticalImage = false;
  aspectSquareVerticalImage = false;
  token : string = '';
  captchaShown = this.requestService.captchaShown;
  changedCaptchaState = false;

  getStreamUrl() {
    if (
      new Date(this.bannerOverlay?.updatedAt || "").getTime() + 20000 <
      new Date().getTime()
    ) {
      return this.bannerOverlay?.nftFileKeyStream || "";
    }
    return "";
  }

  get isCounterVisible() {
    if(this.soldOut) return false;
    return new Date(this.chooseDropDateBasedOnWhitelisting) > new Date();
  }

  get autoplay() {
    return this.bannerOverlay.autoplay === true;
  }

  getVerticalVideoStreamUrl() {
    if (
      new Date(this.bannerOverlay?.updatedAt || "").getTime() + 20000 <
      new Date().getTime()
    ) {
      return (
        this.bannerOverlay?.verticalVideoStream ||
        this.bannerOverlay?.nftFileKeyStream ||
        ""
      );
    }
    return "";
  }
  get chooseDropDateBasedOnWhitelisting() {
    if (this.whiteListedCollector && this.bannerOverlay?.whiteListDropDate) {
      return this.bannerOverlay?.whiteListDropDate || "";
    }
    return this.bannerOverlay?.dropDate || "";
  }

  get showRequestButton(){
    const date = this.chooseDropDateBasedOnWhitelisting;
    if (this.loggedIn && !date && !this.whiteListedCollector && this.bannerOverlay?.whiteListDropDate) {
      return true
    }
    return false;
  }
  get getShowBannerOrVideo() {
    if (this.bannerOverlay?.isListed === false) {
      return true;
    }
    let date = this.chooseDropDateBasedOnWhitelisting;
    if (!date) {
      return true;
    }
    return launchDateIsInFuture(date);
  }

  get soldOut() {
    return (this.bannerOverlay?.sales && this.bannerOverlay?.totalTokenCount && +this.bannerOverlay.sales === +this.bannerOverlay.totalTokenCount);
  }

  get verticalVideo() {
    return this.bannerOverlay?.verticalVideo?.includes("https")
      ? this.bannerOverlay?.verticalVideo
      : null;
  }

  get verticalCoverImage() {
    return this.bannerOverlay?.verticalCoverImage?.includes("https")
      ? this.bannerOverlay?.verticalCoverImage
      : null;
  }
  ngOnInit(): void {
    this.nftStreamUrl = this.getStreamUrl();
    this.verticalVideoStreamUrl = this.getVerticalVideoStreamUrl();
    this.changeCaptchaState(false);
  }

  goToProfilePage() {
    this.router.navigate([
      `profile/${this.bannerOverlay?.owner?.publicAddress}`,
    ]);
  }

  async goTobuyPage() {
    // TODO: BUY QUEUE COMMENTED OUT
    // this.addToQueue();
    this.router.navigate([`buy/${this.bannerOverlay.uuid}`]);
  }

 
  async addToQueue() {
    const queueData = {
      publicAddress: await this.nftTokenService.getPublicAddress(),
      totalSupply: this.bannerOverlay.totalTokenCount,
      nftTokenId: this.bannerOverlay.id,
    };
    if(!queueData.publicAddress){
      this.webSocketService.queue.set(this.bannerOverlay.id, false);
      return;
    }
    this.webSocketService.emit("enterQueue", queueData, (response: any) => {
      this.webSocketService.queue.set(this.bannerOverlay.id, response.success);
    });
  }

  imageLoaded() {
    if (window.innerWidth < 767) {
      return;
    }
    // let ctx = this.canvasRef.nativeElement.getContext("2d");
    // ctx.imageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
    // ctx.drawImage(
    //   this.image.nativeElement,
    //   this.image.nativeElement.width / 2 - 20,
    //   this.image.nativeElement.height / 2 - 20,
    //   40,
    //   40,
    //   0,
    //   0,
    //   400,
    //   400
    // );
    // setTimeout(() => {
    // }, 1500);
    this.showImageSkeleton = false;
    this.showImage = true;
  }

  imageLoadedMobile() {
    if (window.innerWidth >= 767) {
      return;
    }
    // let ctx = this.canvasRef2.nativeElement.getContext("2d");
    // ctx.imageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
    if (this.image2.nativeElement.height == this.image2.nativeElement.width) {
      this.aspectSquareVerticalImage = true;
    }

    if (+(this.image2.nativeElement.height / this.image2.nativeElement.width) ==0.5625) {
      this.aspect16by9VerticalImage = true;
    }
    // ctx.drawImage(
    //   this.image2.nativeElement,
    //   this.image2.nativeElement.width / 2 - 20,
    //   this.image2.nativeElement.height / 2 - 20,
    //   40,
    //   40,
    //   0,
    //   0,
    //   400,
    //   400
    // );
    // setTimeout(() => {
    // }, 1500);

    this.showImageSkeleton = false;
    this.showImage = true;
  }
  squareVideo() {
    this.squareTypeVideo = true;
  }

  copyCurrentLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    this.showCopiedToolTip = true;
    clearTimeout(this.textCopyTimeout);
    this.textCopyTimeout = setTimeout(() => {
      this.showCopiedToolTip = false;
    }, 1000);
  }

  zeroTimeEmitter(status: boolean) {
    this.zeroEmitter.emit(true);
  }

  goToRequestPage(tokenId: string){
    this.router.navigate([`/request/${tokenId}`]);
  }
  getProfileImage() {
    return getDummyProfileImage(this.bannerOverlay?.owner?.publicAddress || "");
  }

  connectMetamask(){
    this.changeCaptchaState(false);
    this.requestService.connectMetamask(this.bannerOverlay.id);
  }

  downloadLinkVideo(){
    this.showLoader = true;
    let xhr = new XMLHttpRequest();
    xhr.open('GET',  this.bannerOverlay?.nftFileKey , true);
    xhr.responseType = 'blob';
    let that = this;
    xhr.onload = function() {
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(this.response);
        let tag = document.createElement('a');
        tag.href = imageUrl;
        tag.target = '_blank';
        tag.download = ( that.bannerOverlay.title || 'video' )+ '.mp4';
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
        that.showLoader = false;
    };
    xhr.onerror = (err) => {
      console.log('failed', err);
      that.showLoader = false;
    };
    xhr.send();
  }

  changeCaptchaState(state: boolean){
    if(state === true){
      this.token = '';
    }
    this.changedCaptchaState = state;
    this.requestService.setCaptchaState(state);
  }
}
