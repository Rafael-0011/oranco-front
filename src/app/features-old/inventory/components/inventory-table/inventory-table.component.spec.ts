import { TestBed } from '@angular/core/testing';
import { InventoryTableComponent } from './inventory-table.component';
import { InventoryItemView } from '../../../../core/models/inventory.model';
import { TransactionType } from '../../../../core/enums/transaction-type.enum';

describe('InventoryTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryTableComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(InventoryTableComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should emit openTransaction when quick action is clicked', () => {
    const fixture = TestBed.createComponent(InventoryTableComponent);
    const component = fixture.componentInstance;

    const mockItem: InventoryItemView = {
      productId: 10,
      productName: 'Tinta Acrílica',
      barcode: '789123456',
      unitOfMeasure: 'L',
      currentQuantity: 25,
      currentAverageCost: 50.0,
      totalValue: 1250.0
    };

    let emittedEvent: { productId?: number; type?: TransactionType } | undefined;
    component.openTransaction.subscribe((ev) => (emittedEvent = ev));

    component.onQuickAction(mockItem, TransactionType.INFLOW);

    expect(emittedEvent).toEqual({ productId: 10, type: TransactionType.INFLOW });
  });

  it('should return correct dot class based on quantity', () => {
    const fixture = TestBed.createComponent(InventoryTableComponent);
    const component = fixture.componentInstance;

    expect(component.getDotClass(15)).toBe('dot-in-stock');
    expect(component.getDotClass(5)).toBe('dot-low-stock');
    expect(component.getDotClass(0)).toBe('dot-out-of-stock');
  });
});

