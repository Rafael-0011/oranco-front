import {
  ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, input, output, viewChild,
} from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonComponent } from '../button/button.component';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { TableColumn } from './data-table.types';
import { CellTemplateDirective, RowActionsTemplateDirective } from './data-table.directives';

@Component({
  selector: 'app-data-table',
  imports: [
    NgTemplateOutlet, CurrencyPipe, DatePipe, DecimalPipe, TableModule,
    ButtonComponent, SearchBoxComponent, EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T extends object = any> {
  // dados
  readonly data = input<T[]>([]);
  readonly columns = input.required<TableColumn[]>();
  readonly loading = input<boolean>(false);
  readonly dataKey = input<string>('id');

  // cabeçalho
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly searchable = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Buscar...');
  readonly showRefresh = input<boolean>(true);

  // paginação
  readonly paginator = input<boolean>(true);
  readonly rows = input<number>(10);
  readonly rowsPerPageOptions = input<number[]>([5, 10, 20, 50]);
  readonly reportTemplate = input<string>('Mostrando {first} a {last} de {totalRecords} registros');
  readonly lazy = input<boolean>(false);
  readonly totalRecords = input<number>(0);

  // estado vazio
  readonly emptyIcon = input<string>('pi-inbox');
  readonly emptyTitle = input<string>('Nenhum registro encontrado');
  readonly emptySubtitle = input<string>('');

  // eventos
  readonly refresh = output<void>();
  readonly rowClick = output<T>();
  readonly pageChange = output<{ page: number; size: number }>();

  // templates customizados
  private readonly cellTemplates = contentChildren(CellTemplateDirective);
  protected readonly rowActions = contentChild(RowActionsTemplateDirective);

  private readonly table = viewChild<Table>('dt');

  protected readonly cellMap = computed(
    () => new Map(this.cellTemplates().map((c) => [c.field(), c.template])),
  );
  protected readonly filterFields = computed(() =>
    this.columns().filter((c) => c.searchable !== false).map((c) => c.field),
  );
  protected readonly totalColumns = computed(
    () => this.columns().length + (this.rowActions() ? 1 : 0),
  );

  protected valueOf(row: T, path: string): any {
    return path.split('.').reduce<any>((acc, key) => acc?.[key], row);
  }

  protected isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  protected onSearch(text: string): void {
    this.table()?.filterGlobal(text, 'contains');
  }

  protected onTableLazyLoad(event: any): void {
    if (!this.lazy()) return;
    const first = event.first ?? 0;
    const rows = event.rows ?? this.rows();
    const page = Math.floor(first / rows);
    this.pageChange.emit({ page, size: rows });
  }

  /** Limpa filtros e ordenação. */
  reset(): void {
    this.table()?.reset();
  }
}
