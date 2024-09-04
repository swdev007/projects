import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  queue = new Map();

  constructor() {
    this.socket = io( environment.apiHost, { transports: ["websocket"] });

    // this.socket = io.connect('http://localhost:3000', { transport: ['websocket']})

    this.socket.on('connected', function() {
        console.log("connected !");
    });

  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data:any, callback: any) {
   return this.socket.emit(eventName, data, callback);
  }
}