import { UserProfile, PriceTier, CustomerProductPrice, ProductPrices, AuthorizedPrice } from '../types';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';

const PRICES_STORAGE_KEY = 'selsabil_product_prices_db';
const CUSTOM_PRICES_STORAGE_KEY = 'selsabil_customer_prices_db';

// Initialize product prices from catalog
export const getStoredProductPrices = (): Record<string, ProductPrices> => {
  const data = localStorage.getItem(PRICES_STORAGE_KEY);
  if (!data) {
    const initialMap: Record<string, ProductPrices> = {};
    SAMPLE_PRODUCTS.forEach((p) => {
      initialMap[p.product.id] = p.prices;
    });
    localStorage.setItem(PRICES_STORAGE_KEY, JSON.stringify(initialMap));
    return initialMap;
  }
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

export const saveProductPrices = (pricesMap: Record<string, ProductPrices>) => {
  localStorage.setItem(PRICES_STORAGE_KEY, JSON.stringify(pricesMap));
};

// Customer Specific Custom Prices
export const getStoredCustomPrices = (): CustomerProductPrice[] => {
  const data = localStorage.getItem(CUSTOM_PRICES_STORAGE_KEY);
  if (!data) {
    // Initial demo custom pricing: Customer cust-103 has a special unit price for tomato and oil!
    const initialCustom: CustomerProductPrice[] = [
      {
        id: 'cust-103_prod-002',
        userId: 'cust-103',
        productId: 'prod-002',
        customUnitPrice: 230, // Regular gros is 245 DA -> custom discount to 230 DA/unit!
        customCartonPrice: 230 * 12,
        active: true,
        note: 'تخفيض كبار التجار المتعاملين مع مندوب D03',
        createdAt: '2026-11-05T10:00:00Z',
        updatedAt: '2026-11-05T10:00:00Z',
      },
    ];
    localStorage.setItem(CUSTOM_PRICES_STORAGE_KEY, JSON.stringify(initialCustom));
    return initialCustom;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveCustomPrices = (prices: CustomerProductPrice[]) => {
  localStorage.setItem(CUSTOM_PRICES_STORAGE_KEY, JSON.stringify(prices));
};

/**
 * CORE SECURITY & PRICING ENGINE
 * Strict Priority:
 * 1. Customer-Specific Custom Price (if active)
 * 2. Customer Price Tier (GROS, DEMI_GROS, DETAIL)
 * 3. None (for visitors and pending accounts - Zero Leak)
 */
export const getAuthorizedPriceForProduct = (
  productId: string,
  user: UserProfile | null,
  unitsPerCarton = 1
): {
  authorized: boolean;
  unitPrice: number;
  cartonPrice: number;
  priceSource: 'CUSTOM' | 'TIER' | 'NONE';
  priceTier: PriceTier | null;
  message?: string;
} => {
  // Visitor or unapproved: ZERO LEAKAGE
  if (!user || user.status !== 'approved' || user.role === 'visitor') {
    return {
      authorized: false,
      unitPrice: 0,
      cartonPrice: 0,
      priceSource: 'NONE',
      priceTier: null,
      message: 'سجل الدخول كتاجر معتمد لمشاهدة أسعارك',
    };
  }

  // 1. Check for Customer-Specific Custom Price
  const customPrices = getStoredCustomPrices();
  const custom = customPrices.find(
    (c) => c.userId === user.uid && c.productId === productId && c.active
  );

  if (custom && custom.customUnitPrice !== null && custom.customUnitPrice > 0) {
    const unitPrice = custom.customUnitPrice;
    const cartonPrice = custom.customCartonPrice || unitPrice * unitsPerCarton;
    return {
      authorized: true,
      unitPrice,
      cartonPrice,
      priceSource: 'CUSTOM',
      priceTier: user.priceTier,
      message: 'سعر خاص مخصص لحسابك التجاري',
    };
  }

  // 2. Fallback to Customer Price Tier
  const allPrices = getStoredProductPrices();
  const productPrice = allPrices[productId];

  if (!productPrice || !user.priceTier) {
    return {
      authorized: false,
      unitPrice: 0,
      cartonPrice: 0,
      priceSource: 'NONE',
      priceTier: null,
      message: 'لم يتم تعيين فئة سعر لحسابك بعد',
    };
  }

  let unitPrice = 0;
  let cartonPrice = 0;

  if (user.priceTier === 'GROS') {
    unitPrice = productPrice.grosUnitPrice;
    cartonPrice = productPrice.grosCartonPrice || unitPrice * unitsPerCarton;
  } else if (user.priceTier === 'DEMI_GROS') {
    unitPrice = productPrice.demiGrosUnitPrice;
    cartonPrice = productPrice.demiGrosCartonPrice || unitPrice * unitsPerCarton;
  } else {
    // DETAIL
    unitPrice = productPrice.detailUnitPrice;
    cartonPrice = productPrice.detailCartonPrice || unitPrice * unitsPerCarton;
  }

  return {
    authorized: true,
    unitPrice,
    cartonPrice,
    priceSource: 'TIER',
    priceTier: user.priceTier,
  };
};

// Admin operation: Set customer custom price
export const assignCustomerCustomPrice = (
  userId: string,
  productId: string,
  customUnitPrice: number,
  unitsPerCarton: number,
  note = ''
): CustomerProductPrice => {
  const customPrices = getStoredCustomPrices();
  const id = `${userId}_${productId}`;
  const customCartonPrice = customUnitPrice * unitsPerCarton;

  const existingIdx = customPrices.findIndex((c) => c.id === id);
  const now = new Date().toISOString();

  let result: CustomerProductPrice;
  if (existingIdx > -1) {
    result = {
      ...customPrices[existingIdx],
      customUnitPrice,
      customCartonPrice,
      active: true,
      note,
      updatedAt: now,
    };
    customPrices[existingIdx] = result;
  } else {
    result = {
      id,
      userId,
      productId,
      customUnitPrice,
      customCartonPrice,
      active: true,
      note,
      createdAt: now,
      updatedAt: now,
    };
    customPrices.push(result);
  }

  saveCustomPrices(customPrices);
  return result;
};

// Admin operation: Remove customer custom price (returns back to tier price)
export const removeCustomerCustomPrice = (userId: string, productId: string) => {
  const customPrices = getStoredCustomPrices();
  const id = `${userId}_${productId}`;
  const filtered = customPrices.filter((c) => c.id !== id);
  saveCustomPrices(filtered);
};

// Admin operation: Update base unit prices for a product across all tiers
export const updateProductBasePrices = (
  productId: string,
  grosUnitPrice: number,
  demiGrosUnitPrice: number,
  detailUnitPrice: number,
  unitsPerCarton: number
) => {
  const allPrices = getStoredProductPrices();
  allPrices[productId] = {
    productId,
    grosUnitPrice,
    grosCartonPrice: grosUnitPrice * unitsPerCarton,
    demiGrosUnitPrice,
    demiGrosCartonPrice: demiGrosUnitPrice * unitsPerCarton,
    detailUnitPrice,
    detailCartonPrice: detailUnitPrice * unitsPerCarton,
    updatedAt: new Date().toISOString(),
  };
  saveProductPrices(allPrices);
};
