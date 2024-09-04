import { Component, OnInit, Input, OnChanges, OnDestroy, Output , EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IToken } from '@shared/interface/interface';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ITags } from 'src/app/pages/add-mint/interface/interface';
import { ISearchQuery } from './interface/interface';
import { SearchService } from './service/search.service';
import { getDummyProfileImage } from "src/app/utils/utils";

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss']
})
export class SearchDropdownComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private searchService: SearchService, private router: Router) { }

  @Input() searchString: string = "";
  @Output() searchHasResult : EventEmitter<boolean> = new EventEmitter<boolean>();
  paginatorSubject: BehaviorSubject<ISearchQuery> = new BehaviorSubject<ISearchQuery>({ page: 1, limit: 5, search: "", type: ['tags', 'tokens', 'user'], tags: [] });
  searchSubject = new Subject<string>();

  tokensList: IToken[] = [];
  tags: ITags[] = [];
  users: any[] = [];
  totalTokensCount = 0;
  totalTagsCount = 0;
  totalUsersCount = 0;
  currentTokenPage = 1;
  currentUserPage = 1;
  currentTagsPage = 1;
  tokensAssociatedWithTags: any[] = [];
  tokensAssociatedWithTagsCount = 0;

  tokenLoader = false;
  userLoader = false;
  tagsLoader = false;

  isLoading = false;

  paginationSubscription!: Subscription;

  ngOnInit(): void {
    this.subscribeToPagination();
  }

  showLoaders(){
    if (this.paginatorSubject.value.type.includes('user')) {
      this.userLoader = true;  
    } 
    if (this.paginatorSubject.value.type.includes('tokens')) {
      this.tokenLoader = true;
    }
    if (this.paginatorSubject.value.type.includes('tags')) {
      this.tagsLoader = true;
    }
  }

  hideLoaders(){
    if (this.paginatorSubject.value.type.includes('user')) {
      this.userLoader = false;  
    } 
    if (this.paginatorSubject.value.type.includes('tokens')) {
      this.tokenLoader = false;
    }
    if (this.paginatorSubject.value.type.includes('tags')) {
      this.tagsLoader = false;
    }
  }
  subscribeToPagination() {
    this.paginationSubscription = this.paginatorSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.isLoading = true;
      this.showLoaders()
      this.searchService.searchTokens(this.paginatorSubject.value).subscribe((res) => {
        this.hideLoaders();
        this.isLoading = false;
        if (this.paginatorSubject.value.page == 1) {
          if (this.paginatorSubject.value.type.includes('user')) {
            this.users = res?.user.data || [];
          }
          if (this.paginatorSubject.value.type.includes('tokens')) {
            this.tokensList = res?.tokens.data || [];;
          }
          if (this.paginatorSubject.value.type.includes('tags')) {
            this.tags = res?.tags.data || [];
          }
        } else {
          if (this.paginatorSubject.value.type.includes('user')) {
            this.users = this.users.concat(res?.user.data || []);
          }
          if (this.paginatorSubject.value.type.includes('tokens')) {
            this.tokensList = this.tokensList.concat(res?.tokens.data || []);
          }
          if (this.paginatorSubject.value.type.includes('tags')) {
            this.tags = this.tags.concat(res?.tags.data || []);
          }
        }

        if(!this.tags.length && !this.tokensList.length && !this.users.length){
            this.searchHasResult.emit(false);
        }else{
            this.searchHasResult.emit(true);
        }

        this.paginatorSubject.value.type.forEach((el) => {
          if (el == 'tags') {
            this.currentTagsPage = this.paginatorSubject.value.page;
            this.totalTagsCount = res?.tags.count || 0;
          }
          if (el == 'tokens') {
            this.currentTokenPage = this.paginatorSubject.value.page;
            this.totalTokensCount = res?.tokens.count || 0;
          }
          if (el == 'user') {
            this.currentUserPage = this.paginatorSubject.value.page;
            this.totalUsersCount = res?.user.count || 0;
          }
        })
      }, error => {
        console.log(error);
      })
    })
  }
  ngOnChanges(): void {
    this.tokensList = [];
    this.isLoading = true;
    this.tokensList = [];
    this.tags = [];
    this.users = [];
    if (this.searchString) {
      this.paginatorSubject.next({ page: 1, limit: 5, search: this.searchString, type: ['tags', 'tokens', 'user'], tags: [] });
    }
  }

  goToNftDetails(token: IToken) {
    this.router.navigate([`artwork/${token.uuid}`])
  }

  loadMore(type: string) {
    switch (type) {
      case "tags":
        this.paginatorSubject.next({ ...this.paginatorSubject.value, page: this.currentTagsPage + 1, type: [type] });
        break;
      case "user":
        this.paginatorSubject.next({ ...this.paginatorSubject.value, page: this.currentUserPage + 1, type: [type] });
        break;
      case "tokens":
        this.paginatorSubject.next({ ...this.paginatorSubject.value, page: this.currentTokenPage + 1, type: [type] });
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.paginationSubscription.unsubscribe();
  }


  goToProfile(user: any) {
    this.router.navigate([`/profile/${user.publicAddress}`]);
  }

  selectTag(tag: ITags) {
    this.router.navigate([`/tags/${tag.id}`]);
  }

  getProfileImage(address:string) {
    return getDummyProfileImage(address);
  }


}
