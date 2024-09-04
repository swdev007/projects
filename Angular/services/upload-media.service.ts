import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MEDIA_UPLOAD_TYPE } from '../enums/enums';
import { findExtention } from '../utils/utils';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class UploadMediaService {

  constructor(private apiService : ApiService ) { }


  public uploadFileToAws(uploadedImages : File , type : string = "image") : Promise<string> {
    return new Promise((resolve,reject) => {
      let body = { key: '', method: '', content: '' };
      if(type == MEDIA_UPLOAD_TYPE.VIDEO_OR_AUDIO){
        type = "video";
        const extention = findExtention(uploadedImages.name)
        body.key = `media/${new Date().getTime()}/nft/nft_${new Date().getTime()}${extention}`;
      }else{
        type = "image";
        body.key = `media/${new Date().getTime()}/cover/${uploadedImages.name}`;
      }
    
      body.method = 'put';
      body.content = uploadedImages.type;
      body.key = body.key.replace(/ /g, '');
        this.getS3SignedUrl(body).subscribe((value : any)=>{
            this.uploadToS3(value?.result?.url, uploadedImages).subscribe(()=>{
                resolve(body.key);
              }, error  => {
                reject(error)
              });
          }, error => {
            reject(error)
          });
        })
      }
 
      getS3SignedUrl(body : any){
        return this.apiService.post('tokens/signed-url',body);
      }

      uploadToS3(url : string ,body : any){
        return this.apiService.uploadToS3(url,body);
      }
}
