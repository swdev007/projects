import { Component, OnInit } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "@environments/environment";
import { IFeaturedVideo } from "@shared/interface/interface";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { CollectorService } from "src/app/services/collector.service";
import { CommonService } from "src/app/services/common.service";
import { LoginService } from "src/app/services/login.service";
import { NftTokenService } from "src/app/services/nft-token.service";
import { NotificationService } from "src/app/services/notification.service";
import { RequestService } from "src/app/services/request.service";
import { WebSocketService } from "src/app/services/socket.service";
import {
  getDummyProfileImage,
  launchDateIsInFuture,
} from "src/app/utils/utils";
import { actionType } from "../../enums/enums";
import { ProfileDetails } from "../../interface/interface";
import { TokenDetailsService } from "../../services/token-details.service";

@Component({
  selector: "app-token-detail",
  templateUrl: "./token-detail.component.html",
  styleUrls: ["./token-detail.component.scss"],
})
export class TokenDetailComponent implements OnInit {
  profileDetails!: ProfileDetails;
  uuid: string = "";
  tokenData!: IFeaturedVideo;
  conversionFactor = 1;
  priceInUSD = 1;
  bannerData!: IFeaturedVideo;
  priceInETH!: number;
  publicAddress!: string;
  whiteListedCollector = false;
  tokenHistory: any[] = [];
  pageSubject = { page: 1, limit: 10 };
  scrollSubject = new Subject<boolean>();
  historyLoading = false;
  totalTokenCount = 0;
  actionType = actionType;
  loggedIn = false;
  metamaskLoading = this.requestService.connectMetaMaskLoading;
  whitelistRequestSubmitted = false;

  token: string | undefined = undefined;
  captchaShown = this.requestService.captchaShown;
  changedCaptchaState = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tokenDetailsService: TokenDetailsService,
    private commonService: CommonService,
    private collectorService: CollectorService,
    private nftTokeService: NftTokenService,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private loginService: LoginService,
    private meta: Meta,
    private requestService: RequestService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  get chooseDropDateBasedOnWhitelisting() {
    if (this.whiteListedCollector && this.tokenData?.whiteListDropDate) {
      return this.tokenData?.whiteListDropDate || "";
    }
    return this.tokenData?.dropDate || "";
  }

  get showRequestButton() {
    const date = this.chooseDropDateBasedOnWhitelisting;
    if (
      this.loggedIn &&
      !date &&
      !this.whiteListedCollector &&
      this.tokenData?.whiteListDropDate
    ) {
      return true;
    }
    return false;
  }

