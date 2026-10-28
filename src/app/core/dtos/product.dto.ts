import { UnitOfMeasure, UnitOfMeasureType, UnitOfMeasureEnum } from '../enums/unit-of-measure.enum';

export interface ProductReqDTO {
  id?: number;
  name?: string;
  barcode?: string;
  description?: string;
  unitOfMeasure?: UnitOfMeasure | UnitOfMeasureType | UnitOfMeasureEnum;
  createdAt?: string;
}

export type ProductResDTO = ProductReqDTO;

// Aliases para manter compatibilidade com códigos existentes
export type ProductDTO = ProductReqDTO;
export type CreateProductDTO = Omit<ProductReqDTO, 'id' | 'createdAt'>;
export type UpdateProductDTO = ProductReqDTO;
