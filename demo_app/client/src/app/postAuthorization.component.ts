import { Component, OnInit } from '@angular/core';
import '../environments/environment';
import { AuthService } from './auth.service';

@Component({
  selector: 'post_authorization',
  template: '',
})
export class PostAuthorizationComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.handlePostAuthorize();
  }

  authozire() {
    this.authService.authorize();
  }
}
