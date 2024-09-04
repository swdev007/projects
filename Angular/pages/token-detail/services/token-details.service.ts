import { Injectable } from '@angular/core';
import { IFeaturedVideo } from '@shared/interface/interface';
import { Observable } from 'rxjs';
import { StorageKeys } from 'src/app/enums/enums';
import { ApiService } from 'src/app/services/api.service';
import { CollectorService } from 'src/app/services/collector.service';
import { getStorage } from 'src/app/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class TokenDetailsService {

  constructor(private apiService: ApiService, private collectorService: CollectorService) { }


  getHeaders() {
    const accessToken = getStorage(StorageKeys.ACCESS_TOKEN_COLLECTOR) || getStorage(StorageKeys.ACCESS_TOKEN_ARTIST) ;
    return { authorization: `Bearer ${accessToken}` };
  }
  
  public getTokenDetails(uuid: string): Observable<IFeaturedVideo> {
    const headers = this.getHeaders();
    return this.apiService.get(`tokens/${uuid}` , undefined , headers)
  }

  public getTokenHistory(id: string, limit: number , page : number): Observable< { data:any[], totalCount : number }> {
    return this.apiService.get(`history/${id}`, {page : page , limit : limit})
  }
}
