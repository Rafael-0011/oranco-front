import { Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InventorySummary } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory-kpi',
  standalone: true,
  imports: [CommonModule, CardModule, CurrencyPipe, DecimalPipe],
  templateUrl: './inventory-kpi.component.html',
  styleUrl: './inventory-kpi.component.css'
})
export class InventoryKpiComponent {
  readonly summary = input<InventorySummary>({
    totalStockValue: 0,
    totalItemsCount: 0,
    distinctProductsCount: 0,
    weightedAverageCost: 0
  });
}
