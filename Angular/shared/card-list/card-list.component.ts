import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { VIDEO_COMPONENT_TYPE } from "src/app/enums/enums";
import { IToken } from "../interface/interface";

@Component({
  selector: "app-card-list",
  templateUrl: "./card-list.component.html",
  styleUrls: ["./card-list.component.scss"],
})
export class CardListComponent implements OnInit {
  get counter() {
    return !this.list.length ? new Array(12) : new Array(3);
  }
  @Input() list!: IToken[];
  @Input() isLoading: boolean = false;
  @Input() showToolTip: boolean = false;
  @Output() clickAction: EventEmitter<IToken> = new EventEmitter();
  @Output() toolTipEvent: EventEmitter<IToken> = new EventEmitter();
  @Input() whiteListedCollector: boolean = false;
  @Input() className: string = '';   
  @Input() videoType = VIDEO_COMPONENT_TYPE.VIDEO_WITH_POSTER_IMAGE; 
  @Input() loggedIn = false;
  skeletons: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(private router: Router) { }

  ngOnInit(): void { }

  itemClick(token: IToken) {
    if(token.isListed || token.isListed === undefined){
      this.clickAction.emit(token);
    }
  }
  toolTipEventHandler(event: IToken) {
    this.toolTipEvent.emit(event);
  }
}
