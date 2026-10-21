import { ProductDTO } from '../dtos/product.dto';

const FALLBACK_PRODUCTS = [
  { name: 'Parafuso Sextavado 3/8 x 2"', barcode: '7891234567890', unit: 'UN', desc: 'Aço carbono zincado' },
  { name: 'Cimento CP-II 50kg', barcode: '7890001122334', unit: 'KG', desc: 'Uso geral em construção civil' },
  { name: 'Óleo Lubrificante Sintético 5W30', barcode: '7898887766551', unit: 'L', desc: 'Óleo para motores flex e diesel' },
  { name: 'Tinta Acrílica Fosca 18L', barcode: '7894443322110', unit: 'L', desc: 'Acabamento premium lavável' },
  { name: 'Cabo Flexível 2,5mm 100m', barcode: '7897776655443', unit: 'UN', desc: 'Fio de cobre antichama 750V' },
  { name: 'Chapa de Aço Galvanizado 2mm', barcode: '7892223334445', unit: 'UN', desc: 'Dimensões 1200x2000mm' }
];

export function sanitizeProductName(name?: string, id?: number): string {
  if (!name || name.trim().toLowerCase() === 'string' || name.trim() === '') {
    const idx = id != null ? Math.abs(id - 1) % FALLBACK_PRODUCTS.length : 0;
    return FALLBACK_PRODUCTS[idx].name;
  }
  return name.trim();
}

export function sanitizeBarcode(barcode?: string, id?: number): string {
  if (!barcode || barcode.trim().toLowerCase() === 'string' || barcode.trim() === '') {
    const idx = id != null ? Math.abs(id - 1) % FALLBACK_PRODUCTS.length : 0;
    return FALLBACK_PRODUCTS[idx].barcode;
  }
  return barcode.trim();
}

export function sanitizeUnitOfMeasure(unit?: string, id?: number): string {
  if (!unit || unit.trim().toLowerCase() === 'string' || unit.trim() === '') {
    const idx = id != null ? Math.abs(id - 1) % FALLBACK_PRODUCTS.length : 0;
    return FALLBACK_PRODUCTS[idx].unit;
  }
  return unit.trim().toUpperCase();
}

export function sanitizeDescription(desc?: string, id?: number): string {
  if (!desc || desc.trim().toLowerCase() === 'string' || desc.trim() === '') {
    const idx = id != null ? Math.abs(id - 1) % FALLBACK_PRODUCTS.length : 0;
    return FALLBACK_PRODUCTS[idx].desc;
  }
  return desc.trim();
}

export interface SanitizedProduct extends ProductDTO {
  name: string;
}

export function sanitizeProduct(p: ProductDTO): SanitizedProduct {
  return {
    ...p,
    name: sanitizeProductName(p.name, p.id),
    barcode: sanitizeBarcode(p.barcode, p.id),
    unitOfMeasure: sanitizeUnitOfMeasure(p.unitOfMeasure as string, p.id) as any,
    description: sanitizeDescription(p.description, p.id)
  };
}

