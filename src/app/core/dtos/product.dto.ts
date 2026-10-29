import { UnitOfMeasure, UnitOfMeasureType, UnitOfMeasureEnum } from '../enums/unit-of-measure.enum';

export interface ProductReqDTO {
  id?: number;
  name?: string;
  barcode?: string;
  description?: string;
  unitOfMeasure?: UnitOfMeasure | UnitOfMeasureType | UnitOfMeasureEnum;
  createdAt?: string;
}

export interface ProductResDTO {
  id?: number;
  name?: string;
  barcode?: string;
  description?: string;
  unitOfMeasure?: UnitOfMeasure | UnitOfMeasureType | UnitOfMeasureEnum;
  createdAt?: string;
}

// Aliases para manter compatibilidade com códigos existentes
export type ProductDTO = ProductResDTO;
export type CreateProductDTO = ProductReqDTO;
export type UpdateProductDTO = ProductReqDTO;
