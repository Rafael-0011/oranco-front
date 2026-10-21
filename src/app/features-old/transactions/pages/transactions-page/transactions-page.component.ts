import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductService, InventoryService, InventoryTransactionService } from '@shared';
import { ProductDTO, InventoryDTO, InventoryTransactionDTO } from '@core';
import { InventoryItemView } from '../../../../core/models/inventory.model';
import { TransactionType } from '../../../../core/enums/transaction-type.enum';
import { sanitizeProduct } from '../../../../core/utils/data-sanitizer';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    TransactionTableComponent,
    TransactionDialogComponent
  ],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css'
})
export class TransactionsPageComponent implements OnInit {
  private readonly transactionService = inject(InventoryTransactionService);
  private readonly productService = inject(ProductService);
  private readonly inventoryService = inject(InventoryService);
  private readonly messageService = inject(MessageService);

  readonly transactions = signal<InventoryTransactionDTO[]>([]);
  readonly products = signal<ProductDTO[]>([]);
  readonly inventoryItems = signal<InventoryItemView[]>([]);

  readonly loading = signal<boolean>(false);
  readonly savingTransaction = signal<boolean>(false);
  readonly transactionDialogVisible = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    forkJoin({
      transactions: this.transactionService.findAll(),
      products: this.productService.findAll(),
      inventory: this.inventoryService.findAll()
    }).subscribe({
      next: ({ transactions, products, inventory }) => {
        const sanitizedProducts = (products || []).map(sanitizeProduct);
        this.transactions.set(transactions || []);
        this.products.set(sanitizedProducts);

        const inventoryMap = new Map<number, InventoryDTO>();
        for (const inv of inventory || []) {
          if (inv.productId != null) inventoryMap.set(inv.productId, inv);
        }

        const views: InventoryItemView[] = sanitizedProducts.map((p) => {
          const inv = p.id != null ? inventoryMap.get(p.id) : undefined;
          const qty = inv?.currentQuantity ?? 0;
          const cost = inv?.currentAverageCost ?? 0;
          return {
            id: inv?.id,
            productId: p.id!,
            productName: p.name || 'Produto sem nome',
            barcode: p.barcode,
            description: p.description,
            unitOfMeasure: p.unitOfMeasure,
            currentQuantity: qty,
            currentAverageCost: cost,
            totalValue: qty * cost
          };
        });

        this.inventoryItems.set(views);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar movimentações:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar o histórico de transações.'
        });
        this.loading.set(false);
      }
    });
  }

  handleSaveTransaction(transaction: InventoryTransactionDTO): void {
    this.savingTransaction.set(true);

    const action$ =
      transaction.transactionType === TransactionType.INFLOW
        ? this.transactionService.createInflow(transaction)
        : this.transactionService.createOutflow(transaction);

    action$.subscribe({
      next: () => {
        this.savingTransaction.set(false);
        this.transactionDialogVisible.set(false);

        const isEntry = transaction.transactionType === TransactionType.INFLOW;
        this.messageService.add({
          severity: 'success',
          summary: isEntry ? 'Entrada Registrada' : 'Saída Registrada',
          detail: isEntry
            ? `Entrada de ${transaction.quantity} un confirmada com sucesso!`
            : `Saída de ${transaction.quantity} un confirmada com sucesso!`
        });

        this.loadData();
      },
      error: (err) => {
        this.savingTransaction.set(false);
        console.error('Erro ao salvar movimentação:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao salvar movimentação.'
        });
      }
    });
  }
}
