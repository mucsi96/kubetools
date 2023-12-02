import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserInfoComponent } from './auth/user-info.component';
import { HeaderComponent } from './common-components/header/header.component';
import { MainComponent } from './common-components/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UserInfoComponent,
    HeaderComponent,
    MainComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
