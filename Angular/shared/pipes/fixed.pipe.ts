import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Pipe({
  name: 'fixed'
})
export class FixedPipe implements PipeTransform {

  constructor(private commonService: CommonService) {}

  transform( value : number | string , fixed : number = 2, type = ''): string | number {
    if(type == '$'){
      if(value > 10){
        return (+value).toFixed(0)
      }
      else{
        return (+value).toFixed(fixed)
      }
    }else{
      
      const natural = +value.toString().split('.')[0];
      const decimal = this.commonService.checkLastDecimalPlace(+('0.' + (value.toString().split('.')[1] || '0')));
      return natural + decimal;
    }
  }

}
