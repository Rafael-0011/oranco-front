import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Transactions } from './transactions';
import { ProductService, InventoryService, InventoryTransactionService } from '@shared';

describe('Transactions', () => {
  let component: Transactions;
  let fixture: ComponentFixture<Transactions>;

  beforeEach(async () => {
    const mockTransactionService = {
      findAll: () => of([]),
      createInflow: () => of(void 0),
      createOutflow: () => of(void 0)
    };
    const mockProductService = {
      findAll: () => of([])
    };
    const mockInventoryService = {
      findAll: () => of([])
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
});
