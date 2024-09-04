import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSidebarComponent } from './components/profile-sidebar/profile-sidebar.component';
import { ProfileWrapperComponent } from './components/profile-wrapper/profile-wrapper.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileBannerComponent } from './components/profile-banner/profile-banner.component';
import { ProfileContentComponent } from './components/profile-content/profile-content.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { ProfileOfferTableComponent } from './components/profile-offer-table/profile-offer-table.component';
import { AtomModule } from './../../atoms/atom.module';
import { SharedModule } from './../../shared/shared.module';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ProfileSidebarComponent,
    ProfileWrapperComponent,
    ProfileBannerComponent,
    ProfileContentComponent,
    ProfileTabsComponent,
    ProfileOfferTableComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AtomModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
