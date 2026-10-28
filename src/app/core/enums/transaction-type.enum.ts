export enum TransactionType {
  INFLOW = 'INFLOW',
  OUTFLOW = 'OUTFLOW'
}

export type TransactionTypeType = `${TransactionType}`;

export { TransactionType as TransactionTypeEnum };
