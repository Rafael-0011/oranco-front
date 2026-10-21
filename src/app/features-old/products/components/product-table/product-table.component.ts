import { Component, ViewChild, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProductDTO } from '../../../../core/dtos/product.dto';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, DatePipe],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {
  readonly products = input<ProductDTO[]>([]);
  readonly loading = input<boolean>(false);

  readonly refresh = output<void>();
  readonly openNewProduct = output<void>();
  readonly editProduct = output<ProductDTO>();
  readonly deleteProduct = output<number | undefined>();

  @ViewChild('dt') dt!: Table;

  onGlobalFilter(table: Table, event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(filterValue, 'contains');
  }
}

