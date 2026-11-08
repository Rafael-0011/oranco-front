export type ColumnType = 'text' | 'number' | 'currency' | 'date' | 'custom';

export interface TableColumn {
  /** Caminho do campo no objeto. Aceita notação com ponto: 'product.name' */
  field: string;
  header: string;
  type?: ColumnType;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;      // padrão: true
  searchable?: boolean;    // padrão: true (entra no filtro global)
  /** Formato do pipe: number '1.0-3', currency '1.2-2', date 'dd/MM/yyyy HH:mm' */
  format?: string;
  currency?: string;       // padrão 'BRL'
  fallback?: string;       // texto quando vazio (padrão '—')
  bold?: boolean;
  muted?: boolean;
  mono?: boolean;
  /** Prefixo fixo. Ex.: '#' para IDs */
  prefix?: string;
}

export interface CellContext<T = any> {
  $implicit: T;
  value: unknown;
  column: TableColumn;
}
