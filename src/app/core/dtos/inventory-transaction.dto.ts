import { TransactionType, TransactionTypeType } from '../enums/transaction-type.enum';

export interface InventoryTransactionDTO {
  id?: number;
  productId?: number;
  transactionType?: TransactionType | TransactionTypeType;
  quantity?: number;
  unitValue?: number;
  cmv?: number;
  transactionDate?: string;
  notes?: string;
}

export type CreateInventoryTransactionDTO = Omit<InventoryTransactionDTO, 'id'>;
export type UpdateInventoryTransactionDTO = InventoryTransactionDTO;

