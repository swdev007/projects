import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'publicAddress'
})
export class PublicAddressPipe implements PipeTransform {

  transform(publicAddress: string, startCount : number = 6 , endCount : number = 4): string {
    let start = publicAddress.substring(0, startCount);
    let end = publicAddress.substring(publicAddress.length - endCount, publicAddress.length);
    return start + '...' + end;
  }

}