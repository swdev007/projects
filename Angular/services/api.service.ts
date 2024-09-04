import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "@environments/environment";
const base = environment.apiHost;
const baseOld = environment.apiHostOld;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  public getOld<T>(urlPath: string, options: { [param: string]: any } = {}): Observable<T> {
    return this.httpClient.get<T>(`${baseOld}/${urlPath}/`, options);
  }

  public get<T>(urlPath: string, options: { [param: string]: any } = {}, headers: { [param: string]: any } = {}): Observable<T> {
    return this.httpClient.get<T>(`${base}/${urlPath}/`, { params: options, headers: headers });
  }

  public post<T>(urlPath: string, body: any, options: { [param: string]: any } = {}): Observable<T> {
    return this.httpClient.post<T>(`${base}/${urlPath}/`, body, options);
  }

  public patch<T>(urlPath: string, body: any, options: { [param: string]: any }): Observable<T> {
    return this.httpClient.patch<T>(`${base}/${urlPath}/`, body, options);
  }

  public put<T>(urlPath: string, body: any, options?: { [param: string]: any }): Observable<T> {
    return this.httpClient.put<T>(`${base}/${urlPath}/`, body, options);
  }

  public delete<T>(urlPath: string, options: { [param: string]: any }): Observable<T> {
    return this.httpClient.delete<T>(`${base}/${urlPath}/`, options);
  }

  public uploadToS3<T>(url: string, body: any): Observable<T> {
    return this.httpClient.put<T>(url, body);
  }
  public convertETHtoUSD(): Observable<any> {
    return this.httpClient.get(`https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT`)
  }
  public convertMATICCtoETH(): Observable<any> {
    return this.httpClient.get(`https://api.binance.com/api/v3/avgPrice?symbol=MATICETH`)
  }
  public convertMaticToUSD(): Observable<any> {
    return this.httpClient.get(`https://api.binance.com/api/v3/avgPrice?symbol=MATICUSDT`)
  }
}
