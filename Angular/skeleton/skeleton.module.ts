import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const COMPONENTS = [SkeletonComponent];


@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule
  ],
  exports: [...COMPONENTS]
})
export class SkeletonModule { }
