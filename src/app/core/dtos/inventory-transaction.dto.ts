import { TransactionType, TransactionTypeType, TransactionTypeEnum } from '../enums/transaction-type.enum';

export interface InventoryTransactionReqDTO {
  id?: number;
  productId?: number;
  quantity?: number;
  unitValue?: number;
  notes?: string;
  inventoryMinimum?: number;
}

export interface InventoryTransactionResDTO {
  id?: number;
  productId?: number;
  transactionType?: TransactionType | TransactionTypeType | TransactionTypeEnum;
  quantity?: number;
  unitValue?: number;
  cmv?: number;
  transactionDate?: string;
  notes?: string;
}

// Aliases para manter compatibilidade com códigos existentes
export type InventoryTransactionDTO = InventoryTransactionResDTO;
export type CreateInventoryTransactionDTO = InventoryTransactionReqDTO;
export type UpdateInventoryTransactionDTO = InventoryTransactionReqDTO;
