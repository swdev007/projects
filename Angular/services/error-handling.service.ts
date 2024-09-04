import { ErrorHandler, Injectable } from '@angular/core';
import { ApiService } from './api.service';

export enum RepositoryType {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
}

export enum ErrorType {
  METAMASK = 'Metamask',
  HTTP = 'HTTP request',
  UNKNOWN = 'default'
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService implements ErrorHandler  {

  constructor(private apiService : ApiService) { }

  handleError(error: any) {
    const errorObject = {
      errorMessage  : error.message,
      errorType : ErrorType.UNKNOWN,
      repositoryType : RepositoryType.FRONTEND,
      stack : JSON.stringify(error.data || '')
    }
    this.postError(errorObject).subscribe(
      ()=>{}, 
      (error) => {console.log(error);}
      )
  }

  handleHTTPError(error: any, type : string) {
    const errorObject = {
      errorMessage  : error.message,
      errorType : type,
      repositoryType : RepositoryType.FRONTEND,
      stack : JSON.stringify(error.data || '')
    }
    this.postError(errorObject).subscribe(
      ()=>{},
      (error) => {console.log(error)}
      )
  }


  postError(errorObject : any){
    return this.apiService.post('error-logs' , errorObject)
  }


  handleMetaMaskError(error: any, publicAddress : string = "" , nftTokenId : string = "") {
    const errorObject = {
      errorMessage  : error.data?.message || error.message,
      errorType : ErrorType.METAMASK,
      repositoryType : RepositoryType.FRONTEND,
      publicAddress : publicAddress || '',
      nftTokenId : nftTokenId || '',
      stack : JSON.stringify(error.data || '')

    }
    this.postError(errorObject).subscribe(
      ()=>{},
      (error) => {console.log(error)}
      )
  }
}
