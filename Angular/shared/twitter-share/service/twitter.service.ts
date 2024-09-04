import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
@Injectable({
  providedIn: 'root'
})
export class TwitterService{

  constructor(private httpClient : HttpClient, private apiService: ApiService) { }
  client:any ;


  requestToken(uuid: string) : Observable<any>{
    return this.apiService.get(`twitter/login/${uuid}`);
  }

  postOnTwitter(params:any) : Observable<any>{
    return this.apiService.get('twitter/callback' , { ...params });
  }
}
