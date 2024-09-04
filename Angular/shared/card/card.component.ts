import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { IToken } from "@shared/interface/interface";
import { VIDEO_COMPONENT_TYPE } from "src/app/enums/enums";
import { launchDateIsInFuture } from "src/app/utils/utils";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit {
  @Input() cardData!: IToken;
  @Input() showTooltip: boolean = false;
  @Input() hiddenUnhidden: boolean = false;
  @Output() toolTipClick: EventEmitter<IToken> = new EventEmitter();
  @Input() whiteListedCollector = false;

  // @ViewChild('myCanvas') canvasRef!: ElementRef;
  @ViewChild('image') image!: ElementRef;

  showToolTipForCard: boolean = false;
  squareTypeVideo : boolean = false;
  nftStreamUrl = '';
  verticalStreamUrl = '';
  hideSkeleton : boolean = false;
  
  getNftStreamUrl(){
    if(new Date(this.cardData?.updated_at || '').getTime() + 20000 < new Date().getTime()){
        return this.cardData?.nftFileKeyStream || ''
    }
    return '';
  }   


  getVerticalVideoStreamUrl(){
    if(new Date(this.cardData?.updated_at || '').getTime() + 20000 < new Date().getTime()){
        return this.cardData?.verticalVideoStream || this.cardData?.nftFileKeyStream || '';
    }
    return '';
  }   

    @Input() videoType = VIDEO_COMPONENT_TYPE.VIDEO_WITH_POSTER_IMAGE;
    imageLoaded = false;

  get chooseDropDateBasedOnWhitelisting() {
    if (this.whiteListedCollector && this.cardData.whitelist_drop_date) {
      return this.cardData.whitelist_drop_date || '';
    }
    return this.cardData?.drop_date || '';
  }

  get getCardGif() {
    if(this.cardData?.nftFileKeyGif) return this.cardData.nftFileKeyGif;
    return null;
  }


  get getShowBannerOrVideo() {
    if(this.cardData?.autoplay === true) return false;
    if(!(this.cardData?.isListed === undefined  || this.cardData?.isListed)){
        return true;
    }
    let date = this.chooseDropDateBasedOnWhitelisting;
    if (!date) {
      return true;
    }
    return launchDateIsInFuture(date);
  }

  get verticalVideo() {
    return this.cardData?.vertical_video?.includes('https') ? this.cardData?.vertical_video : null
  }

  get verticalCoverImage() {
    return this.cardData?.vertical_cover_image?.includes('https') ? this.cardData?.vertical_cover_image : null
  }

  get showPriceOrDate() {
    let date = this.chooseDropDateBasedOnWhitelisting;
    if (!date) {
      return false;
    }
    return launchDateIsInFuture(date);
  }

  get soldOut() {
    return (this.cardData?.sales && this.cardData?.totalTokenCount && +this.cardData.sales === +this.cardData.totalTokenCount);
  }
  constructor() { }

  ngOnInit(): void { 
      this.nftStreamUrl = this.getNftStreamUrl();
      this.verticalStreamUrl = this.getVerticalVideoStreamUrl();
  }


  openMenuAction(event: Event) {
    event.stopPropagation();
  }

  toggleVideoState(state: boolean) {
    if (this.cardData?.nft_file_key) {
      this.cardData["hover"] = state;
    }
  }

  toolTipClickEvent(): void {
    this.toolTipClick?.emit(this.cardData);
  }
  loaded() {
    this.hideSkeleton = true;
    // let ctx = this.canvasRef.nativeElement.getContext('2d');
    // ctx.imageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
    // ctx.drawImage(this.image.nativeElement, this.image.nativeElement.width/2 - 5, this.image.nativeElement.height/2 - 5,10,10,0, 0,400,400);    
    // setTimeout(()=>{
    // }, 1500);
    this.imageLoaded = true;
  }

  squareVideo() {
    this.squareTypeVideo = true;
  }

}
