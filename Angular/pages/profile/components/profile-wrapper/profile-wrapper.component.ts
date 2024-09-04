import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { USERTYPE } from 'src/app/enums/enums';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-profile-wrapper',
  templateUrl: './profile-wrapper.component.html',
  styleUrls: ['./profile-wrapper.component.scss']
})
export class ProfileWrapperComponent implements OnInit {

  constructor(private router: Router, public profileService: ProfileService, private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  isLooading : boolean = false
  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(){
    this.profileService.profileData = undefined;
    this.profileService.userType = USERTYPE.COLLECTOR;

    const { publicAddress } =  this.route.snapshot.params;
    if(publicAddress){
      this.fetchOtherProfileData(publicAddress);
    }else{
     this.fetchMyProfileData()
    }
 
  }

  fetchOtherProfileData(publicAddress : string){
      this.isLooading = true;
    this.profileService.getUserProfileByPublicAddress(publicAddress).subscribe((profileData: any) => {
        this.isLooading = false;
      if (profileData.user) {
        this.profileService.profileData = profileData.user;
        this.profileService.userType = USERTYPE.ARTIST;
        return;
      }
      this.profileService.profileData = profileData.collector;
      this.profileService.userType = USERTYPE.COLLECTOR;
      return;
    }, error => {
        this.isLooading = false;
    })
  }

  fetchMyProfileData(){
    this.isLooading= true;
    this.profileService.getUserProfile().subscribe((profileData: any) => {
        this.isLooading= false;
      if (profileData.user) {
        this.profileService.profileData = profileData.user;
        this.profileService.userType = USERTYPE.ARTIST;
        return;
      }
      this.profileService.profileData = profileData.collector;
      this.profileService.userType = USERTYPE.COLLECTOR;
    }, error => {
        this.isLooading= false;
    });
  }
  navigateToEditProfile() {
    if (!this.profileService.profileData) {
      this.router.navigate(['mintlist/artist']);
      return;
    }
    this.router.navigate(['/profile/edit']);
  }
}
