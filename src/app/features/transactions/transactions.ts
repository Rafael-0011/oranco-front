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
  InventoryTransactionResDTO,
  InventoryTransactionReqDTO,
  InventoryItemView,
  TransactionType,
  sanitizeProduct
} from '@core';
import {
  ProductService,
  InventoryService,
  InventoryTransactionService,
  DataTableComponent,
  TableColumn,
  CellTemplateDirective,
  ButtonComponent,
  DialogComponent,
  InputComponent,
  SelectComponent,
  SelectOption,
  NotificationService
} from '@shared';

export interface EnrichedTransaction extends InventoryTransactionResDTO {
  productName?: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DecimalPipe,
    DataTableComponent,
    CellTemplateDirective,
    ButtonComponent,
    DialogComponent,
    InputComponent,
    SelectComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(InventoryTransactionService);
  private readonly productService = inject(ProductService);
  private readonly inventoryService = inject(InventoryService);
  private readonly notify = inject(NotificationService);

  readonly TransactionType = TransactionType;

  readonly transactions = signal<EnrichedTransaction[]>([]);
  readonly products = signal<ProductDTO[]>([]);
  readonly inventoryItems = signal<InventoryItemView[]>([]);

  readonly loading = signal<boolean>(false);
  readonly savingTransaction = signal<boolean>(false);
  readonly transactionDialogVisible = signal<boolean>(false);

  readonly transactionType = signal<TransactionType>(TransactionType.INFLOW);
  readonly selectedProdId = signal<number | null>(null);

  readonly columns: TableColumn[] = [
    { field: 'id', header: 'ID', width: '5.5rem', prefix: '#', mono: true, muted: true },
    { field: 'transactionDate', header: 'Data/Hora', type: 'date', width: '11rem' },
    { field: 'productName', header: 'Produto', bold: true },
    { field: 'transactionType', header: 'Tipo', width: '8.5rem', align: 'center' },
    { field: 'quantity', header: 'Quantidade', type: 'number', format: '1.0-3', align: 'right', bold: true },
    { field: 'unitValue', header: 'Valor Unit.', type: 'currency', align: 'right' },
    { field: 'cmv', header: 'CMV Calculado', align: 'right', bold: true },
    { field: 'notes', header: 'Observações / NF', fallback: '—' }
  ];

  readonly transactionForm: FormGroup = this.fb.group({
    productId: [null, [Validators.required]],
    quantity: [null, [Validators.required, Validators.min(0.001)]],
    unitValue: [null, [Validators.required, Validators.min(0.001)]],
    notes: ['']
  });

  readonly isEntry = computed(() => this.transactionType() === TransactionType.INFLOW);

  readonly productSelectOptions = computed<SelectOption<number>[]>(() =>
    this.products().map((p) => ({
      label: `${p.name || 'Produto sem nome'} (${p.barcode || 'S/N'}) - ${p.unitOfMeasure || 'UN'}`,
      value: p.id!
    }))
  );

  readonly selectedInventoryItem = computed<InventoryItemView | undefined>(() => {
    const prodId = this.selectedProdId();
    if (!prodId) return undefined;
    return this.inventoryItems().find((i) => i.productId === prodId);
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
        const inv = this.inventoryItems().find((i) => i.productId === id);
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
      transactions: this.transactionService.findAll(),
      products: this.productService.findAll(),
      inventory: this.inventoryService.findAll()
    }).subscribe({
      next: ({ transactions, products, inventory }) => {
        const prodList = (products || []).map(sanitizeProduct);
        this.products.set(prodList);

        const productMap = new Map<number, ProductDTO>();
        for (const p of prodList) {
          if (p.id != null) productMap.set(p.id, p);
        }

        const enrichedList: EnrichedTransaction[] = (transactions || []).map((t) => {
          const prod = t.productId != null ? productMap.get(t.productId) : undefined;
          return {
            ...t,
            productName: prod?.name || `Produto #${t.productId}`
          };
        });

        this.transactions.set(enrichedList);

        const inventoryMap = new Map<number, InventoryResDTO>();
        for (const inv of inventory || []) {
          if (inv.productId != null) inventoryMap.set(inv.productId, inv);
        }

        const views: InventoryItemView[] = prodList.map((p) => {
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
            inventoryMinimum: inv?.inventoryMinimum,
            statusInventory: inv?.statusInventory,
            totalValue: qty * cost
          };
        });

        this.inventoryItems.set(views);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar movimentações:', err);
        this.notify.error('Falha ao carregar o histórico de transações.');
        this.loading.set(false);
      }
    });
  }

  onOpenTransaction(): void {
    this.transactionType.set(TransactionType.INFLOW);
    this.selectedProdId.set(null);

    this.transactionForm.reset({
      productId: null,
      quantity: null,
      unitValue: null,
      notes: ''
    });

    this.transactionDialogVisible.set(true);
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
        console.error('Erro ao registrar movimentação:', err);
        this.notify.error('Não foi possível registrar a movimentação.');
      }
    });
  }
}
