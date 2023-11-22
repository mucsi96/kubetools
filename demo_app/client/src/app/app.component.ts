import { Component } from '@angular/core';
import './../environments/environment';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private readonly authService: AuthService) {}

  authorize(): void {
    this.authService.authorize();
  }
}
