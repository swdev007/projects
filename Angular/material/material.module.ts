import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
const CommonMatModules = [MatFormFieldModule, MatInputModule, MatMenuModule, MatChipsModule, MatProgressSpinnerModule,MatExpansionModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...CommonMatModules],
  exports: [...CommonMatModules],
})
export class MaterialModule { }
