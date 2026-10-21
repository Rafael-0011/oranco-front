import { UnitOfMeasure, UnitOfMeasureType } from '../enums/unit-of-measure.enum';

export interface Product {
  id?: number;
  name: string;
  barcode?: string;
  description?: string;
  unitOfMeasure?: UnitOfMeasure | UnitOfMeasureType;
  createdAt?: string | Date;
}

