import { Product, ProductPrices } from '../types';
import { SAMPLE_PRODUCTS, ProductWithPrices } from '../data/sampleProducts';

const PRODUCTS_STORAGE_KEY = 'selsabil_products_db';
const STOCK_MOVEMENTS_STORAGE_KEY = 'selsabil_stock_movements_db';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'STOCK_ENTRY' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'CANCELLATION';
  unitsDelta: number;
  resultingTotalUnits: number;
  referenceId?: string;
  adminId?: string;
  reason: string;
  createdAt: string;
}

export const getStoredProductsWithPrices = (): ProductWithPrices[] => {
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(SAMPLE_PRODUCTS));
    return SAMPLE_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SAMPLE_PRODUCTS;
  }
};

const PRICES_STORAGE_KEY = 'selsabil_product_prices_db';

export const saveProductsWithPrices = (products: ProductWithPrices[]) => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  try {
    const pricesMap: Record<string, ProductPrices> = {};
    products.forEach((p) => {
      pricesMap[p.product.id] = p.prices;
    });
    localStorage.setItem(PRICES_STORAGE_KEY, JSON.stringify(pricesMap));
  } catch (err) {
    console.error('Failed to sync prices database', err);
  }
};

export const getStoredStockMovements = (): StockMovement[] => {
  const data = localStorage.getItem(STOCK_MOVEMENTS_STORAGE_KEY);
  if (!data) {
    const initialMovements: StockMovement[] = [
      {
        id: 'mov-001',
        productId: 'prod-001',
        productName: 'زيت المائدة الصافي سيفيتال 5 لتر',
        sku: 'SEL-OIL-5L',
        type: 'STOCK_ENTRY',
        unitsDelta: 240,
        resultingTotalUnits: 240,
        reason: 'شحنة استلام المستودع الأسبوعية (60 كرتون × 4 حبات)',
        createdAt: '2026-11-01T10:00:00Z',
      },
      {
        id: 'mov-002',
        productId: 'prod-002',
        productName: 'طماطم مصبرة كاب مضاعفة التركيز 800غ',
        sku: 'SEL-TOM-800G',
        type: 'STOCK_ENTRY',
        unitsDelta: 155,
        resultingTotalUnits: 155,
        reason: 'شحنة استلام (12 كرتون + 11 حبة)',
        createdAt: '2026-11-02T10:00:00Z',
      },
    ];
    localStorage.setItem(STOCK_MOVEMENTS_STORAGE_KEY, JSON.stringify(initialMovements));
    return initialMovements;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const recordStockMovement = (
  productId: string,
  productName: string,
  sku: string,
  type: StockMovement['type'],
  unitsDelta: number,
  resultingTotalUnits: number,
  reason: string,
  referenceId?: string
) => {
  const movements = getStoredStockMovements();
  const newMovement: StockMovement = {
    id: `mov-${Date.now()}`,
    productId,
    productName,
    sku,
    type,
    unitsDelta,
    resultingTotalUnits,
    reason,
    referenceId,
    createdAt: new Date().toISOString(),
  };
  movements.unshift(newMovement);
  localStorage.setItem(STOCK_MOVEMENTS_STORAGE_KEY, JSON.stringify(movements));
};

// Add single product
export const addSingleProduct = (params: {
  sku: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
  categoryId: string;
  mainImage: string;
  gallery?: string[];
  unitsPerCarton: number;
  initialCartons: number;
  detailUnitPrice: number;
  demiGrosUnitPrice: number;
  grosUnitPrice: number;
}): ProductWithPrices => {
  const products = getStoredProductsWithPrices();
  const id = `prod-${Date.now()}`;
  const totalUnits = params.initialCartons * params.unitsPerCarton;
  const now = new Date().toISOString();

  const newProduct: Product = {
    id,
    sku: params.sku.trim().toUpperCase() || `SEL-${Math.floor(1000 + Math.random() * 9000)}`,
    nameAr: params.nameAr,
    nameFr: params.nameFr || params.nameAr,
    descriptionAr: params.descriptionAr || params.nameAr,
    descriptionFr: params.descriptionFr || params.nameFr,
    categoryId: params.categoryId || 'cat-alimentaire',
    mainImage:
      params.mainImage ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    gallery: params.gallery || [],
    unitsPerCarton: params.unitsPerCarton || 12,
    totalUnitsInStock: totalUnits,
    status: 'active',
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const newPrices: ProductPrices = {
    productId: id,
    detailUnitPrice: params.detailUnitPrice,
    detailCartonPrice: params.detailUnitPrice * params.unitsPerCarton,
    demiGrosUnitPrice: params.demiGrosUnitPrice,
    demiGrosCartonPrice: params.demiGrosUnitPrice * params.unitsPerCarton,
    grosUnitPrice: params.grosUnitPrice,
    grosCartonPrice: params.grosUnitPrice * params.unitsPerCarton,
    updatedAt: now,
  };

  const item: ProductWithPrices = { product: newProduct, prices: newPrices };
  products.unshift(item);
  saveProductsWithPrices(products);

  // Record entry movement
  if (totalUnits > 0) {
    recordStockMovement(
      id,
      newProduct.nameAr,
      newProduct.sku,
      'STOCK_ENTRY',
      totalUnits,
      totalUnits,
      `إدخال منتج جديد بالمستودع (${params.initialCartons} كرتون × ${params.unitsPerCarton} حبة)`
    );
  }

  return item;
};

// Update product
export const updateProductDetails = (
  productId: string,
  updates: {
    sku?: string;
    nameAr?: string;
    nameFr?: string;
    descriptionAr?: string;
    descriptionFr?: string;
    categoryId?: string;
    mainImage?: string;
    unitsPerCarton?: number;
    addCartonsDelta?: number; // optional stock addition
    detailUnitPrice?: number;
    demiGrosUnitPrice?: number;
    grosUnitPrice?: number;
  }
): ProductWithPrices | null => {
  const products = getStoredProductsWithPrices();
  const idx = products.findIndex((p) => p.product.id === productId);
  if (idx === -1) return null;

  const item = products[idx];
  const now = new Date().toISOString();
  const unitsPerCarton = updates.unitsPerCarton ?? item.product.unitsPerCarton;

  let newTotalUnits = item.product.totalUnitsInStock;
  if (updates.addCartonsDelta && updates.addCartonsDelta !== 0) {
    const deltaUnits = updates.addCartonsDelta * unitsPerCarton;
    newTotalUnits = Math.max(0, newTotalUnits + deltaUnits);
    recordStockMovement(
      productId,
      updates.nameAr || item.product.nameAr,
      updates.sku || item.product.sku,
      updates.addCartonsDelta > 0 ? 'STOCK_ENTRY' : 'ADJUSTMENT',
      deltaUnits,
      newTotalUnits,
      `تعديل مخزون الإدارة (${updates.addCartonsDelta} كرتون)`
    );
  }

  const updatedProduct: Product = {
    ...item.product,
    sku: updates.sku ? updates.sku.trim().toUpperCase() : item.product.sku,
    nameAr: updates.nameAr ?? item.product.nameAr,
    nameFr: updates.nameFr ?? item.product.nameFr,
    descriptionAr: updates.descriptionAr ?? item.product.descriptionAr,
    descriptionFr: updates.descriptionFr ?? item.product.descriptionFr,
    categoryId: updates.categoryId ?? item.product.categoryId,
    mainImage: updates.mainImage ?? item.product.mainImage,
    unitsPerCarton,
    totalUnitsInStock: newTotalUnits,
    updatedAt: now,
  };

  const detailUnit = updates.detailUnitPrice ?? item.prices.detailUnitPrice;
  const demiUnit = updates.demiGrosUnitPrice ?? item.prices.demiGrosUnitPrice;
  const grosUnit = updates.grosUnitPrice ?? item.prices.grosUnitPrice;

  const updatedPrices: ProductPrices = {
    productId,
    detailUnitPrice: detailUnit,
    detailCartonPrice: detailUnit * unitsPerCarton,
    demiGrosUnitPrice: demiUnit,
    demiGrosCartonPrice: demiUnit * unitsPerCarton,
    grosUnitPrice: grosUnit,
    grosCartonPrice: grosUnit * unitsPerCarton,
    updatedAt: now,
  };

  products[idx] = { product: updatedProduct, prices: updatedPrices };
  saveProductsWithPrices(products);
  return products[idx];
};

// Toggle product visibility (Hide / Show)
export const toggleProductVisibility = (productId: string): ProductWithPrices | null => {
  const products = getStoredProductsWithPrices();
  const idx = products.findIndex((p) => p.product.id === productId);
  if (idx === -1) return null;

  const currentStatus = products[idx].product.status;
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

  products[idx].product.status = newStatus;
  products[idx].product.updatedAt = new Date().toISOString();
  saveProductsWithPrices(products);
  return products[idx];
};

// Soft delete product
export const softDeleteProduct = (productId: string): boolean => {
  const products = getStoredProductsWithPrices();
  const idx = products.findIndex((p) => p.product.id === productId);
  if (idx === -1) return false;

  products[idx].product.isDeleted = true;
  products[idx].product.status = 'inactive';
  products[idx].product.updatedAt = new Date().toISOString();
  saveProductsWithPrices(products);
  return true;
};

// Bulk Import from Excel / CSV Rows
export interface ExcelProductRow {
  name: string; // Column 1
  detailPrice: number; // Column 2: prix detail
  demiGrosPrice: number; // Column 3: prix demi gros
  grosPrice: number; // Column 4: prix gros
  unitsPerCarton?: number;
  cartonsStock?: number;
  category?: string;
  image?: string;
}

export const batchImportExcelProducts = (rows: ExcelProductRow[]): number => {
  const products = getStoredProductsWithPrices();
  let addedCount = 0;
  const now = new Date().toISOString();

  // Curated list of high quality fallback images for imported commodities
  const defaultImages = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
  ];

  rows.forEach((row, i) => {
    if (!row.name || row.detailPrice <= 0) return;

    const id = `prod-imp-${Date.now()}-${i}`;
    const unitsPerCarton = row.unitsPerCarton && row.unitsPerCarton > 0 ? row.unitsPerCarton : 12;
    const cartonsStock = row.cartonsStock && row.cartonsStock >= 0 ? row.cartonsStock : 10;
    const totalUnits = cartonsStock * unitsPerCarton;
    const sku = `SEL-IMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProd: Product = {
      id,
      sku,
      nameAr: row.name,
      nameFr: row.name,
      descriptionAr: `منتج تجاري مدرج بواسطة استيراد إكسل: ${row.name}`,
      descriptionFr: `Article commercial importé via Excel : ${row.name}`,
      categoryId: row.category || 'cat-alimentaire',
      mainImage: row.image || defaultImages[i % defaultImages.length],
      gallery: [],
      unitsPerCarton,
      totalUnitsInStock: totalUnits,
      status: 'active',
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    const newPrices: ProductPrices = {
      productId: id,
      detailUnitPrice: row.detailPrice,
      detailCartonPrice: row.detailPrice * unitsPerCarton,
      demiGrosUnitPrice: row.demiGrosPrice || Math.round(row.detailPrice * 0.92),
      demiGrosCartonPrice: (row.demiGrosPrice || Math.round(row.detailPrice * 0.92)) * unitsPerCarton,
      grosUnitPrice: row.grosPrice || Math.round(row.detailPrice * 0.85),
      grosCartonPrice: (row.grosPrice || Math.round(row.detailPrice * 0.85)) * unitsPerCarton,
      updatedAt: now,
    };

    products.unshift({ product: newProd, prices: newPrices });

    if (totalUnits > 0) {
      recordStockMovement(
        id,
        newProd.nameAr,
        newProd.sku,
        'STOCK_ENTRY',
        totalUnits,
        totalUnits,
        `استيراد إكسل للمستودع (${cartonsStock} كرتون)`
      );
    }

    addedCount++;
  });

  saveProductsWithPrices(products);
  return addedCount;
};
