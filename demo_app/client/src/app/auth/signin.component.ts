import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'signin',
  imports: [AsyncPipe],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  $isSignedIn = this.authService.isSignedIn();

  constructor(private readonly authService: AuthService) {}

  onSignin(): void {
    this.authService.signin();
  }
}
