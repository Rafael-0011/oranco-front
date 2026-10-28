import { StatusInventory, StatusInventoryType } from '../enums/status-inventory.enum';

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
