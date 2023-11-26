import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MessageComponent } from './message/message.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { SigninComponent } from './auth/signin.component';
import { SigninRedirectCallbackComponent } from './auth/signin-redirect-callback.component';
import { UserInfoComponent } from './auth/user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    SigninComponent,
    SigninRedirectCallbackComponent,
    UserInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
