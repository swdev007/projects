import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditProfileComponent } from "./components/edit-profile/edit-profile.component";
import { ProfileWrapperComponent } from "./components/profile-wrapper/profile-wrapper.component";
import { ProfileGuard } from "./guards/profile.guard";

const routes: Routes = [
  {
    path: "",
    component: ProfileWrapperComponent,
    canActivate: [ProfileGuard]
  },

  {
    path: "edit",
    component: EditProfileComponent,
    canActivate: [ProfileGuard]
  },
  {
    path: ":publicAddress",
    component: ProfileWrapperComponent,
    canActivate: [ProfileGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
