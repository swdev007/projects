import { Injectable } from '@angular/core';
import { NotificationType } from '@shared/enums/enums';
import { INotification, IConfirm } from '@shared/interface/interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  showNotificationSubject = new Subject<INotification>();
  showConfirmationSubject = new Subject<IConfirm>();

  showSuccessNotification(message: string) {
    const notificationData = {
      message: message,
      type: NotificationType.SUCCESS,
      timeOut: 10000
    }
    this.showNotificationSubject.next(notificationData);
  }

  showErrorNotification(message: string) {
    const notificationData = {
      message: message,
      type: NotificationType.ERROR,
      timeOut: 10000
    }
    this.showNotificationSubject.next(notificationData);
  }

  showNotificationAlert(notificationData: INotification) {
    this.showNotificationSubject.next(notificationData);
  }

  showConfirmPopup(notificationData: IConfirm) {
    this.showConfirmationSubject.next(notificationData);
  }
}
