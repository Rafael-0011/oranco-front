import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Inventory } from './inventory';
import { ProductService, InventoryService, InventoryTransactionService } from '@shared';

describe('Inventory', () => {
  let component: Inventory;
  let fixture: ComponentFixture<Inventory>;

  beforeEach(async () => {
    const mockProductService = {
      findAll: () => of([])
    };
    const mockInventoryService = {
      findAll: () => of([])
    };
    const mockTransactionService = {
      createInflow: () => of(void 0),
      createOutflow: () => of(void 0)
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
});
