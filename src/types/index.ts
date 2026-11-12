/**
 * SELSABIL DELIVERY - Core TypeScript Types
 */

export type Role = 'visitor' | 'customer' | 'admin';

export type AccountStatus = 'pending' | 'approved' | 'suspended' | 'rejected';

export type PriceTier = 'GROS' | 'DEMI_GROS' | 'DETAIL';

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  status: AccountStatus;
  priceTier: PriceTier | null;
  firstName: string;
  lastName: string;
  phone: string;
  storeName: string;
  wilayaCode: string;
  wilayaName: { ar: string; fr: string };
  dairaName: { ar: string; fr: string };
  communeName: { ar: string; fr: string };
  address: string;
  commercialId: string | null;
  commercialCode: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
}

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'draft';

export interface Product {
  id: string;
  sku: string;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
  categoryId: string;
  mainImage: string;
  gallery: string[];
  unitsPerCarton: number;
  totalUnitsInStock: number; // Unit is the core storage base
  status: ProductStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPrices {
  productId: string;
  grosCartonPrice: number;
  grosUnitPrice: number;
  demiGrosCartonPrice: number;
  demiGrosUnitPrice: number;
  detailCartonPrice: number;
  detailUnitPrice: number;
  updatedAt: string;
  updatedBy?: string;
}

export interface CustomerProductPrice {
  id: string;
  userId: string;
  productId: string;
  customCartonPrice: number | null;
  customUnitPrice: number | null;
  active: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorizedPrice {
  productId: string;
  cartonPrice: number;
  unitPrice: number;
  priceSource: 'CUSTOM' | 'TIER' | 'NONE';
  priceTier: PriceTier | null;
}

export interface CartItem {
  product: Product;
  cartonsQuantity: number;
  unitsQuantity: number;
  totalUnits: number;
  appliedCartonPrice: number;
  appliedUnitPrice: number;
  priceSource: 'CUSTOM' | 'TIER';
  lineTotal: number;
}

export type OrderStatus =
  | 'NOUVEAU'
  | 'CONFIRME'
  | 'EN_PREPARATION'
  | 'PRET_A_EXPEDIER'
  | 'EXPEDIE'
  | 'EN_COURS_DE_LIVRAISON'
  | 'LIVRE'
  | 'ANNULE';

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  nameAr: string;
  nameFr: string;
  unitsPerCarton: number;
  cartonsQuantity: number;
  unitsQuantity: number;
  totalUnits: number;
  cartonPriceApplied: number;
  unitPriceApplied: number;
  priceSource: 'CUSTOM' | 'TIER';
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerInfo: {
    fullName: string;
    phone: string;
    storeName: string;
    priceTier: PriceTier;
  };
  commercialId: string | null;
  commercialCode: string | null;
  shippingAddress: {
    wilayaCode: string;
    wilayaName: { ar: string; fr: string };
    dairaName: { ar: string; fr: string };
    communeName: { ar: string; fr: string };
    detailedAddress: string;
  };
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  deletionReason?: string | null;
  stockDeducted: boolean;
  stockRestored: boolean;
  stockRestoredAt?: string | null;
  internalNotes?: string | null;
  customerNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTrackingEvent {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedAt: string;
  changedBy: string;
  customerNote?: string | null;
}

export interface CommercialRepresentative {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  active: boolean;
  wilayasCovered: string[];
  stats: {
    totalCustomers: number;
    totalOrders: number;
    totalSalesAmount: number;
    cancelledOrders: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Wilaya {
  code: string;
  nameAr: string;
  nameFr: string;
  dairas: {
    nameAr: string;
    nameFr: string;
    communes: {
      nameAr: string;
      nameFr: string;
    }[];
  }[];
  deliveryFee: number;
  deliveryAvailable: boolean;
}
