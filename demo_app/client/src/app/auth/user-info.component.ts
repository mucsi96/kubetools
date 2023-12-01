import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'user-info',
  imports: [AsyncPipe],
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent {
  $isSignedIn = this.authService.isSignedIn();
  $userName = this.authService.getUserName();

  $vm = combineLatest([this.$isSignedIn, this.$userName]).pipe(
    map(([isSignedIn, userName]) => ({
      isSignedIn,
      userName,
    }))
  );

  constructor(private readonly authService: AuthService) {}

  onSignout(): void {
    this.authService.signout();
  }
}
