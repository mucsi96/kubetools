import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Message = {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) {}

  getMessage(): Observable<Message> {
    return this.http.get<Message>('/api/message');
  }
}
