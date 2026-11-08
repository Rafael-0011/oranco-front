import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Inventory } from './inventory';
import { ProductService, InventoryService, InventoryTransactionService } from '@shared';

describe('Inventory', () => {
  let component: Inventory;
  let fixture: ComponentFixture<Inventory>;
  let mockProductService: any;
  let mockInventoryService: any;
  let mockTransactionService: any;

  beforeEach(async () => {
    mockProductService = {
      findAll: vi.fn(() => of([]))
    };
    mockInventoryService = {
      findAll: vi.fn(() => of([])),
      findAllPage: vi.fn(() => of({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 }))
    };
    mockTransactionService = {
      createInflow: vi.fn(() => of(void 0)),
      createOutflow: vi.fn(() => of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [Inventory],
      providers: [
        provideHttpClient(),
        MessageService,
        { provide: ProductService, useValue: mockProductService },
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: InventoryTransactionService, useValue: mockTransactionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Inventory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the inventory page', () => {
    expect(component).toBeTruthy();
  });

  it('should only fetch inventory page on init and not call product service eagerly', () => {
    expect(mockInventoryService.findAllPage).toHaveBeenCalledTimes(1);
    expect(mockProductService.findAll).not.toHaveBeenCalled();
  });

  it('should deduplicate pagination calls for the same page/size', () => {
    expect(mockInventoryService.findAllPage).toHaveBeenCalledTimes(1);

    component.loadData(0, 10);
    expect(mockInventoryService.findAllPage).toHaveBeenCalledTimes(1);

    component.loadData(0, 10, true);
    expect(mockInventoryService.findAllPage).toHaveBeenCalledTimes(2);
  });
});
