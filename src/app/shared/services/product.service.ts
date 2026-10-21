import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ProductDTO } from '../../core/dtos/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  findAll(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(this.baseUrl);
  }

  findById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.baseUrl}/${id}`);
  }

  create(product: ProductDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, product);
  }

  update(id: number, product: ProductDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

