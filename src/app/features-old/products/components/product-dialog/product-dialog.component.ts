import { Component, effect, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ProductDTO } from '../../../../core/dtos/product.dto';
import { UnitOfMeasure } from '../../../../core/enums/unit-of-measure.enum';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    InputTextModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly visible = model<boolean>(false);
  readonly editingProduct = input<ProductDTO | undefined>(undefined);
  readonly submitting = input<boolean>(false);

  readonly saveProduct = output<ProductDTO>();

  readonly unitOptions = [
    { label: 'Unidade (UN)', value: UnitOfMeasure.UN },
    { label: 'Quilograma (KG)', value: UnitOfMeasure.KG },
    { label: 'Grama (G)', value: UnitOfMeasure.G },
    { label: 'Litro (L)', value: UnitOfMeasure.L },
    { label: 'Mililitro (ML)', value: UnitOfMeasure.ML }
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    barcode: [''],
    unitOfMeasure: [UnitOfMeasure.UN, [Validators.required]],
    description: ['']
  });

  constructor() {
    effect(() => {
      const prod = this.editingProduct();
      if (prod) {
        this.form.patchValue({
          name: prod.name,
          barcode: prod.barcode || '',
          unitOfMeasure: prod.unitOfMeasure || UnitOfMeasure.UN,
          description: prod.description || ''
        });
      } else {
        this.form.reset({ unitOfMeasure: UnitOfMeasure.UN });
      }
    });
  }

  handleClose(): void {
    this.visible.set(false);
    this.form.reset({ unitOfMeasure: UnitOfMeasure.UN });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const current = this.editingProduct();

    const product: ProductDTO = {
      id: current?.id,
      name: raw.name.trim(),
      barcode: raw.barcode?.trim() || undefined,
      unitOfMeasure: raw.unitOfMeasure,
      description: raw.description?.trim() || undefined
    };

    this.saveProduct.emit(product);
  }
}

