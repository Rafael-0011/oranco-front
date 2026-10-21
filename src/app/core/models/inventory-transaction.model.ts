import { TransactionType, TransactionTypeType } from '../enums/transaction-type.enum';

export interface InventoryTransaction {
  id?: number;
  productId: number;
  transactionType: TransactionType | TransactionTypeType;
  quantity: number;
  unitValue: number;
  cmv?: number;
  transactionDate?: string | Date;
  notes?: string;
}

