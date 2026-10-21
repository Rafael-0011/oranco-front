import { InventoryDTO } from './inventory.dto';
import { InventoryTransactionDTO } from './inventory-transaction.dto';

export interface PageResponseDTO<T> {
  content?: T[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export type PageResponseInventoryDTO = PageResponseDTO<InventoryDTO>;
export type PageResponseInventoryTransactionDTO = PageResponseDTO<InventoryTransactionDTO>;

export interface PageParams {
  page?: number;
  size?: number;
}

