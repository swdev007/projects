import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenDetailComponent } from './components/token-detail/token-detail.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import  { AtomModule } from './../../atoms/atom.module';
import { FormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
const routes :Routes= [{
path: '',
component: TokenDetailComponent
}]

const COMPONENTS = [TokenDetailComponent]

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    AtomModule,
    RouterModule.forChild(routes)
  ]
})
export class TokenDetailModule { }
