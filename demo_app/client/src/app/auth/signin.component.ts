import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  $isSignedIn = this.authService.isSignedIn();

  constructor(private readonly authService: AuthService) {}

  onSignin(): void {
    this.authService.signin();
  }
}
