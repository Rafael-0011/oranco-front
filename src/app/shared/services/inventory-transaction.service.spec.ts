import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InventoryTransactionService } from './inventory-transaction.service';
import { environment } from '@env';
import { InventoryTransactionDTO } from '../../core/dtos/inventory-transaction.dto';
import { PageResponseInventoryTransactionDTO } from '../../core/dtos/page-response.dto';
import { TransactionType } from '../../core/enums/transaction-type.enum';

describe('InventoryTransactionService', () => {
  let service: InventoryTransactionService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/inventory-transactions`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventoryTransactionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(InventoryTransactionService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find all inventory transactions', () => {
    const mockList: InventoryTransactionDTO[] = [
      { id: 1, productId: 10, transactionType: TransactionType.INFLOW, quantity: 100, unitValue: 5.5 }
    ];

    service.findAll().subscribe((res) => {
      expect(res).toEqual(mockList);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should find paged inventory transactions', () => {
    const mockPage: PageResponseInventoryTransactionDTO = {
      content: [{ id: 1, productId: 10, transactionType: TransactionType.OUTFLOW, quantity: 10, unitValue: 6.0 }],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1
    };

    service.findAllPage(0, 20).subscribe((res) => {
      expect(res).toEqual(mockPage);
    });

    const req = httpTesting.expectOne(`${baseUrl}/find-all-page?page=0&size=20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should create inflow transaction', () => {
    const transaction: InventoryTransactionDTO = {
      productId: 10,
      transactionType: TransactionType.INFLOW,
      quantity: 50,
      unitValue: 10.0
    };

    service.createInflow(transaction).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/inflow`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(transaction);
    req.flush(null);
  });

  it('should create outflow transaction', () => {
    const transaction: InventoryTransactionDTO = {
      productId: 10,
      transactionType: TransactionType.OUTFLOW,
      quantity: 20,
      unitValue: 12.0
    };

    service.createOutflow(transaction).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/outflow`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(transaction);
    req.flush(null);
  });

  it('should find transaction by id', () => {
    const mockItem: InventoryTransactionDTO = { id: 1, productId: 10 };

    service.findById(1).subscribe((res) => {
      expect(res).toEqual(mockItem);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItem);
  });

  it('should update transaction', () => {
    const item: InventoryTransactionDTO = { id: 1, productId: 10, notes: 'Ajuste de estoque' };

    service.update(1, item).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(item);
    req.flush(null);
  });

  it('should delete transaction', () => {
    service.delete(1).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

