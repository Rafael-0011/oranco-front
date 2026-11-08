import { toInventoryItemView, toInventoryItemViewList, calculateInventorySummary } from './inventory.mapper';
import { toEnrichedTransaction, toEnrichedTransactionList } from './inventory-transaction.mapper';
import { toProductView, toProductViewList } from './product.mapper';
import { StatusInventory } from '../enums/status-inventory.enum';
import { UnitOfMeasureEnum } from '../enums/unit-of-measure.enum';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';

describe('Core Mappers', () => {
  describe('inventory.mapper', () => {
    it('should map InventoryResDTO to InventoryItemView correctly', () => {
      const dto = {
        id: 1,
        productId: 10,
        name: 'Item A',
        barcode: '123',
        unitOfMeasure: UnitOfMeasureEnum.UN,
        currentQuantity: 15,
        currentAverageCost: 20,
        inventoryMinimum: 5,
        statusInventory: StatusInventory.NORMAL
      };

      const view = toInventoryItemView(dto);
      expect(view.id).toBe(1);
      expect(view.productId).toBe(10);
      expect(view.productName).toBe('Item A');
      expect(view.totalValue).toBe(300);
      expect(view.statusInventory).toBe(StatusInventory.NORMAL);
    });

    it('should calculate InventorySummary accurately', () => {
      const views = [
        {
          productId: 1,
          productName: 'A',
          currentQuantity: 10,
          currentAverageCost: 5,
          totalValue: 50,
          statusInventory: StatusInventory.NORMAL
        },
        {
          productId: 2,
          productName: 'B',
          currentQuantity: 0,
          currentAverageCost: 10,
          totalValue: 0,
          statusInventory: StatusInventory.CRITICAL
        }
      ];

      const summary = calculateInventorySummary(views);
      expect(summary.totalStockValue).toBe(50);
      expect(summary.totalItemsCount).toBe(10);
      expect(summary.distinctProductsCount).toBe(1);
      expect(summary.criticalItemsCount).toBe(1);
      expect(summary.weightedAverageCost).toBe(5);
    });
  });

  describe('inventory-transaction.mapper', () => {
    it('should map InventoryTransactionResDTO to EnrichedTransaction', () => {
      const dto = {
        id: 1,
        productId: 5,
        name: 'Produto X',
        quantity: 10,
        unitValue: 2.5,
        transactionType: TransactionTypeEnum.INFLOW
      };

      const enriched = toEnrichedTransaction(dto);
      expect(enriched.productName).toBe('Produto X');
      expect(enriched.quantity).toBe(10);
    });
  });

  describe('product.mapper', () => {
    it('should sanitize and map ProductResDTO', () => {
      const dtoList = [
        { id: 1, name: 'Prod 1', unitOfMeasure: UnitOfMeasureEnum.KG }
      ];

      const list = toProductViewList(dtoList);
      expect(list.length).toBe(1);
      expect(list[0].name).toBe('Prod 1');
    });
  });
});

