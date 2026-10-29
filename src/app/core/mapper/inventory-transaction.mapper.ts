import { InventoryTransactionResDTO } from '../dtos/inventory-transaction.dto';
import { ProductDTO } from '../dtos/product.dto';

export interface EnrichedTransaction extends InventoryTransactionResDTO {
  productName?: string;
}

/**
 * Mapeia um DTO de Transação para a ViewModel de exibição, garantindo o nome do produto.
 */
export function toEnrichedTransaction(
  dto: InventoryTransactionResDTO,
  product?: ProductDTO
): EnrichedTransaction {
  return {
    ...dto,
    productName: dto.name || product?.name || (dto.productId ? `Produto #${dto.productId}` : 'Produto sem nome')
  };
}

/**
 * Mapeia uma lista de InventoryTransactionResDTO para EnrichedTransaction[].
 */
export function toEnrichedTransactionList(
  dtos: InventoryTransactionResDTO[],
  products?: ProductDTO[]
): EnrichedTransaction[] {
  const prodMap = new Map<number, ProductDTO>();
  if (products) {
    for (const p of products) {
      if (p.id != null) prodMap.set(p.id, p);
    }
  }

  return (dtos || []).map((dto) =>
    toEnrichedTransaction(dto, dto.productId != null ? prodMap.get(dto.productId) : undefined)
  );
}

