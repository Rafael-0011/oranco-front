import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HelloService } from './hello.service';
import { environment } from '@env';

describe('HelloService', () => {
  let service: HelloService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/hello`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HelloService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(HelloService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get hello message', () => {
    const mockMessage = 'Hello World';

    service.getHello().subscribe((res) => {
      expect(res).toBe(mockMessage);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMessage);
  });
});