  get showBuy() {
    let date = this.chooseDropDateBasedOnWhitelisting;
    if (date) {
      return !launchDateIsInFuture(date);
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.uuid = params.uuid;
      this.getTokenDetails(params.uuid);
    });
    this.subscribeToScroll();
    this.checkPublicAddress();
    this.checkIfCollectorIsWhiteListed();
    this.changeCaptchaState(false);
  }

  async checkPublicAddress() {
    try {
      this.publicAddress = await this.nftTokeService.getPublicAddress();
    } catch (error) {
      console.log(error);
    }
  }
  createMetaData() {
    let metaData = [{ name: "twitter:card", content: "summary" }];

    let ogProperty = [
      { property: "og:url", content: window.location.href },

      {
        property: "og:description",
      },
      {
        property: "og:image",
        content:
          this.tokenData?.coverImageKey ||
          this.tokenData?.verticalCoverImage ||
          "https://dev.mysterious.xyz/assets/images/temp/profile01.png",
      },
    ];
    this.meta.addTags([...metaData, ...ogProperty]);
  }

  subscribeToScroll() {
    this.scrollSubject.pipe(debounceTime(100)).subscribe(() => {
      if (this.tokenData?.id) {
        this.pageSubject = {
          ...this.pageSubject,
          page: this.pageSubject.page + 1,
        };
        this.fetchHistory(this.tokenData.id);
      }
    });
  }

  goToRequestPage(tokenId: string) {
    this.router.navigate([`/request/${tokenId}`]);
  }

  checkIfCollectorIsWhiteListed() {
    this.loginService.connectMetaMaskSubject.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.whiteListedCollector = false;
        this.loggedIn = false;
        return;
      }
      this.loggedIn = true;
      this.collectorService
        .getCollectorData()
        .then((collectorData) => {
          if (collectorData.whitelisted) {
            this.whiteListedCollector = true;
          }
          if (collectorData.whitelistRequestSubmitted) {
            this.whitelistRequestSubmitted = true;
          }
          return false;
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getTokenDetails(uuid: string) {
    this.tokenDetailsService.getTokenDetails(uuid).subscribe((tokenData) => {
      this.tokenData = tokenData;
      this.profileDetails = {
        name: tokenData.owner?.username || "",
        avatar:
          tokenData.owner?.image ||
          getDummyProfileImage(tokenData.creator.publicAddress),
      };
      this.checkForDropDate();
      // this.createMetaData();
      this.createBannerData(tokenData);
      this.fetchHistory(tokenData.id);
      this.priceInETH = tokenData.price;
      this.commonService.convertETHToUSD(tokenData.price || 0).then((price) => {
        this.priceInUSD = price;
      });
    });
  }

  fetchHistory(id: string) {
    this.historyLoading = true;
    this.tokenDetailsService
      .getTokenHistory(id, this.pageSubject.page, this.pageSubject.limit)
      .subscribe(
        (res) => {
          this.totalTokenCount = res.totalCount;
          this.historyLoading = false;
          if (this.pageSubject.page == 1) {
            this.tokenHistory = res.data;
          } else {
            this.tokenHistory = this.tokenHistory.concat(res.data);
          }
        },
        (error) => {
          this.tokenHistory = [];
          this.historyLoading = false;
        }
      );
  }
  checkForDropDate() {}
  createBannerData(tokenData: IFeaturedVideo) {
    this.bannerData = tokenData;
  }

  async addToQueue() {
    const queueData = {
      publicAddress: this.publicAddress,
      totalSupply: this.tokenData.totalTokenCount,
      nftTokenId: this.tokenData.id,
    };
    if (!queueData.publicAddress) {
      this.webSocketService.queue.set(this.tokenData.id, false);
      return;
    }
    this.webSocketService.emit("enterQueue", queueData, (response: any) => {
      console.log(response);
      this.webSocketService.queue.set(this.tokenData.id, response.success);
    });
  }

  goToBuyPage() {
    if (this.tokenData.owner?.publicAddress != this.publicAddress) {
      // TODO: BUY QUEUE COMMENTED OUT
      // this.addToQueue();
      this.router.navigate([`buy/${this.uuid}`]);
    } else {
      this.notificationService.showErrorNotification(
        "You are owner, You can not buy this token"
      );
    }
  }

  goTotag(id: number) {
    if (id) {
      this.router.navigate([`/tags/${id}`]);
    }
  }

  goToProfile() {
    if (this.tokenData.owner?.publicAddress) {
      this.router.navigate([`profile/${this.tokenData.owner.publicAddress}`]);
    }
  }

  openUrl(link: string) {
    window.open(link, "_blank");
  }

  scrollHistoryHandler(event: any) {
    if (
      event.srcElement.scrollTop + 330 >= event.srcElement.scrollHeight - 20 &&
      this.totalTokenCount > this.tokenHistory.length
    ) {
      this.loadMore();
    }
  }

  goToPolygonScan() {
    const link = `${environment.blockChainUrl}/address/${environment.mysSCAddress}`;
    window.open(link, "_blank");
  }

  goToPolygonHash(id: string) {
    if (id) {
      const link = `${environment.blockChainUrl}/tx/${id}`;
      window.open(link, "_blank");
    }
  }

  openOnOpenSea() {
    if (this.tokenData?.tokenId) {
      const link = `${environment.polygon_scan_baseurl}/assets/matic/${environment.mysSCAddress}/${this.tokenData.tokenId}`;
      window.open(link, "_blank");
    }
  }

  loadMore() {
    this.scrollSubject.next(true);
  }

  connectMetamask() {
    this.changeCaptchaState(false);
    this.requestService.connectMetamask(this.tokenData.id);
  }
  canBuy() {
    if (
      this.tokenData.totalTokenCount &&
      this.tokenData.totalTokenCount >= 1 &&
      (this.tokenData.totalTokenCount || 0) - (this.tokenData.sales || 0) > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  getProfileImage(address: string) {
    return getDummyProfileImage(address);
  }

  changeCaptchaState(state: boolean) {
    if (state === true) {
      this.token = "";
    }
    this.changedCaptchaState = state;
    this.requestService.setCaptchaState(state);
  }
}
