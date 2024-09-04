import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwitterService } from './service/twitter.service';

@Component({
  selector: 'app-twitter-share',
  templateUrl: './twitter-share.component.html',
  styleUrls: ['./twitter-share.component.scss']
})
export class TwitterShareComponent implements OnInit {

  
  constructor(private twitterService :  TwitterService , private route : ActivatedRoute, private router:Router) { }
  
  oauth_token!: string;
  oauth_verifier!: string;
  accessToken!: string;
  oauth_token_secret!:string;

  @Input() uuid : string = "";

  ngOnInit(): void {
  
  }

//step1
  signInViaTwitter(){
    this.twitterService.requestToken(this.uuid).subscribe((obj)=>{
        let url = obj.redirectionUrl;
        let queryParamsArray = url.split('&tokenSecret=');
        let tokenSecret = queryParamsArray[queryParamsArray.length - 1];
        localStorage.setItem('tokenSecret', tokenSecret);
        let replace = '&tokenSecret=' + tokenSecret;
        url = url.replace(replace,'');
        window.open(url)
    }, error =>{
        console.log(error);
    })
  }
  



  shareUrlOnTwitter(){
    let link = 'https://twitter.com/intent/tweet?url=' + window.location.href;
    window.open(link, "_blank");
  }
}
