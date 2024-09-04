import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './components/error404/error404.component';
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [{
  path: '',
  component: Error404Component
}]

@NgModule({
  declarations: [
    Error404Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class Error404Module { }
