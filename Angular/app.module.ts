import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterceptInterceptor } from './services/intercept.interceptor';
import { NotificationService } from './services/notification.service';
import { ErrorHandlingService } from './services/error-handling.service';
import { RecaptchaSettings, RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { environment } from '@environments/environment';
import { FormsModule } from '@angular/forms';

const MODULES = [SharedModule]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    BrowserAnimationsModule,
    MODULES
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptInterceptor,
    multi: true,
  },
  {
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.recaptcha.siteKey,
    } as RecaptchaSettings,
  },
    NotificationService,
    {provide: ErrorHandler, useClass: ErrorHandlingService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
