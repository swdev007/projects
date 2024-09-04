import { Component, OnDestroy, OnInit } from '@angular/core';
import { IFeaturedVideo, IToken } from '@shared/interface/interface';
import { ITabSelected, PROFILE_TAB_TYPE } from '../../enums/enums';
import { IConfirmationPopup } from '@shared/interface/interface';

import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { VIDEO_COMPONENT_TYPE } from "src/app/enums/enums";
import { LoginService } from 'src/app/services/login.service';
import { CollectorService } from 'src/app/services/collector.service';
@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss']
})
export class ProfileContentComponent implements OnInit, OnDestroy {

  constructor(private router: Router, public profileService: ProfileService, private loginService : LoginService, private collectorServcice : CollectorService) { }
  isLoading: boolean = false;
  profileTabType = PROFILE_TAB_TYPE;
  tabSelected: ITabSelected = this.profileTabType.COLLECTION;
  showConfirmationPopup = false;
  confirmationPopupData: IConfirmationPopup = { heading: "", subheading: "" };
  list!: IToken[];
  scrollSubscription!: Subscription;
  private _unsubscribeAll: Subject<void> = new Subject();
  page = 1;
  limit = 9;
  totalCount!: number;


  collectorWhiteList : boolean = false;

  ngOnInit(): void {
    this.addScrollObserver();
    this.checkIsCollectorIsWhiteListed();
  }

  
    checkIsCollectorIsWhiteListed() {
      this.loginService.connectMetaMaskSubject.subscribe((isLoggedIn) => {
        if(!isLoggedIn) {
          this.collectorWhiteList = false;
          return ;
        }
        this.collectorServcice
          .getCollectorData()
          .then((collectorData) => {
            if (collectorData.whitelisted) {
              this.collectorWhiteList = true;
            }
            return false;
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }
  hideUnhideItem(cardData: IToken): void {
    if (cardData.is_hidden) {
      this.confirmationPopupData = {
        heading: "Hide NFT",
        subheading: "Are you sure you want to hide NFT?"
      }
    } else {
      this.confirmationPopupData = {
        heading: "Unhide NFT",
        subheading: "Are you sure you want to unhide NFT?"
      }
    }
    this.showConfirmationPopup = true;
  }

  popupActionHandler(action: boolean): void {
    this.showConfirmationPopup = false;
  }

  changeTab(tab: ITabSelected): void {
    this.list = []
    this.tabSelected = tab;
    this.page = 1;
    this.getData();
  }

  getData() {
    this.isLoading = true;
    let publicAddress = this.profileService.anotherProfile ? this.profileService.publicAddress : '';
    console.log(publicAddress);
    switch (this.tabSelected) {
      case this.profileTabType.COLLECTION:
        this.profileService.getUserCollections(this.page, this.limit, publicAddress).subscribe((res: any) => {
          let list = this.convertToTokensType([...res.data]);
          this.totalCount = res.totalCount;
          this.isLoading = false;
          this.handlePages(list);
        })
        break;
      case this.profileTabType.CREATED:
        this.profileService.getUserCreatedCollection(this.page, this.limit, publicAddress).subscribe((res: any) => {
          let list = this.convertToTokensType([...res.data]);
          this.totalCount = res.totalCount;
          this.isLoading = false;
          this.handlePages(list);
        })
        break;
    }
  }

  handlePages(list: IToken[]) {
    if (this.page == 1) {
      this.list = [...list]
    } else {
      this.list = [...this.list, ...list];
    }
    console.log(this.list);
  }
  convertToTokensType(data: IFeaturedVideo[]) {
    let list: IToken[] = [];
    data.forEach((el: IFeaturedVideo) => {
      list.push({ username: this.tabSelected == this.profileTabType.CREATED ? this.profileService.profileData?.username  || '': el.username || '', description: el.description, nft_file_key: el.nftFileKey, uuid: el.uuid, tokenId: (el.tokenId || '').toString(), title: el.title || '', cover_image_key: el.coverImageKey || '', vertical_video: el.verticalVideo || '', drop_date: el.dropDate || '', owner_id: el.ownerId || '', is_featured: el?.isFeatured ? true : false, vertical_cover_image: el.verticalCoverImage || '', created_at: el.createdAt || '', verticalCoverImage: el.verticalCoverImage || '', nftFileKeyStream : el.nftFileKeyStream , verticalVideoStream : el.verticalVideoStream ,ethRaised : el?.ethRaised || '0', updated_at: el.updatedAt , sales : el.sales , whitelist_drop_date : el.whiteListDropDate || '' , totalTokenCount : el.totalTokenCount, isListed : el.isListed || false , publicAddress : el.publicAddress , nftFileKeyGif :el.nftFileKeyGif, autoplay : el.autoplay })
    })
    return list;
  }

  loadMore(): void {
    if(!this.page || !this.totalCount){
      return;
    }
    this.page = this.page+1;
    if (this.list.length < this.totalCount) {
      this.getData();
    }
  }

  addToken() {
    this.router.navigate(['add-mint']);
  }
  redirectToArtwork(tokendata: IToken): void {
    this.router.navigate([`/artwork/${tokendata.uuid}`])
  }

  onWindowScroll() {
    if (
      window.screen.height + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 100
    ) {
      this.loadMore();
    }
  }

  addScrollObserver() {
    this.scrollSubscription = fromEvent(window, "scroll")
      .pipe(
        debounceTime(300),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        console.log('window scroll');
        this.onWindowScroll()
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

  }
}
