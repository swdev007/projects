import { Component, OnDestroy, OnInit, Input, AfterViewChecked } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { setFooterHeight } from '../../utils/utils';

export interface FooterLinks {
  name: string,
  url: string
}
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy, AfterViewChecked {
  quickLinks: FooterLinks[] = [
          // { name: 'Collection', url: 'collection' }, 
          { name: 'Privacy', url: 'privacy' }, 
          { name: 'Terms of Service', url: 'terms' }, 
          // { name: 'FAQ', url: 'faq' }
        ];
  resizeSubscription$: Subscription | undefined;

  constructor() { }
  @Input() nonWhiteListFlow = false;
  
  ngOnInit(): void {
    this.resizeSubscription$ = fromEvent(window, 'resize').pipe((distinctUntilChanged(), debounceTime(100))).subscribe(() => {
      setFooterHeight();
    })
  }

  ngAfterViewChecked(): void {
    setFooterHeight();
  }

  ngOnDestroy(): void {
    this.resizeSubscription$?.unsubscribe()
  }
}
