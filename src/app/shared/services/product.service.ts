import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ProductDTO, ProductReqDTO } from '../../core/dtos/product.dto';
import { PageResponseProductResDTO } from '../../core/dtos/page-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  findAll(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(this.baseUrl);
  }

  findAllPage(page = 0, size = 20): Observable<PageResponseProductResDTO> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponseProductResDTO>(`${this.baseUrl}/find-all-page`, { params });
  }

  findById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.baseUrl}/${id}`);
  }

  create(product: ProductReqDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, product);
  }

  update(id: number, product: ProductReqDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
