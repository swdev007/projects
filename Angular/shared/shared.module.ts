import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AtomModule } from 'src/app/atoms/atom.module';
import { SkeletonModule } from '../skeleton/skeleton.module';
import { CardComponent } from './card/card.component';
import { NoDataComponent } from './no-data/no-data.component';
import { BannerComponent } from './banner/banner.component';
import { NotificationComponent } from './notification/notification.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MediaUploadComponent } from './media-upload/media-upload.component';
import { CardListComponent } from './card-list/card-list.component';
import { MaterialModule } from '../material/material.module';
import { CounterComponent } from './counter/counter.component';
import { StepperComponent } from './stepper/stepper.component';
import { ChipsComponent } from './chips/chips.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { VideoComponent } from './video/video.component';
import { PublicAddressPipe } from './pipes/public-address.pipe';
import { ButtonLoaderComponent } from './button-loader/button-loader.component';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { FixedPipe } from './pipes/fixed.pipe';
import { TwitterShareComponent } from './twitter-share/twitter-share.component';
import {RouterModule} from '@angular/router';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  CardComponent,
  NoDataComponent,
  BannerComponent,
  NotificationComponent,
  ConfirmationComponent,
  MediaUploadComponent,
  CardListComponent,
  CounterComponent,
  StepperComponent,
  ChipsComponent,
  ProgressBarComponent,
  ProfileCardComponent,
  SearchDropdownComponent,
  VideoComponent,
  PublicAddressPipe,
  FixedPipe,
  ButtonLoaderComponent,
  VjsPlayerComponent,
  TwitterShareComponent
]

const MODULES = [AtomModule, SkeletonModule, MaterialModule,RouterModule, 
  FormsModule,
  RecaptchaFormsModule,
  RecaptchaModule,]

@NgModule({
  declarations: [
    COMPONENTS,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShareButtonsModule,
    MODULES
  ],
  exports: [
    COMPONENTS,
    MODULES
  ],
  providers: [
    PublicAddressPipe,
    FixedPipe
  ]
})
export class SharedModule { }
