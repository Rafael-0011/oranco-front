import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Products } from './products';
import { ProductService } from '@shared';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let mockProductService: any;

  beforeEach(async () => {
    mockProductService = {
      findAll: vi.fn(() => of([])),
      findAllPage: vi.fn(() => of({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 })),
      delete: vi.fn(() => of(void 0)),
      create: vi.fn(() => of(void 0)),
      update: vi.fn(() => of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        provideHttpClient(),
        MessageService,
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the products page', () => {
    expect(component).toBeTruthy();
  });

  it('should only fetch products page on init (exactly 1 request)', () => {
    expect(mockProductService.findAllPage).toHaveBeenCalledTimes(1);
    expect(mockProductService.findAll).not.toHaveBeenCalled();
  });

  it('should deduplicate pagination calls for the same page/size', () => {
    expect(mockProductService.findAllPage).toHaveBeenCalledTimes(1);

    component.loadProducts(0, 10);
    expect(mockProductService.findAllPage).toHaveBeenCalledTimes(1);

    component.loadProducts(0, 10, true);
    expect(mockProductService.findAllPage).toHaveBeenCalledTimes(2);
  });
});
