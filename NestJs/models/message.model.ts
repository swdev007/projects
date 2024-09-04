import { ResponseMessagesEnum } from 'src/core/message.enums';

export class MessageModel {
  message: string;

  constructor(message: ResponseMessagesEnum) {
    this.message = message;
  }
}
