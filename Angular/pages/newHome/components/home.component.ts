import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { fromEvent, Subject, Subscription } from "rxjs";
import { debounceTime, takeUntil, tap } from "rxjs/operators";
import { IArtistItem, ITokenQuery } from "../interface/home.interface";
import {
  IFeaturedVideo,
  IToken,
  ITokensList,
} from "@shared/interface/interface";

import { HomeService } from "../home.service";
import { CollectorService } from "src/app/services/collector.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject();
  list: IToken[] = [];
  data!: ITokensList;
  artist!: IArtistItem[];
  timer: any;
  isLoading: boolean = true;
  collectorWhiteList = false;
  homePageBannerData!: IFeaturedVideo | undefined;
  scrollSubscription!: Subscription;
  showBannerSkeleton = true;
  loggedIn = false;
  whitelistRequestSubmitted = false;

  constructor(
    private homeService: HomeService,
    private router: Router,
    private collectorServcice: CollectorService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.updatePagiationSubject();
    this.getArtWork();
    this.addScrollObserver();
    this.addPaginationSubscription();
    this.checkIsCollectorIsWhiteListed();
  }

  updatePagiationSubject() {
    const currentFilters: ITokenQuery = this.homeService.paginatorSubject.value;
    this.homeService.updatePaginatorSubject({ ...currentFilters, page: 1 });
  }
  checkIsCollectorIsWhiteListed() {
    this.loginService.connectMetaMaskSubject.subscribe((isLoggedIn) => {
      if(!isLoggedIn) {
        this.collectorWhiteList = false;
        this.loggedIn = false;
        this.whitelistRequestSubmitted = false;
        return ;
      }
      this.loggedIn = true;
      this.collectorServcice
        .getCollectorData()
        .then((collectorData) => {
          if (collectorData.whitelisted) {
            this.collectorWhiteList = true;
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

  addPaginationSubscription() {
    this.homeService.paginatorSubject
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (data) => {
          let { creator, ...others } = data;
          let paginations: ITokenQuery = { ...others };
          if (creator) {
            paginations["creator"] = creator;
          }
          this.getTokenList(paginations);
        },
      });
  }

  addScrollObserver() {
    this.scrollSubscription = fromEvent(window, "scroll")
      .pipe(debounceTime(300), takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.onWindowScroll();
      });
  }

  getArtWork(showLoader = true) {
    this.homePageBannerData = undefined;
    if (showLoader) this.showBannerSkeleton = true;
    this.homeService
      .getArtWork()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res: IFeaturedVideo) => {
          this.showBannerSkeleton = false;
          this.homePageBannerData = { ...res };
        },
        error: (err: any) => {
          this.showBannerSkeleton = false;
          console.error(err);
        },
      });
  }

  getTokenList(payload: ITokenQuery) {
    this.isLoading = true;
    if (!payload?.page) {
      this.list = [];
    }
    this.homeService.getTokenList(payload).subscribe({
      next: (res: ITokensList) => {
        if (res?.data) {
          res?.data.forEach((item: IToken) => {
            item["hover"] = false;
          });
          this.data = res;
          const currentFilters: ITokenQuery =
            this.homeService.paginatorSubject.value;
          if (currentFilters?.page! < 1) {
            this.list = res?.data;
          } else {
            this.list = [...this.list, ...res?.data];
          }
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  loadMore() {
    const currentFilters: ITokenQuery = this.homeService.paginatorSubject.value;
    if (
      currentFilters &&
      this.data &&
      this.data.totalCount > this.list.length
    ) {
      const page = (currentFilters.page || 0) + 1;
      this.homeService.updatePaginatorSubject({
        page,
      });
    }
  }

  onWindowScroll() {
    if (
      window.screen.height + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 100
    ) {
      this.loadMore();
    }
  }

  zeroTimeHandler() {
    this.getArtWork(true);
  }
  goToDetailsPage(tokenData: IToken) {
    this.router.navigate([`/artwork/${tokenData.uuid}`]);
  }

  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }
}
