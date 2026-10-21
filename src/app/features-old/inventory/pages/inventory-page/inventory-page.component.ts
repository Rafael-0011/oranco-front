import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductService, InventoryService, InventoryTransactionService } from '@shared';
import { ProductDTO, InventoryDTO, InventoryTransactionDTO } from '@core';
import { InventoryItemView, InventorySummary } from '../../../../core/models/inventory.model';
import { TransactionType } from '../../../../core/enums/transaction-type.enum';
import { sanitizeProduct } from '../../../../core/utils/data-sanitizer';
import { InventoryKpiComponent } from '../../components/inventory-kpi/inventory-kpi.component';
import { InventoryTableComponent } from '../../components/inventory-table/inventory-table.component';
import { TransactionDialogComponent } from '../../../transactions/components/transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    InventoryKpiComponent,
    InventoryTableComponent,
    TransactionDialogComponent
  ],
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly inventoryService = inject(InventoryService);
  private readonly transactionService = inject(InventoryTransactionService);
  private readonly messageService = inject(MessageService);

  readonly loading = signal<boolean>(false);
  readonly savingTransaction = signal<boolean>(false);
  readonly transactionDialogVisible = signal<boolean>(false);

  readonly selectedProductId = signal<number | undefined>(undefined);
  readonly selectedTransactionType = signal<TransactionType | undefined>(undefined);

  readonly productsList = signal<ProductDTO[]>([]);
  readonly inventoryList = signal<InventoryDTO[]>([]);
  readonly inventoryViewList = signal<InventoryItemView[]>([]);

  readonly summary = signal<InventorySummary>({
    totalStockValue: 0,
    totalItemsCount: 0,
    distinctProductsCount: 0,
    weightedAverageCost: 0
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    forkJoin({
      products: this.productService.findAll(),
      inventory: this.inventoryService.findAll()
    }).subscribe({
      next: ({ products, inventory }) => {
        const sanitizedProducts = (products || []).map(sanitizeProduct);
        this.productsList.set(sanitizedProducts);
        this.inventoryList.set(inventory || []);
        this.consolidateInventoryView();
        this.computeSummary();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do inventário:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro de Carregamento',
          detail: 'Não foi possível carregar os dados de produtos e inventário.'
        });
        this.loading.set(false);
      }
    });
  }

  private consolidateInventoryView(): void {
    const inventoryMap = new Map<number, InventoryDTO>();
    for (const inv of this.inventoryList()) {
      if (inv.productId != null) {
        inventoryMap.set(inv.productId, inv);
      }
    }

    const views: InventoryItemView[] = [];

    for (const prod of this.productsList()) {
      const inv = prod.id != null ? inventoryMap.get(prod.id) : undefined;
      const qty = inv?.currentQuantity ?? 0;
      const cost = inv?.currentAverageCost ?? 0;

      views.push({
        id: inv?.id,
        productId: prod.id!,
        productName: prod.name || 'Produto sem nome',
        barcode: prod.barcode,
        description: prod.description,
        unitOfMeasure: prod.unitOfMeasure,
        currentQuantity: qty,
        currentAverageCost: cost,
        totalValue: qty * cost,
        updatedAt: inv?.updatedAt || prod.createdAt
      });
    }

    this.inventoryViewList.set(views);
  }

  private computeSummary(): void {
    let totalValue = 0;
    let totalQty = 0;
    let distinctWithStock = 0;

    for (const item of this.inventoryViewList()) {
      totalValue += item.totalValue;
      totalQty += item.currentQuantity;
      if (item.currentQuantity > 0) {
        distinctWithStock++;
      }
    }

    this.summary.set({
      totalStockValue: totalValue,
      totalItemsCount: totalQty,
      distinctProductsCount: distinctWithStock,
      weightedAverageCost: totalQty > 0 ? totalValue / totalQty : 0
    });
  }

  onOpenTransaction(event: { productId?: number; type?: TransactionType } = {}): void {
    this.selectedProductId.set(event.productId);
    this.selectedTransactionType.set(event.type || TransactionType.INFLOW);
    this.transactionDialogVisible.set(true);
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
            ? `Entrada de ${transaction.quantity} unidade(s) confirmada com sucesso!`
            : `Saída de ${transaction.quantity} unidade(s) confirmada com sucesso!`
        });

        this.loadData();
      },
      error: (err) => {
        this.savingTransaction.set(false);
        console.error('Erro ao salvar movimentação:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Falha na Operação',
          detail: 'Não foi possível registrar a movimentação.'
        });
      }
    });
  }
}
