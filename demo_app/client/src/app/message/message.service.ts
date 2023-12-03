import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

export type Message = {
  message: string;
};

@Injectable()
export class MessageService {
  constructor(private readonly http: HttpClient) {}

  getMessage(): Observable<Message> {
    return this.http.get<Message>('/api/message').pipe(shareReplay(1));
  }
}
