import { ProductResDTO, ProductDTO } from '../dtos/product.dto';
import { sanitizeProduct } from '../utils/data-sanitizer';

/**
 * Mapeia e sanitiza o DTO de produto para a interface do frontend.
 */
export function toProductView(dto: ProductResDTO): ProductDTO {
  return sanitizeProduct(dto);
}

/**
 * Mapeia e sanitiza uma lista de produtos.
 */
export function toProductViewList(dtos: ProductResDTO[]): ProductDTO[] {
  return (dtos || []).map(toProductView);
}

