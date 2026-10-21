import { UnitOfMeasure, UnitOfMeasureType } from '../enums/unit-of-measure.enum';

export interface Inventory {
  id?: number;
  productId: number;
  currentQuantity: number;
  currentAverageCost: number;
  updatedAt?: string | Date;
}

export interface InventoryItemView {
  id?: number;
  productId: number;
  productName: string;
  barcode?: string;
  description?: string;
  unitOfMeasure?: UnitOfMeasure | UnitOfMeasureType;
  currentQuantity: number;
  currentAverageCost: number;
  totalValue: number;
  updatedAt?: string | Date;
}

export interface InventorySummary {
  totalStockValue: number;
  totalItemsCount: number;
  distinctProductsCount: number;
  weightedAverageCost: number;
}
