import { InventoryResDTO, InventoryDTO } from './inventory.dto';
import { InventoryTransactionResDTO, InventoryTransactionDTO } from './inventory-transaction.dto';

export interface PageResponseDTO<T> {
  content?: T[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export type PageResponseInventoryResDTO = PageResponseDTO<InventoryResDTO>;
export type PageResponseInventoryDTO = PageResponseDTO<InventoryDTO>;

export type PageResponseInventoryTransactionResDTO = PageResponseDTO<InventoryTransactionResDTO>;
export type PageResponseInventoryTransactionDTO = PageResponseDTO<InventoryTransactionDTO>;

export interface PageParams {
  page?: number;
  size?: number;
}
