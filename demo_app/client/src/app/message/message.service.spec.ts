import { HttpClient } from '@angular/common/http';

import { Message, MessageService } from './message.service';
import { of } from 'rxjs';

describe('MessageService', () => {
  let service: MessageService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new MessageService(httpClientSpy);
  });

  it('should return message', (done: DoneFn) => {
    const expectedMessage: Message = { message: 'test message' };
    httpClientSpy.get.and.returnValue(of(expectedMessage));
    service.getMessage().subscribe({
      next: (data) => {
        expect(data).toEqual(expectedMessage);
        done();
      },
      error: done.fail,
    });
  });
});
