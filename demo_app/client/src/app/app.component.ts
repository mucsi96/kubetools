import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserInfoComponent } from './auth/user-info.component';
import { HeaderComponent } from './common-components/header/header.component';
import { MainComponent } from './common-components/main/main.component';
import { AuthService } from './auth/auth.service';
import { loading } from './utils/loading';
import { LoaderComponent } from './common-components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UserInfoComponent,
    HeaderComponent,
    MainComponent,
    LoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private readonly authService: AuthService) {}
  $loading = this.authService.isSignedIn().pipe(loading());
}
