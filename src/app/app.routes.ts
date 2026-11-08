import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./features/inventory/inventory').then((m) => m.Inventory),
    title: 'Inventário e Estoque | Oranco'
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products').then((m) => m.Products),
    title: 'Catálogo de Produtos | Oranco'
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transactions').then((m) => m.Transactions),
    title: 'Histórico de Transações & CMV | Oranco'
  },
  {
    path: '**',
    redirectTo: 'inventory'
  }
];
