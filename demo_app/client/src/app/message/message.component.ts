import { Component } from '@angular/core';
import { MessageService } from './message.service';
import { AsyncPipe } from '@angular/common';
import { TextComponent } from '../common-components/text/text.component';
import { HeadingComponent } from '../common-components/heading/heading.component';

@Component({
  standalone: true,
  selector: 'app-message',
  imports: [AsyncPipe, HeadingComponent],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  constructor(
    private readonly messageService: MessageService,
  ) {}
  $message = this.messageService.getMessage();
}
