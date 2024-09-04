import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.scss']
})
export class ProfileBannerComponent implements OnInit {

  constructor(private profileService: ProfileService) { }

  get bannerImage() {
    return this.profileService?.profileData?.cover || '';
  };

  ngOnInit(): void {
  }

}
