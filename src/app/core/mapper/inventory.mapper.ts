import { InventoryResDTO } from '../dtos/inventory.dto';
import { ProductDTO } from '../dtos/product.dto';
import { InventoryItemView, InventorySummary } from '../models/inventory.model';
import { StatusInventory } from '../enums/status-inventory.enum';

/**
 * Mapeia um DTO de Inventário para a ViewModel de exibição na tabela.
 */
export function toInventoryItemView(
  dto: InventoryResDTO,
  product?: ProductDTO
): InventoryItemView {
  const qty = dto.currentQuantity ?? 0;
  const cost = dto.currentAverageCost ?? 0;
  const total = qty * cost;

  return {
    id: dto.id,
    productId: dto.productId ?? product?.id ?? 0,
    productName: dto.name || product?.name || (dto.productId ? `Produto #${dto.productId}` : 'Produto sem nome'),
    barcode: dto.barcode || product?.barcode,
    description: product?.description,
    unitOfMeasure: dto.unitOfMeasure || product?.unitOfMeasure,
    currentQuantity: qty,
    currentAverageCost: cost,
    inventoryMinimum: dto.inventoryMinimum,
    statusInventory: dto.statusInventory ?? (qty <= 0 ? StatusInventory.CRITICAL : StatusInventory.NORMAL),
    totalValue: total,
    updatedAt: dto.updatedAt
  };
}

/**
 * Mapeia uma lista de InventoryResDTO para InventoryItemView[],
 * enriquecendo com informações de produto caso fornecido.
 */
export function toInventoryItemViewList(
  dtos: InventoryResDTO[],
  products?: ProductDTO[]
): InventoryItemView[] {
  const prodMap = new Map<number, ProductDTO>();
  if (products) {
    for (const p of products) {
      if (p.id != null) prodMap.set(p.id, p);
    }
  }

  return (dtos || []).map((dto) =>
    toInventoryItemView(dto, dto.productId != null ? prodMap.get(dto.productId) : undefined)
  );
}

/**
 * Apura os totais e métricas de resumo (KPIs) a partir dos itens de inventário consolidados.
 */
export function calculateInventorySummary(items: InventoryItemView[]): InventorySummary {
  let totalValue = 0;
  let totalQty = 0;
  let distinctWithStock = 0;
  let criticalCount = 0;

  for (const item of items) {
    totalValue += item.totalValue;
    totalQty += item.currentQuantity;
    if (item.currentQuantity > 0) {
      distinctWithStock++;
    }
    if (item.statusInventory === StatusInventory.CRITICAL) {
      criticalCount++;
    }
  }

  return {
    totalStockValue: totalValue,
    totalItemsCount: totalQty,
    distinctProductsCount: distinctWithStock,
    weightedAverageCost: totalQty > 0 ? totalValue / totalQty : 0,
    criticalItemsCount: criticalCount
  };
}

