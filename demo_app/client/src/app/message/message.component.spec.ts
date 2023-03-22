import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MessageService } from '../message.service';

import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let fakeMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    fakeMessageService = jasmine.createSpyObj('MessageService', {
      getMessage: of({ message: 'test message' })
    })
    await TestBed.configureTestingModule({
      declarations: [MessageComponent],
      imports: [HttpClientModule],
      providers: [{ provide: MessageService, useValue: fakeMessageService }]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display test message', () => {
    expect(component).toBeTruthy();
    const element: HTMLElement = fixture.nativeElement;
    const message = element.querySelector('p')?.textContent;
    expect(message).toEqual('test message');
  });
});
