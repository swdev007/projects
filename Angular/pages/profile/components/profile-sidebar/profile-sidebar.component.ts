import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/app/services/common.service";
import { ProfileService } from "../../services/profile.service";
import { getDummyProfileImage } from "src/app/utils/utils";

@Component({
  selector: "app-profile-sidebar",
  templateUrl: "./profile-sidebar.component.html",
  styleUrls: ["./profile-sidebar.component.scss"],
})
export class ProfileSidebarComponent implements OnInit, OnDestroy {
  constructor(
    public profileService: ProfileService,
    private router: Router,
    private commonService: CommonService
  ) {}

  profileData: any;
  showCopiedToolTip = false;
  textCopyTimeout!: NodeJS.Timeout;

  ngOnInit(): void {
    this.profileData = this.profileService.profileData;
    this.checkForImageIfUploaded();
  }

  checkForImageIfUploaded() {
    if (this.profileService.anotherProfile) {
      this.profileData.image = this.profileData.image;
    } else {
      this.profileData.image =
        this.commonService.profilePageSubject.value || this.profileData.image;
    }
  }

  copyPublicAddress(text: string) {
    navigator.clipboard.writeText(text);
    this.showCopiedToolTip = true;
    clearTimeout(this.textCopyTimeout);
    this.textCopyTimeout = setTimeout(() => {
      this.showCopiedToolTip = false;
    }, 1000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.textCopyTimeout);
  }

  goToEditProfile() {
    if (!this.profileService.profileData) {
      this.router.navigate(["mintlist/artist"]);
      return;
    }
    this.router.navigate(["/profile/edit"]);
  }

  getProfileImage() {
    return getDummyProfileImage(this.profileData.publicAddress);
  }
}
