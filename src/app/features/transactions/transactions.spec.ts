import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Transactions } from './transactions';
import { ProductService, InventoryService, InventoryTransactionService } from '@shared';

describe('Transactions', () => {
  let component: Transactions;
  let fixture: ComponentFixture<Transactions>;
  let mockTransactionService: any;
  let mockProductService: any;
  let mockInventoryService: any;

  beforeEach(async () => {
    mockTransactionService = {
      findAll: vi.fn(() => of([])),
      findAllPage: vi.fn(() => of({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 })),
      createInflow: vi.fn(() => of(void 0)),
      createOutflow: vi.fn(() => of(void 0))
    };
    mockProductService = {
      findAll: vi.fn(() => of([]))
    };
    mockInventoryService = {
      findAll: vi.fn(() => of([]))
    };

    await TestBed.configureTestingModule({
      imports: [Transactions],
      providers: [
        provideHttpClient(),
        MessageService,
        { provide: InventoryTransactionService, useValue: mockTransactionService },
        { provide: ProductService, useValue: mockProductService },
        { provide: InventoryService, useValue: mockInventoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Transactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the transactions page', () => {
    expect(component).toBeTruthy();
  });

  it('should only fetch transactions page on init and not call product or inventory services eagerly', () => {
    const transactionService = TestBed.inject(InventoryTransactionService);
    const productService = TestBed.inject(ProductService);
    const inventoryService = TestBed.inject(InventoryService);

    expect(transactionService.findAllPage).toHaveBeenCalledTimes(1);
    expect(productService.findAll).not.toHaveBeenCalled();
    expect(inventoryService.findAll).not.toHaveBeenCalled();
  });

  it('should prevent duplicate requests for the same page/size', () => {
    const transactionService = TestBed.inject(InventoryTransactionService);
    expect(transactionService.findAllPage).toHaveBeenCalledTimes(1);

    // Calling loadData with the same page and size without force must not trigger a second HTTP call
    component.loadData(0, 10);
    expect(transactionService.findAllPage).toHaveBeenCalledTimes(1);

    // Calling with force = true should trigger it
    component.loadData(0, 10, true);
    expect(transactionService.findAllPage).toHaveBeenCalledTimes(2);
  });
});
