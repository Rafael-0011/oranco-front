import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InventoryTransactionDTO } from '../../../../core/dtos/inventory-transaction.dto';
import { ProductDTO } from '../../../../core/dtos/product.dto';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css'
})
export class TransactionTableComponent {
  readonly transactions = input<InventoryTransactionDTO[]>([]);
  readonly products = input<ProductDTO[]>([]);
  readonly loading = input<boolean>(false);

  readonly refresh = output<void>();
  readonly openNewTransaction = output<void>();

  getProductName(productId?: number): string {
    if (!productId) return 'Produto não informado';
    const prod = this.products().find((p) => p.id === productId);
    return prod ? `${prod.name} (${prod.barcode || 'S/N'})` : `Produto #${productId}`;
  }
}

