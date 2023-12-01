import { Component } from '@angular/core';
import { MessageService } from './message.service';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-message',
  imports: [AsyncPipe],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  constructor(
    private readonly messageService: MessageService,
  ) {}
  $message = this.messageService.getMessage();
}
