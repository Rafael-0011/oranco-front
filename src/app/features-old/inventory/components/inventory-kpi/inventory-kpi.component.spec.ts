import { TestBed } from '@angular/core/testing';
import { InventoryKpiComponent } from './inventory-kpi.component';

describe('InventoryKpiComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryKpiComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(InventoryKpiComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display KPI values correctly', () => {
    const fixture = TestBed.createComponent(InventoryKpiComponent);
    fixture.componentRef.setInput('summary', {
      totalStockValue: 15420.5,
      totalItemsCount: 350,
      distinctProductsCount: 12,
      weightedAverageCost: 44.06
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('12');
    expect(compiled.textContent).toContain('350');
  });
});

