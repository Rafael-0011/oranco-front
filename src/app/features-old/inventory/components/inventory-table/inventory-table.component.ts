import { Component, ViewChild, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InventoryItemView } from '../../../../core/models/inventory.model';
import { TransactionType } from '../../../../core/enums/transaction-type.enum';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './inventory-table.component.html',
  styleUrl: './inventory-table.component.css'
})
export class InventoryTableComponent {
  readonly items = input<InventoryItemView[]>([]);
  readonly loading = input<boolean>(false);

  readonly refresh = output<void>();
  readonly openTransaction = output<{ productId?: number; type?: TransactionType }>();

  readonly TransactionType = TransactionType;

  @ViewChild('dt') dt!: Table;

  onGlobalFilter(table: Table, event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(filterValue, 'contains');
  }

  onQuickAction(item: InventoryItemView, type: TransactionType): void {
    this.openTransaction.emit({ productId: item.productId, type });
  }

  getQuantityClass(qty: number): string {
    if (qty > 10) return 'text-in-stock';
    if (qty > 0) return 'text-low-stock';
    return 'text-out-of-stock';
  }

  getDotClass(qty: number): string {
    if (qty > 10) return 'dot-in-stock';
    if (qty > 0) return 'dot-low-stock';
    return 'dot-out-of-stock';
  }
}

