import { UnitOfMeasure, UnitOfMeasureType } from '../enums/unit-of-measure.enum';
import { StatusInventory, StatusInventoryType } from '../enums/status-inventory.enum';

export interface Inventory {
  id?: number;
  productId: number;
  currentQuantity: number;
  currentAverageCost: number;
  inventoryMinimum?: number;
  updatedAt?: string | Date;
  statusInventory?: StatusInventory | StatusInventoryType;
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
  inventoryMinimum?: number;
  statusInventory?: StatusInventory | StatusInventoryType;
  totalValue: number;
  updatedAt?: string | Date;
}

export interface InventorySummary {
  totalStockValue: number;
  totalItemsCount: number;
  distinctProductsCount: number;
  weightedAverageCost: number;
  criticalItemsCount?: number;
}
