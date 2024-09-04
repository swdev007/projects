import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ActivationStart, Router } from "@angular/router";
import { environment } from "@environments/environment";
import { Subscription } from "rxjs";
import { GoogleAnalyticsService } from "./services/google-analytics.service";
import { LoginService } from "./services/login.service";
import { NftTokenService } from "./services/nft-token.service";
import { WebSocketService } from "./services/socket.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "";
  nonWhiteListFlow: boolean = false;
  routerChangeEventSubscription!: Subscription;
  isLoaderPage: boolean = false;
  isHomePage: boolean = false;
  aboutPage: boolean = false;

  constructor(
    private router: Router,
    private nftTokenService: NftTokenService,
    private loginService: LoginService,
    private webSocketService: WebSocketService,
    private route: ActivatedRoute,
    private readonly googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.routerChangeEventSubscription = this.router.events.subscribe(
      (event) => {
        if (event instanceof ActivationStart) {
          this.nonWhiteListFlow =
            event.snapshot.data?.nonWhiteListFlow || false;
          this.isLoaderPage = event.snapshot.data?.isLoaderPage || false;
          this.isHomePage = event.snapshot.data.isHomePage || false;
          this.aboutPage = event.snapshot.data?.about || false;
        }
      }
    );
    this.checkAuthorization();
    this.initializeSockets();
    this.checkForMetaMask();
    this.subscribeToAccountChange();
    this.checkForChainIdChange();
    this.googleAnalyticsService.initialize();
  }

  checkAuthorization() {
    if (environment.checkStatus && !sessionStorage.getItem("isVerified")) {
      this.router.navigate(["/auth"], {
        queryParams: {
          redirection:
            window.location.href.replace(window.location.origin, "") || "",
        },
      });
      return false;
    }
    return true;
  }
  initializeSockets() {
    this.webSocketService.listen("connected").subscribe((data: any) => {
      console.log("connected", data);
      this.webSocketService.listen("queue").subscribe((data: any) => {
        this.webSocketService.queue.delete(data.id);
      });
    });
  }
  checkForMetaMask() {
    this.nftTokenService.detectMetaMask();
  }

  async checkForChainIdChange() {
    try {
      const provider = await this.nftTokenService.hasMetaMask();
      if (provider) {
        provider.on("chainChanged", (chainId: string) => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async subscribeToAccountChange() {
    try {
      const provider = await this.nftTokenService.hasMetaMask();
      if (provider) {
        provider.on("accountsChanged", () => {
          this.logout();
          // window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  ngOnDestroy(): void {
    this.routerChangeEventSubscription.unsubscribe();
  }

  logout() {
    if (this.loginService.loggedIn) {
      this.router.navigate([""]);
      this.loginService.logout();
    }
  }
}
