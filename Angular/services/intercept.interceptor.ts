import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlingService, ErrorType } from './error-handling.service';
import { environment } from '@environments/environment';

@Injectable()
export class InterceptInterceptor implements HttpInterceptor {

  constructor(private errorHandlingService: ErrorHandlingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status != 0 && error.url != `${environment.apiHost}/error-logs/`){
          this.errorHandlingService.handleHTTPError(error, ErrorType.HTTP );
        }
        return throwError(error);
      })
    );
  }
}
