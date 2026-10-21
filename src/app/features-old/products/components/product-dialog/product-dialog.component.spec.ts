import { TestBed } from '@angular/core/testing';
import { ProductDialogComponent } from './product-dialog.component';
import { UnitOfMeasure } from '../../../../core/enums/unit-of-measure.enum';

describe('ProductDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDialogComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ProductDialogComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should validate form and emit saveProduct on submit', () => {
    const fixture = TestBed.createComponent(ProductDialogComponent);
    const component = fixture.componentInstance;

    component.form.patchValue({
      name: 'Filtro de Ar Motor',
      barcode: '789555123',
      unitOfMeasure: UnitOfMeasure.UN,
      description: 'Peça automotiva'
    });

    let savedProduct: any;
    component.saveProduct.subscribe((p) => (savedProduct = p));

    component.onSubmit();

    expect(savedProduct).toBeDefined();
    expect(savedProduct.name).toBe('Filtro de Ar Motor');
    expect(savedProduct.unitOfMeasure).toBe(UnitOfMeasure.UN);
  });
});

