import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { UserInfoComponent } from './auth/user-info.component';

@Component({
  standalone: true,
  selector: 'router-outlet',
  template: '',
})
class MockRouterOutlet {}

@Component({
  standalone: true,
  selector: 'user-info',
  template: '',
})
class MockUserInfo {}

async function setup() {
  await TestBed.configureTestingModule({
    providers: [
    ],
  }).compileComponents();

  TestBed.overrideComponent(AppComponent, {
    remove: {
      imports: [RouterOutlet, UserInfoComponent],
    },
    add: {
      imports: [MockRouterOutlet, MockUserInfo],
    },
  });

  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();

  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
  };
}

describe('AppComponent', () => {
  it('should create the app', async () => {
    const { fixture } = await setup();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
