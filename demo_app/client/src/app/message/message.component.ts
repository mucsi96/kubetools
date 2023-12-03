import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { HeadingComponent } from '../common-components/heading/heading.component';
import { MessageService } from './message.service';
import { LoaderComponent } from '../common-components/loader/loader.component';
import { combineLatest, map } from 'rxjs';
import { loading } from '../utils/loading';

@Component({
  standalone: true,
  selector: 'app-message',
  imports: [AsyncPipe, HeadingComponent, LoaderComponent],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  constructor(private readonly messageService: MessageService) {}
  $message = this.messageService.getMessage();
  $loading = this.$message.pipe(loading());
}
