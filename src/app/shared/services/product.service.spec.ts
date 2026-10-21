import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '@env';
import { ProductDTO } from '../../core/dtos/product.dto';
import { UnitOfMeasure } from '../../core/enums/unit-of-measure.enum';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find all products', () => {
    const mockProducts: ProductDTO[] = [
      { id: 1, name: 'Produto A', barcode: '123456', unitOfMeasure: UnitOfMeasure.UN },
      { id: 2, name: 'Produto B', barcode: '789012', unitOfMeasure: UnitOfMeasure.KG }
    ];

    service.findAll().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should find product by id', () => {
    const mockProduct: ProductDTO = { id: 1, name: 'Produto A', unitOfMeasure: UnitOfMeasure.UN };

    service.findById(1).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create product', () => {
    const newProduct: ProductDTO = { name: 'Novo Produto', unitOfMeasure: UnitOfMeasure.L };

    service.create(newProduct).subscribe();

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(null);
  });

  it('should update product', () => {
    const updatedProduct: ProductDTO = { id: 1, name: 'Produto Atualizado' };

    service.update(1, updatedProduct).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(null);
  });

  it('should delete product', () => {
    service.delete(1).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

