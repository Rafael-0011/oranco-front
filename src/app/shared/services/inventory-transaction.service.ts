import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import {
  InventoryTransactionReqDTO,
  InventoryTransactionResDTO
} from '../../core/dtos/inventory-transaction.dto';
import { PageResponseInventoryTransactionResDTO } from '../../core/dtos/page-response.dto';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/inventory-transactions`;

  findAll(): Observable<InventoryTransactionResDTO[]> {
    return this.http.get<InventoryTransactionResDTO[]>(this.baseUrl);
  }

  findAllPage(page = 0, size = 20): Observable<PageResponseInventoryTransactionResDTO> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponseInventoryTransactionResDTO>(
      `${this.baseUrl}/find-all-page`,
      { params }
    );
  }

  createInflow(transaction: InventoryTransactionReqDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/inflow`, transaction);
  }

  createOutflow(transaction: InventoryTransactionReqDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/outflow`, transaction);
  }

  findById(id: number): Observable<InventoryTransactionResDTO> {
    return this.http.get<InventoryTransactionResDTO>(`${this.baseUrl}/${id}`);
  }

  update(id: number, transaction: InventoryTransactionReqDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, transaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
