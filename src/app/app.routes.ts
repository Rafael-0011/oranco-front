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
      import('./features-old/inventory/pages/inventory-page/inventory-page.component').then(
        (m) => m.InventoryPageComponent
      ),
    title: 'Inventário e Estoque | Oranco'
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features-old/products/pages/products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      ),
    title: 'Catálogo de Produtos | Oranco'
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features-old/transactions/pages/transactions-page/transactions-page.component').then(
        (m) => m.TransactionsPageComponent
      ),
    title: 'Histórico de Transações & CMV | Oranco'
  },
  {
    path: '**',
    redirectTo: 'inventory'
  }
];
