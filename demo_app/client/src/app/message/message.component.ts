import { Component } from '@angular/core';
import { MessageService } from '../message.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  constructor(
    private readonly messageService: MessageService,
    private readonly authService: AuthService
  ) {}
  $name = this.authService.getUserName();
  $message = this.messageService.getMessage();
}
