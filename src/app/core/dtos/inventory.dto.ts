import { StatusInventory, StatusInventoryType } from '../enums/status-inventory.enum';
import { UnitOfMeasure, UnitOfMeasureType, UnitOfMeasureEnum } from '../enums/unit-of-measure.enum';

export interface InventoryReqDTO {
  id?: number;
  productId?: number;
  currentQuantity?: number;
  currentAverageCost?: number;
  inventoryMinimum?: number;
}

export interface InventoryResDTO {
  id?: number;
  productId?: number;
  name?: string;
  barcode?: string;
  unitOfMeasure?: UnitOfMeasure | UnitOfMeasureType | UnitOfMeasureEnum;
  currentQuantity?: number;
  currentAverageCost?: number;
  inventoryMinimum?: number;
  updatedAt?: string;
  statusInventory?: StatusInventory | StatusInventoryType;
}

// Aliases para manter compatibilidade com códigos existentes
export type InventoryDTO = InventoryResDTO;
export type CreateInventoryDTO = InventoryReqDTO;
export type UpdateInventoryDTO = InventoryReqDTO;
