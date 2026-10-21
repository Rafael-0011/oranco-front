import { TestBed } from '@angular/core/testing';
import { TransactionDialogComponent } from './transaction-dialog.component';
import { TransactionType } from '../../../../core/enums/transaction-type.enum';

describe('TransactionDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDialogComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TransactionDialogComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should calculate total and CMV correctly', () => {
    const fixture = TestBed.createComponent(TransactionDialogComponent);
    const component = fixture.componentInstance;

    component.form.patchValue({
      productId: 1,
      transactionType: TransactionType.INFLOW,
      quantity: 10,
      unitValue: 25.5
    });

    expect(component.calculatedTotal).toBe(255);
  });
});

