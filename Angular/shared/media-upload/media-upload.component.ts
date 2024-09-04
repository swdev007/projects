import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { VIDEO_COMPONENT_TYPE, MEDIA_UPLOAD_TYPE } from 'src/app/enums/enums';
import { UploadMediaService } from 'src/app/services/upload-media.service';
import { getBase64 } from 'src/app/utils/utils';
@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent implements OnInit, OnChanges {

  @Output() uploadedFileUrlEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() uploadedMediaBlob: EventEmitter<string> = new EventEmitter<string>();

  @Input() type: string = MEDIA_UPLOAD_TYPE.VIDEO_OR_AUDIO;
  media_upload_type = MEDIA_UPLOAD_TYPE;
  file: File | undefined;
  fileSizeExceeded = false;
  @Input() selectedUrl: string = "";
  video_component_type = VIDEO_COMPONENT_TYPE;
  fileTypeMisMatch: boolean = false;
  uploaded: boolean = false;
  loading = false;
  get UploadedPercentageGetter() {
    return this.uploadedPercentage;
  }
  uploadedPercentage: number = 0;

  constructor(private uploadMediaService: UploadMediaService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.selectedUrl = this.selectedUrl;
    if(this.selectedUrl){
      this.uploaded = true;
      this.loading = false;
    }
  }

  onFileSelected(event: any) {
    
    const file: File = event.target.files[0];
    if (!this.validateFile(file)) {
      return;
    }
    this.loading = true;
    this.uploadedPercentage = 5;
    let timer = setInterval(()=>{
      if(this.uploadedPercentage < 90){
        this.uploadedPercentage += 5;
      }else if(this.uploadedPercentage < 98){
        this.uploadedPercentage += 1;
      }
    },500);
    this.uploadMediaService.uploadFileToAws(file, this.type).then(async (url)=>{
        clearInterval(timer)
        this.uploadedFileUrlEmitter.emit(url);
        this.selectedUrl = await getBase64(file) as string;
        this.uploadedMediaBlob.emit(this.selectedUrl);
        this.uploaded = true;
        this.loading = false;
      }).catch(()=>{
        clearInterval(timer)
        this.uploadedFileUrlEmitter.emit('');
        this.uploaded = false;
        this.loading = false;
    })
  }

  validateFile(file: File): boolean {
    if (!file) return false;
    const size = file.size / 1000000;
    if (this.type == MEDIA_UPLOAD_TYPE.VIDEO_OR_AUDIO) {
      if (file.type.indexOf('audio/mp3') !== 0 && file.type.indexOf('video/mp4') !== 0) {
        this.fileTypeMisMatch = true;
        return false;
      }
      if (size > 300) {
        this.fileSizeExceeded = true;
        return false;
      }
    } else {
      if (file.type.indexOf('image/jpeg') !== 0 && file.type.indexOf('image/jpg') !== 0 && file.type.indexOf('image/png')) {
        this.fileTypeMisMatch = true;
        return false;
      }
      if (size > 100) {
        this.fileSizeExceeded = true;
        return false;
      }

    }
    return true;
  }

  removeItem() {
    this.resetOptions();
  }

  resetOptions() {
    this.fileTypeMisMatch = false;
    this.selectedUrl = "";
    this.fileSizeExceeded = false;
    this.file = undefined;
    this.uploaded = false;
    this.uploadedFileUrlEmitter.emit('');
    this.uploadedMediaBlob.emit('');
  }
}
