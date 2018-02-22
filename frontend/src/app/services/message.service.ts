import { Injectable } from '@angular/core';

import { Message }  from '../models/message';

@Injectable()
export class MessageService {
  messages: Message[] = [];
 
  add(message) {
    this.messages.push(message);
  }
 
  clear() {
    this.messages = [];
  }
}
