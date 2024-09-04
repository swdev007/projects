import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "@shared/shared.module";
import { AddMintGuard } from "./add-mint/guards/add-mint.guard";
import { MintInviteGuard } from "./add-mint/guards/mint-invite.guard";
import { BuyNftGuard } from "./buy-nft/guard/buy-nft.guard";


const routes: Routes = [
  {
    path: "collection",
    loadChildren: () => import("./newHome/home.module").then((m) => m.HomeModule),
    data : { isHomePage : true , nonWhiteListFlow: true},
  },
  {
    path: "tags/:tagId",
    loadChildren: () => import("./tags/tags.module").then((m) => m.TagsModule),
    data: { nonWhiteListFlow: true }
  },
  {
    path: "artwork/:uuid",
    loadChildren: () =>
      import("./token-detail/token-detail.module").then(
        (m) => m.TokenDetailModule
      ),
      data: { nonWhiteListFlow: true }
  },
  {
    path: "mintlist",
    loadChildren: () =>
      import("./invite/invite.module").then(
        (m) => m.InviteModule
      ),
    data: { nonWhiteListFlow: false }
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule),
    data: { nonWhiteListFlow: true }
  },
  {
    path: "buy/:uuid",
    loadChildren: () => import('./buy-nft/buy-nft.module').then((m) => m.BuyNftModule),
    canActivate: [BuyNftGuard],
    data: { nonWhiteListFlow: true }
  },
  {
    path: "add-mint",
    loadChildren: () => import("./add-mint/add-mint.module").then((m) => m.AddMintModule),
    canActivate: [AddMintGuard],
    data: { nonWhiteListFlow: true }
  },
  {
    path: "about-old",
    loadChildren: () => import("./about/about.module").then((m) => m.AboutModule),
    data: { nonWhiteListFlow: true }
  },
  {
    path: "mint-invite/:uuid",
    loadChildren: () => import("./add-mint/add-mint.module").then((m) => m.AddMintModule),
    canActivate: [MintInviteGuard],
    data: { nonWhiteListFlow: true }
  },
  {
    path: "404",
    loadChildren: () => import("./error404/error404.module").then((m) => m.Error404Module),
    data: { nonWhiteListFlow: true, about: true }
  },
  {
    path: "share",
    loadChildren: () => import("./share-page/share-page.module").then((m) => m.SharePageModule),
    data: { nonWhiteListFlow: true }
  },
  {
    path: "auth",
    loadChildren: () => import("./authorize/authorize.module").then((m) => m.AuthorizeModule),
    data: { nonWhiteListFlow: false }
  },
  // {
  //   path: "",
  //   loadChildren: () => import("./loader/loader.module").then((m) => m.LoaderModule),
  //   data: { isLoaderPage : true }
  // },
  {
    path: "whitelist",
    loadChildren: () => import("./whitelist/whitelist.module").then((m) => m.WhitelistModule),
    data: { whiteListFlow: true }
  },
  {
    path: "faq",
    loadChildren: () => import("./faq/faq.module").then((m) => m.FaqModule),
    data: { nonWhiteListFlow: true , about: true}
  },
  {
    path: "privacy",
    loadChildren: () => import("./privacy-policy/privacy-policy.module").then((m) => m.PrivacyPolicyModule),
    data: { nonWhiteListFlow: true , about: true}
  },
  {
    path: "approveMarket",
    loadChildren: () => import("./market-approval/market-approval.module").then((m) => m.MarketApprovalModule),
    data: { nonWhiteListFlow: true }
  },
  {
    path: "sample-animation",
    loadChildren: () => import("./animations/animations.module").then((m) => m.AnimationsModule),
    data: { nonWhiteListFlow: true }
  },
  {
    path : "request/:id",
    loadChildren: () => import("./request-whitelist/request-whitelist.module").then((m)=> m.RequestWhitelistModule),
    data : { nonWhiteListFlow: true }
  },
  {
    path : "terms",
    loadChildren: () => import("./terms-of-service/terms-of-service.module").then((m) => m.TermsOfServiceModule),
    data : { nonWhiteListFlow: true , about: true}
  },
  {
    path : "login",
    loadChildren: () => import("./login/login.module").then((m) => m.LoginModule),
    data : { nonWhiteListFlow: true, about: true }
  },
  {
    path : "",
    loadChildren : () => import('./about-new/about.module').then((m)=> m.AboutModule),
    data: { nonWhiteListFlow: true, about: true }
  },
  {
    path: "**",
    redirectTo: "404",
    pathMatch: "full"
  }
];

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class PagesModule { }
