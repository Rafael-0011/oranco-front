import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  ProductDTO,
  InventoryResDTO,
  InventoryTransactionReqDTO,
  InventoryItemView,
  InventorySummary,
  TransactionType,
  StatusInventory,
  sanitizeProduct
} from '@core';
import {
  ProductService,
  InventoryService,
  InventoryTransactionService,
  DataTableComponent,
  TableColumn,
  CellTemplateDirective,
  RowActionsTemplateDirective,
  ButtonComponent,
  DialogComponent,
  InputComponent,
  SelectComponent,
  SelectOption,
  KpiCardComponent,
  StatusBadgeComponent,
  NotificationService
} from '@shared';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DecimalPipe,
    DataTableComponent,
    CellTemplateDirective,
    RowActionsTemplateDirective,
    ButtonComponent,
    DialogComponent,
    InputComponent,
    SelectComponent,
    KpiCardComponent,
    StatusBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly inventoryService = inject(InventoryService);
  private readonly transactionService = inject(InventoryTransactionService);
  private readonly notify = inject(NotificationService);

  readonly TransactionType = TransactionType;

  readonly loading = signal<boolean>(false);
  readonly savingTransaction = signal<boolean>(false);
  readonly transactionDialogVisible = signal<boolean>(false);

  readonly transactionType = signal<TransactionType>(TransactionType.INFLOW);
  readonly selectedProdId = signal<number | null>(null);

  readonly productsList = signal<ProductDTO[]>([]);
  readonly inventoryList = signal<InventoryResDTO[]>([]);
  readonly inventoryViewList = signal<InventoryItemView[]>([]);

  readonly summary = signal<InventorySummary>({
    totalStockValue: 0,
    totalItemsCount: 0,
    distinctProductsCount: 0,
    weightedAverageCost: 0,
    criticalItemsCount: 0
  });

  readonly columns: TableColumn[] = [
    { field: 'productId', header: 'Cód', width: '5.5rem', prefix: '#', mono: true, muted: true },
    { field: 'productName', header: 'Produto', bold: true },
    { field: 'barcode', header: 'Código de Barras', mono: true, fallback: 'S/N' },
    { field: 'unitOfMeasure', header: 'Unidade', width: '6.5rem', align: 'center' },
    { field: 'currentQuantity', header: 'Qtd em Estoque', type: 'number', format: '1.0-3', align: 'right' },
    { field: 'currentAverageCost', header: 'Custo Médio', type: 'currency', align: 'right' },
    { field: 'totalValue', header: 'Valor Total', type: 'currency', align: 'right', bold: true },
    { field: 'statusInventory', header: 'Status', width: '7.5rem', align: 'center' },
    { field: 'updatedAt', header: 'Última Atualiz.', type: 'date', width: '10.5rem' }
  ];

  readonly transactionForm: FormGroup = this.fb.group({
    productId: [null, [Validators.required]],
    quantity: [null, [Validators.required, Validators.min(0.001)]],
    unitValue: [null, [Validators.required, Validators.min(0.001)]],
    notes: ['']
  });

  readonly isEntry = computed(() => this.transactionType() === TransactionType.INFLOW);

  readonly productSelectOptions = computed<SelectOption<number>[]>(() =>
    this.productsList().map((p) => ({
      label: `${p.name || 'Produto sem nome'} (${p.barcode || 'S/N'}) - ${p.unitOfMeasure || 'UN'}`,
      value: p.id!
    }))
  );

  readonly selectedInventoryItem = computed<InventoryItemView | undefined>(() => {
    const prodId = this.selectedProdId();
    if (!prodId) return undefined;
    return this.inventoryViewList().find((i) => i.productId === prodId);
  });

  readonly calculatedTotal = signal<number>(0);
  readonly calculatedCmv = signal<number>(0);

  constructor() {
    this.transactionForm.valueChanges.subscribe((vals) => {
      const qty = Number(vals.quantity) || 0;
      const unitVal = Number(vals.unitValue) || 0;
      this.calculatedTotal.set(qty * unitVal);

      const avgCost = this.selectedInventoryItem()?.currentAverageCost || unitVal;
      this.calculatedCmv.set(qty * avgCost);
    });

    this.transactionForm.get('productId')?.valueChanges.subscribe((idVal) => {
      const id = idVal ? Number(idVal) : null;
      this.selectedProdId.set(id);

      if (id) {
        const inv = this.inventoryViewList().find((i) => i.productId === id);
        if (inv && inv.currentAverageCost > 0) {
          if (!this.transactionForm.get('unitValue')?.value || !this.isEntry()) {
            this.transactionForm.patchValue({ unitValue: inv.currentAverageCost });
          }
        }
      }
    });
  }

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
        const sanitized = (products || []).map(sanitizeProduct);
        this.productsList.set(sanitized);
        this.inventoryList.set(inventory || []);
        this.consolidateInventoryView();
        this.computeSummary();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do inventário:', err);
        this.notify.error('Não foi possível carregar os dados de produtos e inventário.');
        this.loading.set(false);
      }
    });
  }

  private consolidateInventoryView(): void {
    const inventoryMap = new Map<number, InventoryResDTO>();
    for (const inv of this.inventoryList()) {
      if (inv.productId != null) {
        inventoryMap.set(inv.productId, inv);
      }
    }

    const views: InventoryItemView[] = this.productsList().map((p) => {
      const inv = p.id != null ? inventoryMap.get(p.id) : undefined;
      const qty = inv?.currentQuantity ?? 0;
      const cost = inv?.currentAverageCost ?? 0;
      const total = qty * cost;

      return {
        id: inv?.id,
        productId: p.id!,
        productName: p.name || 'Produto sem nome',
        barcode: p.barcode,
        description: p.description,
        unitOfMeasure: p.unitOfMeasure,
        currentQuantity: qty,
        currentAverageCost: cost,
        inventoryMinimum: inv?.inventoryMinimum,
        statusInventory: inv?.statusInventory ?? (qty <= 0 ? StatusInventory.CRITICAL : StatusInventory.NORMAL),
        totalValue: total,
        updatedAt: inv?.updatedAt
      };
    });

    this.inventoryViewList.set(views);
  }

  private computeSummary(): void {
    let totalValue = 0;
    let totalQty = 0;
    let distinctWithStock = 0;
    let criticalCount = 0;

    for (const item of this.inventoryViewList()) {
      totalValue += item.totalValue;
      totalQty += item.currentQuantity;
      if (item.currentQuantity > 0) {
        distinctWithStock++;
      }
      if (item.statusInventory === StatusInventory.CRITICAL) {
        criticalCount++;
      }
    }

    this.summary.set({
      totalStockValue: totalValue,
      totalItemsCount: totalQty,
      distinctProductsCount: distinctWithStock,
      weightedAverageCost: totalQty > 0 ? totalValue / totalQty : 0,
      criticalItemsCount: criticalCount
    });
  }

  onOpenTransaction(event: { productId?: number; type?: TransactionType } = {}): void {
    const type = event.type || TransactionType.INFLOW;
    const prodId = event.productId ?? null;

    this.transactionType.set(type);
    this.selectedProdId.set(prodId);

    this.transactionForm.reset({
      productId: prodId,
      quantity: null,
      unitValue: null,
      notes: ''
    });

    if (prodId) {
      const inv = this.inventoryViewList().find((i) => i.productId === prodId);
      if (inv && inv.currentAverageCost > 0) {
        this.transactionForm.patchValue({ unitValue: inv.currentAverageCost });
      }
    }

    this.transactionDialogVisible.set(true);
  }

  onQuickAction(item: InventoryItemView, type: TransactionType): void {
    this.onOpenTransaction({ productId: item.productId, type });
  }

  setTransactionType(type: TransactionType): void {
    this.transactionType.set(type);
    if (type === TransactionType.OUTFLOW) {
      const inv = this.selectedInventoryItem();
      if (inv && inv.currentAverageCost > 0) {
        this.transactionForm.patchValue({ unitValue: inv.currentAverageCost });
      }
    }
  }

  fillTotalQuantity(): void {
    const item = this.selectedInventoryItem();
    if (item && item.currentQuantity > 0) {
      this.transactionForm.patchValue({ quantity: item.currentQuantity });
      this.transactionForm.get('quantity')?.markAsDirty();
      this.transactionForm.get('quantity')?.markAsTouched();
    }
  }

  onSaveTransaction(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const raw = this.transactionForm.value;
    const isEntry = this.isEntry();
    const payload: InventoryTransactionReqDTO = {
      productId: Number(raw.productId),
      quantity: Number(raw.quantity),
      unitValue: Number(raw.unitValue),
      notes: raw.notes?.trim() || undefined
    };

    this.savingTransaction.set(true);
    const action$ = isEntry
      ? this.transactionService.createInflow(payload)
      : this.transactionService.createOutflow(payload);

    action$.subscribe({
      next: () => {
        this.savingTransaction.set(false);
        this.transactionDialogVisible.set(false);

        this.notify.success(
          isEntry
            ? `Entrada de ${payload.quantity} unidade(s) confirmada com sucesso!`
            : `Saída de ${payload.quantity} unidade(s) confirmada com sucesso!`,
          isEntry ? 'Entrada Registrada' : 'Saída Registrada'
        );

        this.loadData();
      },
      error: (err) => {
        this.savingTransaction.set(false);
        console.error('Erro ao salvar movimentação:', err);
        this.notify.error('Não foi possível registrar a movimentação de estoque.');
      }
    });
  }
}
