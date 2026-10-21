import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class HelloService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/hello`;

  getHello(): Observable<string> {
    return this.http.get(this.baseUrl, { responseType: 'text' });
  }
}

