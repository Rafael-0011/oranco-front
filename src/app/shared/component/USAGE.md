# Shared components (Angular + PrimeNG)

```ts
import {
  ButtonComponent, InputComponent, SelectComponent, DialogComponent,
  DataTableComponent, CellTemplateDirective, RowActionsTemplateDirective,
  StatusBadgeComponent, KpiCardComponent, TableColumn,
} from '@app/shared/component';   // ou caminho relativo
```

## Botão
```html
<app-button label="Salvar" icon="pi pi-check" type="submit" [disabled]="form.invalid" />
<app-button label="Cancelar" variant="secondary" appearance="outlined" />
<app-button icon="pi pi-trash" variant="danger" appearance="text" tooltip="Excluir" (clicked)="remove()" />
```

## Input / Select (funcionam com formControlName, formControl e ngModel)
```html
<form [formGroup]="form">
  <app-input label="Nome do produto" formControlName="name" required placeholder="Ex: Parafuso" />
  <app-input label="Preço" type="number" formControlName="price" icon="pi pi-dollar" />
  <app-select label="Unidade" formControlName="unit" [options]="unitOptions" required />
</form>
```
Erros aparecem automaticamente após `touched`. Personalize com
`[errorMessages]="{ required: 'Informe o nome' }"`.

## Dialog
```html
<app-dialog [(visible)]="open" title="Novo produto" subtitle="Dados do cadastro" icon="pi-box">
  <form [formGroup]="form"> ... </form>
  <div dialogFooter>
    <app-button label="Cancelar" variant="secondary" (clicked)="open.set(false)" />
    <app-button label="Salvar" icon="pi pi-check" (clicked)="save()" />
  </div>
</app-dialog>
```

## Tabela genérica
```ts
columns: TableColumn[] = [
  { field: 'productId', header: 'Cód', width: '5rem', prefix: '#', mono: true, muted: true },
  { field: 'productName', header: 'Produto' },
  { field: 'currentQuantity', header: 'Qtd', type: 'number', format: '1.0-3', align: 'right' },
  { field: 'currentAverageCost', header: 'Custo médio', type: 'currency', align: 'right' },
  { field: 'updatedAt', header: 'Atualizado', type: 'date', width: '10rem' },
];
```
```html
<app-data-table
  [data]="items()" [columns]="columns" [loading]="loading()" dataKey="productId"
  title="Inventário de Estoque" subtitle="Visão consolidada"
  searchPlaceholder="Buscar produto..." emptyTitle="Nenhum item" (refresh)="reload()"
>
  <app-button tableActions label="Nova movimentação" icon="pi pi-arrow-right-arrow-left" />

  <!-- célula customizada -->
  <ng-template appCell="currentQuantity" let-row let-value="value">
    <app-status-badge [label]="value" [severity]="value > 10 ? 'success' : value > 0 ? 'warn' : 'danger'" />
  </ng-template>

  <!-- ações por linha -->
  <ng-template appRowActions let-row>
    <app-button icon="pi pi-plus" variant="success" appearance="text" (clicked)="in(row)" />
    <app-button icon="pi pi-minus" variant="danger" appearance="text" [disabled]="row.currentQuantity <= 0" (clicked)="out(row)" />
  </ng-template>
</app-data-table>
```
Para usar `CellTemplateDirective`/`RowActionsTemplateDirective`, importe-as no `imports` do componente.

## KPI
```html
<app-kpi-card label="Valor total" [value]="summary().totalStockValue" format="currency"
  icon="pi-dollar" tone="blue" subtext="Patrimônio atual" />
```

## Popup de confirmação
```html
<app-confirm-dialog
  [(visible)]="confirmOpen" tone="danger"
  title="Excluir produto?" message="Esta ação não pode ser desfeita."
  confirmLabel="Excluir" [loading]="deleting()" (confirmed)="remove()" />
```

## Toast (notificação)
1. `app.config.ts` → `providers: [MessageService]` (de `primeng/api`)
2. `app.html` → `<app-toast />` (uma vez)
3. Em qualquer lugar: `notify = inject(NotificationService); this.notify.success('Produto salvo!');`
