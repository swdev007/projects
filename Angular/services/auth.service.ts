import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { validate as isValidUUID } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService) { }


  public checkInviteLink(inviteLink: string): Observable<any> {
    console.log("---------------------", isValidUUID(inviteLink))
    if(isValidUUID(inviteLink)){
      return this.apiService.get(`collector/invites/${inviteLink}`);
    }
    return this.apiService.get(`collector/mint-list-invite/${inviteLink}`)
  }

  public validateRegisterEmail(email: string): Observable<boolean> {
    return this.apiService.get(`profile/validate/email/${email}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public validateRegisterUsername(username: string): Observable<boolean> {
    return this.apiService.get(`profile/validate/username/${username}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
  public validateRegisterPhone(phone: string): Observable<boolean> {
    return this.apiService.get(`profile/validate/phone/${phone}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public validateRegistedEmailAndPhoneCollector(phoneOrEmail: string): Observable<{ [key: string]: any }> {
    return this.apiService.get(`collector/invites/unique/${phoneOrEmail}`).pipe(
      map((res: any) => { return { error: false, message: res.message } }),
      catchError((err) => { return of({ error: true, message: err.error.message }) })
    );
  }
  
  public validateRegistedEmailAndPhoneArtist(phoneOrEmail: string): Observable<{ [key: string]: any }> {
    const options = {
      search : phoneOrEmail
    }
    return this.apiService.get(`users/is-unique`,{...options}).pipe(
      map((res: any) => { return { error: false, message: res.message } }),
      catchError((err) => { return of({ error: true, message: err.error.message }) })
    );
  }
}
