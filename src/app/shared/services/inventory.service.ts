import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { InventoryReqDTO, InventoryResDTO } from '../../core/dtos/inventory.dto';
import { PageResponseInventoryResDTO } from '../../core/dtos/page-response.dto';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/inventory`;

  findAll(): Observable<InventoryResDTO[]> {
    return this.http.get<InventoryResDTO[]>(this.baseUrl);
  }

  findAllPage(page = 0, size = 20): Observable<PageResponseInventoryResDTO> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponseInventoryResDTO>(`${this.baseUrl}/find-all-page`, { params });
  }

  findById(id: number): Observable<InventoryResDTO> {
    return this.http.get<InventoryResDTO>(`${this.baseUrl}/${id}`);
  }

  create(inventory: InventoryReqDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, inventory);
  }

  update(id: number, inventory: InventoryReqDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, inventory);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
