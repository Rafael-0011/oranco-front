import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { environment } from '@env';
import { InventoryDTO } from '../../core/dtos/inventory.dto';
import { PageResponseInventoryDTO } from '../../core/dtos/page-response.dto';

describe('InventoryService', () => {
  let service: InventoryService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/inventory`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(InventoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find all inventory records', () => {
    const mockInventory: InventoryDTO[] = [
      { id: 1, productId: 10, currentQuantity: 50, currentAverageCost: 12.5 }
    ];

    service.findAll().subscribe((res) => {
      expect(res).toEqual(mockInventory);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockInventory);
  });

  it('should find paged inventory records with default params', () => {
    const mockPage: PageResponseInventoryDTO = {
      content: [{ id: 1, productId: 10, currentQuantity: 50, currentAverageCost: 12.5 }],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1
    };

    service.findAllPage().subscribe((res) => {
      expect(res).toEqual(mockPage);
    });

    const req = httpTesting.expectOne(`${baseUrl}/find-all-page?page=0&size=20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should find paged inventory records with custom params', () => {
    const mockPage: PageResponseInventoryDTO = {
      content: [],
      page: 2,
      size: 10,
      totalElements: 0,
      totalPages: 0
    };

    service.findAllPage(2, 10).subscribe((res) => {
      expect(res).toEqual(mockPage);
    });

    const req = httpTesting.expectOne(`${baseUrl}/find-all-page?page=2&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should find inventory by id', () => {
    const mockItem: InventoryDTO = { id: 1, productId: 10, currentQuantity: 50 };

    service.findById(1).subscribe((res) => {
      expect(res).toEqual(mockItem);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItem);
  });

  it('should create inventory record', () => {
    const item: InventoryDTO = { productId: 10, currentQuantity: 20, currentAverageCost: 15.0 };

    service.create(item).subscribe();

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(item);
    req.flush(null);
  });

  it('should update inventory record', () => {
    const item: InventoryDTO = { id: 1, productId: 10, currentQuantity: 30 };

    service.update(1, item).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(item);
    req.flush(null);
  });

  it('should delete inventory record', () => {
    service.delete(1).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

