import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { MEDIA_UPLOAD_TYPE, USERTYPE } from 'src/app/enums/enums';
import { AuthService } from "../../../../services/auth.service";
import { registerEmailAndUsernameValidatorCollector, registerEmailAndPhoneValidatorArtist, noWhitespaceValidator } from 'src/app/pages/invite/validators/register.validators';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  constructor(private router: Router, private profileService: ProfileService, private fb: FormBuilder, private auth: AuthService, private commonService : CommonService) { }

  profileForm!: FormGroup;
  MEDIA_UPLOAD_TYPE = MEDIA_UPLOAD_TYPE;
  profileData: any;
  profileCover!: string;
  profileImage!: string;
  userType!: USERTYPE;
  USERTYPE = USERTYPE;
  isLoading = false;
  get collectorProfile() {
    return this.userType == USERTYPE.COLLECTOR;
  }
  profileImageBlob : string = "";
  useBlobForProfileImage = false;

  ngOnInit(): void {
    this.fetchMyProfileData();
  }


  initializeForm(){
    this.profileForm = this.fb.group({
      username: [this.profileData?.username || '', [Validators.required, noWhitespaceValidator], [this.userType == USERTYPE.COLLECTOR ? registerEmailAndUsernameValidatorCollector(this.auth, this.profileData.username) : registerEmailAndPhoneValidatorArtist(this.auth, this.profileData.username)]],
      bio: [this.profileData?.bio || '', [Validators.maxLength(300)]],
      email: [this.profileData?.email || ''],
      twitterUrl: [this.profileData?.twitterUrl || ''],
      instagramUrl: [this.profileData?.instagramUrl || ''],
      cover: [this.profileData?.cover || ''],
      image: [this.profileData?.image || ''],
    })

    this.profileCover = this.profileData?.cover || '';
    this.profileImage = this.profileData?.image || '';

  }

  fetchMyProfileData(){
    this.isLoading= true;
    this.profileService.getUserProfile().subscribe((profileData: any) => {
        this.isLoading= false;
      if (profileData.user) {
        this.profileData = profileData.user;
        this.userType = USERTYPE.ARTIST;
        this.initializeForm();
        return; 
      }
      else if(profileData.collector){

        this.profileData = profileData.collector;
        this.userType = USERTYPE.COLLECTOR;
        this.initializeForm();
      }
      else {
        this.router.navigate(['']);
        return;
      }
    }, error => {
        this.isLoading= false;
        this.router.navigate(['']);
    });
  }

  goToProfile() {
    this.router.navigate([`profile`]);
  }

  uploadProfileImage(key: string) {
    this.profileForm.patchValue({
      image: key,
    })
  }

  uploadCoverImage(key: string) {
    this.profileForm.patchValue({
      cover: key,
    })
  }

  editProfile() {
    if (this.profileForm.invalid) {
      return;
    }
    if(!this.profileForm.value.email){
      delete this.profileForm.value.email;
    }
    this.isLoading = true;
    let data = {};
    if (this.userType == USERTYPE.ARTIST) {
      data = { user: { ...this.profileData, ...this.profileForm.value } };
    } else {
      data = { collector: { ...this.profileData, ...this.profileForm.value } };
    }
    this.profileService.editProfile(data).subscribe((res) => {  
      if(this.useBlobForProfileImage){
        this.commonService.profilePageSubject.next(this.profileImageBlob || '');
      }
      this.router.navigate([`profile`]);
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  uploadProfile(dataBlob: string){
    this.useBlobForProfileImage = true;
    this.profileImageBlob = dataBlob;
  }
}
