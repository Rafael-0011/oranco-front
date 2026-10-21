import { UnitOfMeasure, UnitOfMeasureType } from '../enums/unit-of-measure.enum';

export interface ProductDTO {
  id?: number;
  name?: string;
  barcode?: string;
  description?: string;
  unitOfMeasure?: UnitOfMeasure | UnitOfMeasureType;
  createdAt?: string;
}

export type CreateProductDTO = Omit<ProductDTO, 'id' | 'createdAt'>;
export type UpdateProductDTO = ProductDTO;

