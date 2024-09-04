import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { USERTYPE } from 'src/app/enums/enums';
import { ITabSelected, PROFILE_TAB_TYPE } from '../../enums/enums';
import { ProfileService } from '../../services/profile.service';


@Component({
    selector: 'app-profile-tabs',
    templateUrl: './profile-tabs.component.html',
    styleUrls: ['./profile-tabs.component.scss']
})
export class ProfileTabsComponent implements OnInit {
    @Input() type: 'tab' | 'dropdown' = 'dropdown';
    @Output() changeTab: EventEmitter<ITabSelected> = new EventEmitter();
    profileTabType = PROFILE_TAB_TYPE;
    selectedTab!: ITabSelected;
    viewTabsDropdown = false;
    constructor(public profileService: ProfileService) { }

    ngOnInit(): void {
            if(this.profileService.userType == 'artist'){
                this.selectTab(this.profileTabType.CREATED);
            }
            else{
                this.selectTab(this.profileTabType.COLLECTION);
            }
    }

    selectTab(selectTab: ITabSelected) {
        if(this.selectedTab == selectTab) 
        return;
        this.selectedTab = selectTab;
        this.viewTabsDropdown = false;
        this.changeTab.emit(selectTab);
    }

    showDropdown(): void {
        this.viewTabsDropdown = !this.viewTabsDropdown;
    }
}
