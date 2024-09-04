import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeOverlayComponent } from './components/home-overlay/home-overlay.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';


const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  }
]

const COMPONENTS = [
  HomeOverlayComponent,
  HomeComponent]

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
