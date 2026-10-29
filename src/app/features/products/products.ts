import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDTO, ProductReqDTO, UnitOfMeasure, UnitOfMeasureEnum, sanitizeProduct } from '@core';
import {
  ProductService,
  DataTableComponent,
  TableColumn,
  CellTemplateDirective,
  RowActionsTemplateDirective,
  ButtonComponent,
  DialogComponent,
  InputComponent,
  SelectComponent,
  SelectOption,
  ConfirmDialogComponent,
  NotificationService
} from '@shared';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTableComponent,
    CellTemplateDirective,
    RowActionsTemplateDirective,
    ButtonComponent,
    DialogComponent,
    InputComponent,
    SelectComponent,
    ConfirmDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly notify = inject(NotificationService);

  readonly products = signal<ProductDTO[]>([]);
  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly deleting = signal<boolean>(false);

  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(10);
  readonly totalRecords = signal<number>(0);

  private lastPageKey = '';

  readonly dialogVisible = signal<boolean>(false);
  readonly confirmDeleteVisible = signal<boolean>(false);

  readonly currentProduct = signal<ProductDTO | undefined>(undefined);
  readonly productToDelete = signal<ProductDTO | undefined>(undefined);

  readonly unitOptions: SelectOption<UnitOfMeasure>[] = [
    { label: 'Unidade (UN)', value: UnitOfMeasureEnum.UN },
    { label: 'Quilograma (KG)', value: UnitOfMeasureEnum.KG },
    { label: 'Grama (G)', value: UnitOfMeasureEnum.G },
    { label: 'Litro (L)', value: UnitOfMeasureEnum.L },
    { label: 'Mililitro (ML)', value: UnitOfMeasureEnum.ML }
  ];

  readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    barcode: ['', [Validators.maxLength(50)]],
    unitOfMeasure: [UnitOfMeasureEnum.UN, [Validators.required]],
    description: ['', [Validators.maxLength(255)]]
  });

  readonly deleteMessage = computed(() => {
    const p = this.productToDelete();
    return p
      ? `Tem certeza que deseja excluir o produto "${p.name}"? Esta ação removerá o item do catálogo.`
      : 'Tem certeza que deseja excluir este produto?';
  });

  readonly columns: TableColumn[] = [
    { field: 'id', header: 'ID', width: '5.5rem', prefix: '#', mono: true, muted: true },
    { field: 'name', header: 'Nome do Produto', bold: true },
    { field: 'barcode', header: 'Código de Barras', mono: true, fallback: 'S/N' },
    { field: 'unitOfMeasure', header: 'Unidade', width: '7rem', align: 'center' },
    { field: 'description', header: 'Descrição / Detalhes', fallback: '—' }
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page = this.currentPage(), size = this.pageSize(), force = false): void {
    const key = `${page}-${size}`;
    if (!force && this.lastPageKey === key) return;
    this.lastPageKey = key;

    this.loading.set(true);
    this.productService.findAllPage(page, size).subscribe({
      next: (res) => {
        const sanitized = (res.content || []).map(sanitizeProduct);
        this.products.set(sanitized);
        this.totalRecords.set(res.totalElements ?? sanitized.length);
        this.currentPage.set(res.page ?? page);
        this.pageSize.set(size);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar produtos paginados:', err);
        this.lastPageKey = '';
        this.loading.set(false);
        this.notify.error('Falha ao carregar lista de produtos.');
      }
    });
  }

  onPageChange(event: { page: number; size: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    this.loadProducts(event.page, event.size);
  }

  onOpenNew(): void {
    this.currentProduct.set(undefined);
    this.productForm.reset({ unitOfMeasure: UnitOfMeasureEnum.UN });
    this.dialogVisible.set(true);
  }

  onEditProduct(product: ProductDTO): void {
    this.currentProduct.set(product);
    this.productForm.patchValue({
      name: product.name || '',
      barcode: product.barcode || '',
      unitOfMeasure: product.unitOfMeasure || UnitOfMeasureEnum.UN,
      description: product.description || ''
    });
    this.dialogVisible.set(true);
  }

  onDeleteProduct(product: ProductDTO): void {
    this.productToDelete.set(product);
    this.confirmDeleteVisible.set(true);
  }

  confirmDelete(): void {
    const prod = this.productToDelete();
    if (!prod?.id) return;

    this.deleting.set(true);
    this.productService.delete(prod.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.confirmDeleteVisible.set(false);
        this.productToDelete.set(undefined);
        this.notify.success(`Produto "${prod.name}" excluído com sucesso!`);
        this.loadProducts(this.currentPage(), this.pageSize(), true);
      },
      error: (err) => {
        this.deleting.set(false);
        console.error('Erro ao excluir produto:', err);
        this.notify.error('Não foi possível excluir o produto. Verifique se existem movimentações associadas.');
      }
    });
  }

  onSaveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const raw = this.productForm.value;
    const editing = this.currentProduct();
    const payload: ProductReqDTO = {
      name: raw.name.trim(),
      barcode: raw.barcode?.trim() || undefined,
      unitOfMeasure: raw.unitOfMeasure,
      description: raw.description?.trim() || undefined
    };

    this.saving.set(true);
    const action$ = editing?.id
      ? this.productService.update(editing.id, payload)
      : this.productService.create(payload);

    action$.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          editing ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!',
          editing ? 'Atualizado' : 'Criado'
        );
        this.loadProducts(this.currentPage(), this.pageSize(), true);
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Erro ao salvar produto:', err);
        this.notify.error('Não foi possível salvar o produto. Verifique os dados informados.');
      }
    });
  }
}
