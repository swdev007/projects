import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { IObj } from '../interface/interface';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  openFiltersSubject = new BehaviorSubject(false);
  costOfETHinUSD!: number;
  costOfEthInMatic!: number;
  costOfMaticInUSD!: number;
  costOfETHInUSD!: number;
  collectorData!: IObj;
  profileData!:any;
  profileDataSubject = new Subject<any>();
  profilePageSubject : BehaviorSubject<string> = new BehaviorSubject<string>('');
  
  constructor(private apiService: ApiService) { }

  setProfileData(fetchtedProfileData : any){
    this.profileData = fetchtedProfileData;
    this.profileDataSubject.next(true);
  }
  updateFilterSubject(open: boolean) {
    if (open) {
      document.body.classList.add("active");
      document.body.classList.add("filter");
    } else {
      document.body.classList.remove("active");
      document.body.classList.remove("filter");
    }
    this.openFiltersSubject.next(open);
  }

  getconversionfactorMaticToUSD(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.costOfMaticInUSD) {
        this.apiService.convertMaticToUSD().subscribe((data) => {
          this.costOfMaticInUSD = data.price;
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  }

  getconversionfactorMaticToETH(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.costOfMaticInUSD) {
        this.apiService.convertMATICCtoETH().subscribe((data) => {
          this.costOfEthInMatic = data.price;
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  }
  getconversionfactorETHToUSD(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.costOfETHInUSD) {
        this.apiService.convertETHtoUSD().subscribe((data) => {
          this.costOfETHInUSD = data.price;
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  }

  async convertETHToUSD(price: number): Promise<number> {
    await this.getconversionfactorETHToUSD();
    return + (price * this.costOfETHInUSD);
    }
  async convertMaticToUSD(price: number): Promise<number> {
    await this.getconversionfactorMaticToUSD();
    return +((price * this.costOfMaticInUSD).toFixed(2));
  }

  async convertMaticToETH(price: number): Promise<number> {
    await this.getconversionfactorMaticToETH();
    return (price * this.costOfEthInMatic);
  }

  async convertEthToMatic(price: number): Promise<number> {
    await this.getconversionfactorMaticToETH();
    return (price / this.costOfEthInMatic);
  }

  toFixed(num : number, fixed : number) {
    fixed = fixed || 0;
    fixed = Math.pow(10, fixed);
    return Math.floor(num * fixed) / fixed;
}
  
  checkLastDecimalPlace(n: number = 0, decimalPlaces : number = 1) : number {
    if(n == 0){
      return 0;
    }
    let k = decimalPlaces;
    while( this.toFixed(+n,k) == 0){
      k++;
    }
    return this.toFixed(+n,k+1);
  }
}
