import { Order, OrderItemSnapshot, OrderStatus, PriceTier } from '../types';
import { getStoredProductsWithPrices } from './productService';
import { recordStockMovement } from './productService';

const ORDERS_STORAGE_KEY = 'selsabil_orders_db';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'SEL-202611-001',
    customerId: 'cust-101',
    customerInfo: {
      fullName: 'أحمد بن علي (Ahmed Benali)',
      phone: '0550112233',
      storeName: 'سوبرماركت التوزيع الجزائري (Supermarché El Djazair)',
      priceTier: 'GROS',
    },
    commercialId: 'comm-01',
    commercialCode: 'D01',
    shippingAddress: {
      wilayaCode: '16',
      wilayaName: { ar: 'الجزائر', fr: 'Alger' },
      dairaName: { ar: 'الدار البيضاء', fr: 'Dar El Beïda' },
      communeName: { ar: 'باب الزوار', fr: 'Bab Ezzouar' },
      detailedAddress: 'حي 1200 مسكن عمارة 14 محل رقم 02',
    },
    items: [
      {
        productId: 'prod-001',
        sku: 'SEL-OIL-5L',
        nameAr: 'زيت المائدة الصافي سيفيتال 5 لتر',
        nameFr: 'Huile de Table Cevital 5 Litres',
        unitsPerCarton: 4,
        cartonsQuantity: 20,
        unitsQuantity: 0,
        totalUnits: 80,
        cartonPriceApplied: 2400,
        unitPriceApplied: 600,
        priceSource: 'TIER',
        lineTotal: 48000,
      },
      {
        productId: 'prod-002',
        sku: 'SEL-TOM-800G',
        nameAr: 'طماطم مصبرة كاب مضاعفة التركيز 800غ',
        nameFr: 'Double Concentré de Tomate Cab 800g',
        unitsPerCarton: 12,
        cartonsQuantity: 10,
        unitsQuantity: 6,
        totalUnits: 126,
        cartonPriceApplied: 2940,
        unitPriceApplied: 245,
        priceSource: 'TIER',
        lineTotal: 30870,
      },
    ],
    subtotal: 78870,
    deliveryFee: 400,
    totalAmount: 79270,
    paymentMethod: 'COD',
    status: 'CONFIRME',
    isDeleted: false,
    stockDeducted: true,
    stockRestored: false,
    customerNotes: 'يرجى التوصيل في الفترة الصباحية قبل الساعة 12:00',
    internalNotes: 'زبون جملة دائم تم الاتفاق عبر المندوب D01',
    createdAt: '2026-11-10T09:30:00Z',
    updatedAt: '2026-11-10T10:15:00Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'SEL-202611-002',
    customerId: 'cust-102',
    customerInfo: {
      fullName: 'كريم بلحاج (Karim Belhadj)',
      phone: '0770987654',
      storeName: 'مؤسسة الهضاب للتوزيع والجملة (Ets El Hidhab)',
      priceTier: 'DEMI_GROS',
    },
    commercialId: 'comm-03',
    commercialCode: 'D03',
    shippingAddress: {
      wilayaCode: '19',
      wilayaName: { ar: 'سطيف', fr: 'Sétif' },
      dairaName: { ar: 'سطيف', fr: 'Sétif' },
      communeName: { ar: 'سطيف', fr: 'Sétif' },
      detailedAddress: 'شارع 08 ماي 1945 مقابل محطة الحافلات',
    },
    items: [
      {
        productId: 'prod-003',
        sku: 'SEL-COF-250G',
        nameAr: 'قهوة مطحونة فاميكو أرابيكا 250غ',
        nameFr: 'Café Moulu Famico Arabica 250g',
        unitsPerCarton: 24,
        cartonsQuantity: 8,
        unitsQuantity: 12,
        totalUnits: 204,
        cartonPriceApplied: 5280,
        unitPriceApplied: 220,
        priceSource: 'TIER',
        lineTotal: 44880,
      },
    ],
    subtotal: 44880,
    deliveryFee: 600,
    totalAmount: 45480,
    paymentMethod: 'COD',
    status: 'NOUVEAU',
    isDeleted: false,
    stockDeducted: false,
    stockRestored: false,
    customerNotes: 'الرجاء الاتصال قبل التحرك من المستودع',
    internalNotes: 'طلب جديد قيد المراجعة',
    createdAt: '2026-11-11T08:15:00Z',
    updatedAt: '2026-11-11T08:15:00Z',
  },
  {
    id: 'ord-003',
    orderNumber: 'SEL-202611-003',
    customerId: 'cust-103',
    customerInfo: {
      fullName: 'مراد سلطاني (Mourad Soltani)',
      phone: '0560112233',
      storeName: 'ميني ماركت الباهية (Mini Market El Bahia)',
      priceTier: 'DETAIL',
    },
    commercialId: 'comm-02',
    commercialCode: 'D02',
    shippingAddress: {
      wilayaCode: '31',
      wilayaName: { ar: 'وهران', fr: 'Oran' },
      dairaName: { ar: 'وهران', fr: 'Oran' },
      communeName: { ar: 'وهران', fr: 'Oran' },
      detailedAddress: 'حي مارافال نهج الاستقلال رقم 45',
    },
    items: [
      {
        productId: 'prod-004',
        sku: 'SEL-PAS-500G',
        nameAr: 'عجائن معكرونة سميد ممتاز سيم 500غ',
        nameFr: 'Pâtes Couscous Sim Supérieur 500g',
        unitsPerCarton: 20,
        cartonsQuantity: 12,
        unitsQuantity: 0,
        totalUnits: 240,
        cartonPriceApplied: 1760,
        unitPriceApplied: 88,
        priceSource: 'TIER',
        lineTotal: 21120,
      },
    ],
    subtotal: 21120,
    deliveryFee: 500,
    totalAmount: 21620,
    paymentMethod: 'COD',
    status: 'EXPEDIE',
    isDeleted: false,
    stockDeducted: true,
    stockRestored: false,
    customerNotes: 'التسليم للمسؤول عن المستودع الأخ سمير',
    internalNotes: 'شحنة خرجت مع شاحنة التوزيع لوهران',
    createdAt: '2026-11-09T14:00:00Z',
    updatedAt: '2026-11-10T16:20:00Z',
  },
];

