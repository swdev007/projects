import { Component, OnDestroy, OnInit } from '@angular/core';
import { IConfirm, INotification } from '@shared/interface/interface';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '@shared/enums/enums';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  constructor(private notificationService: NotificationService, private router : Router) { }
  notificationData!: INotification | undefined;
  timeOutForNotification!: NodeJS.Timeout;
  notificationType = NotificationType

  confirmationData: IConfirm | undefined;

  ngOnInit(): void {
    this.subscribeToNotificationService();
  }

  subscribeToNotificationService() {
    this.notificationService.showNotificationSubject.subscribe((res: INotification) => {
      this.clearNotificationData();
      this.notificationData = res;
      this.setTimer(res.timeOut);
    })

    this.notificationService.showConfirmationSubject.subscribe((res: IConfirm) => {
      this.confirmationData = res;
    })
  }

  setTimer(timer: number): void {
    clearTimeout(this.timeOutForNotification);
    this.timeOutForNotification = setTimeout(() => {
      delete this.notificationData;
    }, timer)
  }

  closeNotification(): void {
    this.clearNotificationData();
  }

  closeConfirmationPopup(){
    this.confirmationData = undefined;
  }
  ngOnDestroy(): void {
    this.clearNotificationData();
  }

  clearNotificationData(): void {
    clearTimeout(this.timeOutForNotification);
    delete this.notificationData;
  }

  goToRoute(route : string){
    this.router.navigate([route]);
  }
}
