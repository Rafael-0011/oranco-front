import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ProductDTO } from '../../../../core/dtos/product.dto';
import { InventoryItemView } from '../../../../core/models/inventory.model';
import { TransactionType } from '../../../../core/enums/transaction-type.enum';
import { InventoryTransactionDTO } from '../../../../core/dtos/inventory-transaction.dto';
import {
  sanitizeBarcode,
  sanitizeProductName,
  sanitizeUnitOfMeasure
} from '../../../../core/utils/data-sanitizer';

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.css'
})
export class TransactionDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly visible = model<boolean>(false);
  readonly products = input<ProductDTO[]>([]);
  readonly inventoryItems = input<InventoryItemView[]>([]);
  readonly initialProductId = input<number | undefined>(undefined);
  readonly initialType = input<TransactionType | undefined>(undefined);
  readonly submitting = input<boolean>(false);

  readonly saveTransaction = output<InventoryTransactionDTO>();

  readonly TransactionType = TransactionType;

  readonly productOptions = signal<{ label: string; value: number }[]>([]);
  readonly selectedInventoryItem = signal<InventoryItemView | undefined>(undefined);

  readonly form: FormGroup = this.fb.group({
    productId: [null as number | null, [Validators.required]],
    transactionType: [TransactionType.INFLOW, [Validators.required]],
    quantity: [null as number | null, [Validators.required, Validators.min(0.0001)]],
    unitValue: [null as number | null, [Validators.required, Validators.min(0.0001)]],
    notes: ['']
  });

  constructor() {
    effect(() => {
      const prods = this.products();
      this.productOptions.set(
        prods.map((p) => {
          const name = sanitizeProductName(p.name, p.id);
          const barcode = sanitizeBarcode(p.barcode, p.id);
          const unit = sanitizeUnitOfMeasure(p.unitOfMeasure, p.id);
          return {
            label: `${name} (${barcode}) [${unit}]`,
            value: p.id!
          };
        })
      );
    });

    effect(() => {
      if (this.visible()) {
        this.initFormState();
      }
    });
  }

  private initFormState(): void {
    const targetType = this.initialType() || TransactionType.INFLOW;
    const prods = this.products();
    const targetProduct = this.initialProductId() || (prods.length > 0 ? prods[0].id : null);

    this.form.reset({
      productId: targetProduct,
      transactionType: targetType,
      quantity: null,
      unitValue: null,
      notes: ''
    });

    if (targetProduct != null) {
      this.onProductChange(targetProduct);
    }
  }

  setTransactionType(type: TransactionType): void {
    this.form.patchValue({ transactionType: type });
    const selected = this.selectedInventoryItem();
    if (type === TransactionType.OUTFLOW && selected) {
      if (!this.form.get('unitValue')?.value) {
        this.form.patchValue({ unitValue: selected.currentAverageCost });
      }
    }
  }

  onProductChange(productId: number): void {
    const found = this.inventoryItems().find((item) => item.productId === productId);
    this.selectedInventoryItem.set(found);

    if (this.form.get('transactionType')?.value === TransactionType.OUTFLOW && found) {
      this.form.patchValue({ unitValue: found.currentAverageCost });
    }
  }

  get calculatedTotal(): number {
    const qty = Number(this.form.get('quantity')?.value) || 0;
    const val = Number(this.form.get('unitValue')?.value) || 0;
    return qty * val;
  }

  get calculatedCmv(): number {
    const qty = Number(this.form.get('quantity')?.value) || 0;
    const avgCost =
      this.selectedInventoryItem()?.currentAverageCost || Number(this.form.get('unitValue')?.value) || 0;
    return qty * avgCost;
  }

  handleClose(): void {
    this.visible.set(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const transaction: InventoryTransactionDTO = {
      productId: Number(raw.productId),
      transactionType: raw.transactionType,
      quantity: Number(raw.quantity),
      unitValue: Number(raw.unitValue),
      cmv: raw.transactionType === TransactionType.OUTFLOW ? this.calculatedCmv : undefined,
      notes: raw.notes?.trim() || undefined
    };

    this.saveTransaction.emit(transaction);
  }
}