export const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

// Update order status (CONFIRME, NOUVEAU / EN REVISION, EXPEDIE, LIVRE, ANNULE)
export const updateOrderStatus = (
  orderId: string,
  newStatus: OrderStatus,
  adminNote?: string
): Order | null => {
  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const order = orders[idx];
  const oldStatus = order.status;
  order.status = newStatus;
  order.updatedAt = new Date().toISOString();

  if (adminNote) {
    order.internalNotes = order.internalNotes
      ? `${order.internalNotes} | ${adminNote}`
      : adminNote;
  }

  // Stock deduction / restoration logic
  if (newStatus === 'CONFIRME' && !order.stockDeducted) {
    order.stockDeducted = true;
    order.items.forEach((item) => {
      recordStockMovement(
        item.productId,
        item.nameAr,
        item.sku,
        'SALE',
        -item.totalUnits,
        0, // Delta deducted
        `تأكيد الطلب رقم ${order.orderNumber}`,
        order.orderNumber
      );
    });
  } else if (newStatus === 'ANNULE' && order.stockDeducted && !order.stockRestored) {
    order.stockRestored = true;
    order.stockRestoredAt = new Date().toISOString();
    order.items.forEach((item) => {
      recordStockMovement(
        item.productId,
        item.nameAr,
        item.sku,
        'CANCELLATION',
        item.totalUnits,
        0, // Delta restored
        `إلغاء الطلب رقم ${order.orderNumber} وإرجاع المخزون`,
        order.orderNumber
      );
    });
  }

  orders[idx] = order;
  saveOrders(orders);
  return order;
};

// Edit Order Items (Customer calls and asks to add, increase, or modify products)
export const editOrderItems = (
  orderId: string,
  updatedItems: OrderItemSnapshot[],
  adminNote?: string
): Order | null => {
  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const order = orders[idx];
  const newSubtotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const newTotalAmount = newSubtotal + order.deliveryFee;

  order.items = updatedItems;
  order.subtotal = newSubtotal;
  order.totalAmount = newTotalAmount;
  order.updatedAt = new Date().toISOString();

  const noteAddition = adminNote || 'تعديل سلع الوصل بناءً على اتصال الزبون';
  order.internalNotes = order.internalNotes
    ? `${order.internalNotes} | ${noteAddition}`
    : noteAddition;

  orders[idx] = order;
  saveOrders(orders);
  return order;
};

// Create a new order (from Checkout or Admin creation)
export const createNewOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'stockDeducted' | 'stockRestored'>): Order => {
  const orders = getStoredOrders();
  const count = orders.length + 1;
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const orderNumber = `SEL-${yearMonth}-${String(count).padStart(3, '0')}`;

  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber,
    isDeleted: false,
    stockDeducted: orderData.status === 'CONFIRME',
    stockRestored: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
};

// Soft delete order
export const softDeleteOrder = (orderId: string, reason = ''): boolean => {
  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return false;

  orders[idx].isDeleted = true;
  orders[idx].deletedAt = new Date().toISOString();
  orders[idx].deletionReason = reason || 'Suppression par l\'administrateur';
  saveOrders(orders);
  return true;
};
