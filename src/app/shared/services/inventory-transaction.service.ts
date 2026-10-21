import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { InventoryTransactionDTO } from '../../core/dtos/inventory-transaction.dto';
import { PageResponseInventoryTransactionDTO } from '../../core/dtos/page-response.dto';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/inventory-transactions`;

  findAll(): Observable<InventoryTransactionDTO[]> {
    return this.http.get<InventoryTransactionDTO[]>(this.baseUrl);
  }

  findAllPage(page = 0, size = 20): Observable<PageResponseInventoryTransactionDTO> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponseInventoryTransactionDTO>(`${this.baseUrl}/find-all-page`, { params });
  }

  createInflow(transaction: InventoryTransactionDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/inflow`, transaction);
  }

  createOutflow(transaction: InventoryTransactionDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/outflow`, transaction);
  }

  findById(id: number): Observable<InventoryTransactionDTO> {
    return this.http.get<InventoryTransactionDTO>(`${this.baseUrl}/${id}`);
  }

  update(id: number, transaction: InventoryTransactionDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, transaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

