export interface InventoryDTO {
  id?: number;
  productId?: number;
  currentQuantity?: number;
  currentAverageCost?: number;
  updatedAt?: string;
}

export type CreateInventoryDTO = Omit<InventoryDTO, 'id' | 'updatedAt'>;
export type UpdateInventoryDTO = InventoryDTO;

