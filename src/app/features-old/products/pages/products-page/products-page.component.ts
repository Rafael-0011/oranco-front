import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductService } from '@shared';
import { ProductDTO } from '@core';
import { sanitizeProduct } from '../../../../core/utils/data-sanitizer';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ToastModule, ProductTableComponent, ProductDialogComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly messageService = inject(MessageService);

  readonly products = signal<ProductDTO[]>([]);
  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly dialogVisible = signal<boolean>(false);
  readonly currentProduct = signal<ProductDTO | undefined>(undefined);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.findAll().subscribe({
      next: (list) => {
        const sanitized = (list || []).map(sanitizeProduct);
        this.products.set(sanitized);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar lista de produtos.'
        });
        this.loading.set(false);
      }
    });
  }

  onOpenNew(): void {
    this.currentProduct.set(undefined);
    this.dialogVisible.set(true);
  }

  onEditProduct(product: ProductDTO): void {
    this.currentProduct.set(product);
    this.dialogVisible.set(true);
  }

  onDeleteProduct(id?: number): void {
    if (!id) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto excluído com sucesso!'
        });
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erro ao excluir produto:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível excluir o produto.'
        });
      }
    });
  }

  handleSaveProduct(product: ProductDTO): void {
    this.saving.set(true);

    const action$ = product.id
      ? this.productService.update(product.id, product)
      : this.productService.create(product);

    action$.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: product.id ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!'
        });
        this.loadProducts();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Erro ao salvar produto:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao salvar o produto.'
        });
      }
    });
  }
}
