import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Products } from './products';
import { ProductService } from '@shared';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    const mockProductService = {
      findAll: () => of([]),
      delete: () => of(void 0),
      create: () => of(void 0),
      update: () => of(void 0)
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
});
