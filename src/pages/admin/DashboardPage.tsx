import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertTriangle,
  Truck,
  CheckCircle,
  Shield,
  Layers,
  Search,
  Check,
  X,
  Plus,
  Filter,
  FileText,
  DollarSign,
  UserCheck,
  Percent,
  Lock,
  PauseCircle,
  PlayCircle,
  UserX,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { ALGERIA_GEOGRAPHY } from '../../data/algeriaGeography';
import { PriceTier, AccountStatus, UserProfile } from '../../types';
import {
  getStoredCustomers,
  approveCustomerWithTier,
  updateCustomerStatus,
  searchCustomers,
} from '../../services/customerService';
import {
  getStoredCommercials,
  addCommercial,
  toggleCommercialActive,
} from '../../services/commercialService';
import {
  getStoredProductPrices,
  updateProductBasePrices,
  getStoredCustomPrices,
  assignCustomerCustomPrice,
  removeCustomerCustomPrice,
} from '../../services/pricingService';
import {
  getStoredProductsWithPrices,
  getStoredStockMovements,
  StockMovement,
} from '../../services/productService';
import { ProductManagementTab } from '../../components/admin/ProductManagementTab';
import { getStoredOrders } from '../../services/orderService';
import { OrderManagementTab } from '../../components/admin/OrderManagementTab';
import { Order } from '../../types';

export const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'clients' | 'products' | 'pricing' | 'orders' | 'commercials' | 'delivery'
  >('overview');

  // Product base prices state
  const [productPricesMap, setProductPricesMap] = useState(() => getStoredProductPrices());
  const [customPricesList, setCustomPricesList] = useState(() => getStoredCustomPrices());
  const [productsList, setProductsList] = useState(() => getStoredProductsWithPrices());
  const [stockMovements, setStockMovements] = useState(() => getStoredStockMovements());

  const refreshProductsAndStock = () => {
    setProductsList(getStoredProductsWithPrices());
    setStockMovements(getStoredStockMovements());
    setProductPricesMap(getStoredProductPrices());
  };

  // Custom price assignment form state
  const [assignUserUid, setAssignUserUid] = useState('');
  const [assignProdId, setAssignProdId] = useState('');
  const [assignUnitPrice, setAssignUnitPrice] = useState<number>(0);
  const [assignNote, setAssignNote] = useState('');
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState<string | null>(null);

  // Customers state
  const [customersList, setCustomersList] = useState<UserProfile[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');

  // Commercials state
  const [commercialsList, setCommercialsList] = useState(() => getStoredCommercials());
  const [newCommCode, setNewCommCode] = useState('');
  const [newCommName, setNewCommName] = useState('');
  const [newCommPhone, setNewCommPhone] = useState('');
  const [showAddCommModal, setShowAddCommModal] = useState(false);
  const [commMsg, setCommMsg] = useState<string | null>(null);

  // Orders state connected to orderService
  const [ordersList, setOrdersList] = useState<Order[]>(() => getStoredOrders());

  const refreshOrders = () => {
    setOrdersList(getStoredOrders());
  };

  const refreshCustomers = () => {
    const list = searchCustomers(customerSearchQuery, customerStatusFilter);
    setCustomersList(list);
  };

  useEffect(() => {
    refreshCustomers();
  }, [customerSearchQuery, customerStatusFilter]);

  const handleApproveTier = (uid: string, tier: PriceTier) => {
    approveCustomerWithTier(uid, tier);
    refreshCustomers();
  };

  const handleSetStatus = (uid: string, st: AccountStatus) => {
    updateCustomerStatus(uid, st);
    refreshCustomers();
  };

  const handleAssignCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserUid || !assignProdId || assignUnitPrice <= 0) {
      return;
    }
    const prod = productsList.find((p) => p.product.id === assignProdId);
    const unitsPerCarton = prod?.product.unitsPerCarton || 1;
    assignCustomerCustomPrice(
      assignUserUid,
      assignProdId,
      assignUnitPrice,
      unitsPerCarton,
      assignNote
    );
    setCustomPricesList(getStoredCustomPrices());
    setAssignUserUid('');
    setAssignProdId('');
    setAssignUnitPrice(0);
    setAssignNote('');
    setPricingSuccessMsg('تم تخصيص سعر الحبة للزبون بنجاح');
    setTimeout(() => setPricingSuccessMsg(null), 3500);
  };

  const handleDeleteCustomPrice = (userId: string, productId: string) => {
    removeCustomerCustomPrice(userId, productId);
    setCustomPricesList(getStoredCustomPrices());
    setPricingSuccessMsg('تم حذف السعر المخصص والعودة لسعر فئة الزبون');
    setTimeout(() => setPricingSuccessMsg(null), 3500);
  };

  const handleUpdateProductBasePrice = (
    productId: string,
    tier: 'gros' | 'demi' | 'detail',
    newUnitPrice: number,
    unitsPerCarton: number
  ) => {
    const current = productPricesMap[productId] || {
      productId,
      grosUnitPrice: 100,
      grosCartonPrice: 100 * unitsPerCarton,
      demiGrosUnitPrice: 110,
      demiGrosCartonPrice: 110 * unitsPerCarton,
      detailUnitPrice: 125,
      detailCartonPrice: 125 * unitsPerCarton,
      updatedAt: new Date().toISOString(),
    };

    let grosU = current.grosUnitPrice;
    let demiU = current.demiGrosUnitPrice;
    let detailU = current.detailUnitPrice;

    if (tier === 'gros') grosU = newUnitPrice;
    if (tier === 'demi') demiU = newUnitPrice;
    if (tier === 'detail') detailU = newUnitPrice;

    updateProductBasePrices(productId, grosU, demiU, detailU, unitsPerCarton);
    setProductPricesMap(getStoredProductPrices());
  };

  const handleCreateCommercial = (e: React.FormEvent) => {
    e.preventDefault();
    setCommMsg(null);
    const res = addCommercial(newCommCode, newCommName, newCommPhone, ['16', '09']);
    if (res.success) {
      setCommercialsList(getStoredCommercials());
      setNewCommCode('');
      setNewCommName('');
      setNewCommPhone('');
      setShowAddCommModal(false);
      setCommMsg('تمت إضافة المندوب التجاري بنجاح');
      setTimeout(() => setCommMsg(null), 3000);
    } else {
      setCommMsg(res.error || 'خطأ في إنشاء المندوب');
    }
  };

  const handleToggleComm = (code: string) => {
    toggleCommercialActive(code);
    setCommercialsList(getStoredCommercials());
  };

  const totalProducts = productsList.filter((p) => !p.product.isDeleted).length;
  const totalUnitsInStock = productsList
    .filter((p) => !p.product.isDeleted)
    .reduce((sum, p) => sum + p.product.totalUnitsInStock, 0);

  const pendingCount = customersList.filter((c) => c.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Direct Access Instructions */}
      <div className="bg-[#0F392B] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-amber-400">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-emerald-900/80 px-2.5 py-0.5 rounded border border-emerald-700">
            <Shield className="w-3.5 h-3.5" />
            <span>SELSABIL CONTROL PANEL — وحدة تحكم المدير</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'ar' ? 'لوحة القيادة والإدارة المركزية' : 'Tableau de Bord & Gestion Centrale'}
          </h1>
          <p className="text-xs text-stone-300 max-w-xl">
            {language === 'ar'
              ? 'إدارة حسابات الزبائن، اعتماد فئات الأسعار (Gros/Demi-Gros/Détail)، مراقبة المخزون بالكرتون والحبة، وأكواد المندوبين (D01-D05)'
              : 'Validation des comptes, attribution des niveaux de prix, supervision des stocks et livreurs'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-950/70 p-3 rounded-xl border border-emerald-800 text-xs text-stone-200">
          <div className="w-9 h-9 rounded-lg bg-amber-400 text-stone-900 font-black flex items-center justify-center text-sm">
            ADM
          </div>
          <div>
            <div className="font-bold text-white">Direction Selsabil Delivery</div>
            <div className="text-[11px] text-amber-300">
              {language === 'ar' ? 'صلاحيات المدير الكاملة (Super Admin)' : 'Droits Administrateur Complets'}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#0F392B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{language === 'ar' ? 'نظرة عامة (Overview)' : 'Vue Générale'}</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
            activeTab === 'clients'
              ? 'bg-[#0F392B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>
            {language === 'ar' ? 'إدارة الزبائن والفئات (المرحلة 4)' : 'Gestion des Clients & Niveaux'}
            {pendingCount > 0 && (
              <span className="ms-1.5 px-1.5 py-0.2 bg-amber-400 text-stone-900 rounded-full text-[10px]">
                {pendingCount}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
            activeTab === 'products'
              ? 'bg-[#0F392B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{language === 'ar' ? 'المنتجات والمخزون' : 'Produits & Stocks'}</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
            activeTab === 'pricing'
              ? 'bg-[#0F392B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>
            {language === 'ar' ? 'إدارة الأسعار والتخصيص (المرحلة 5)' : 'Gestion des Prix & Tarifs'}
            {customPricesList.length > 0 && (
              <span className="ms-1.5 px-1.5 py-0.2 bg-amber-400 text-stone-900 rounded-full text-[10px]">
                {customPricesList.length}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
            activeTab === 'orders'
              ? 'bg-[#0F392B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{language === 'ar' ? 'الطلبات والفواتير (FR)' : 'Commandes & Factures'}</span>
        </button>

        <button
          onClick={() => setActiveTab('commercials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
            activeTab === 'commercials'
              ? 'bg-[#0F392B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{language === 'ar' ? 'المندوبون التجاريون (D01-D05)' : 'Commerciaux'}</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
            activeTab === 'delivery'
              ? 'bg-[#0F392B] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{language === 'ar' ? 'مناطق التوصيل (58 ولاية)' : 'Zones de Livraison'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-stone-500 text-xs">
                <span>{t.admin.totalRevenue}</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#0F392B]">
                {ordersList
                  .filter((o) => !o.isDeleted && o.status !== 'ANNULE')
                  .reduce((sum, o) => sum + o.totalAmount, 0)
                  .toLocaleString()}{' '}
                <span className="text-xs font-medium">{t.common.currency}</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                +24.5% {language === 'ar' ? 'هذا الشهر' : 'ce mois'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-stone-500 text-xs">
                <span>{t.admin.totalOrders}</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-stone-900">
                {ordersList.filter((o) => !o.isDeleted).length}
              </div>
              <div className="text-[11px] text-blue-700 font-medium">
                {ordersList.filter((o) => !o.isDeleted && o.status === 'NOUVEAU').length}{' '}
                {language === 'ar' ? 'طلب جديد ينتظر المراجعة والتأكيد' : 'en attente de confirmation'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-stone-500 text-xs">
                <span>{t.admin.pendingClients}</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-700">{pendingCount}</div>
              <div className="text-[11px] text-amber-700 font-medium">
                {language === 'ar' ? 'تنتظر تعيين فئة السعر' : 'En attente de validation'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-stone-500 text-xs">
                <span>{t.admin.stock}</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-stone-900">
                {totalUnitsInStock} <span className="text-xs font-normal text-stone-500">{t.product.units}</span>
              </div>
              <div className="text-[11px] text-stone-500">
                {totalProducts} {language === 'ar' ? 'منتجات في المستودع' : 'produits'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENTS & PRICE TIERS (PHASE 4 CORE FOCUS) */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-stone-900 text-base">
                {language === 'ar' ? 'نظام إدارة حسابات التجار وفئات الأسعار' : 'Gestion des Comptes & Attribution des Tarifs'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ar'
                  ? 'التحقق من هوية الزبون، تعيين فئة السعر (جملة/نصف جملة/تجزئة)، تعليق الحسابات أو رفضها'
                  : 'Validation, suspension, rejet et attribution du barème de prix aux commerçants'}
              </p>
            </div>

            <div className="text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-semibold">
              {language === 'ar'
                ? `إجمالي المسجلين: ${customersList.length}`
                : `Total inscrits : ${customersList.length}`}
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute top-2.5 start-3 text-stone-400" />
              <input
                type="text"
                placeholder={
                  language === 'ar'
                    ? 'ابحث باسم المحل، التاجر، رقم الهاتف، أو كود المندوب...'
                    : 'Rechercher par magasin, nom, téléphone, code commercial...'
                }
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg py-2 ps-9 pe-3 text-xs text-stone-900 focus:outline-emerald-800"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={customerStatusFilter}
                onChange={(e) => setCustomerStatusFilter(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
              >
                <option value="all">{language === 'ar' ? 'جميع الحالات' : 'Tous les statuts'}</option>
                <option value="pending">{language === 'ar' ? 'قيد المراجعة (En attente)' : 'En attente'}</option>
                <option value="approved">{language === 'ar' ? 'معتمد (Approuvé)' : 'Approuvé'}</option>
                <option value="suspended">{language === 'ar' ? 'معلّق (Suspendu)' : 'Suspendu'}</option>
                <option value="rejected">{language === 'ar' ? 'مرفوض (Refusé)' : 'Refusé'}</option>
              </select>
            </div>
          </div>

          {/* Customer Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3 text-start">{language === 'ar' ? 'المحل التجاري' : 'Magasin'}</th>
                  <th className="py-3 px-3 text-start">{language === 'ar' ? 'التاجر والاتصال' : 'Gérant & Tél'}</th>
                  <th className="py-3 px-3 text-start">{language === 'ar' ? 'الولاية والبلدية' : 'Wilaya / Commune'}</th>
                  <th className="py-3 px-3 text-start">{language === 'ar' ? 'كود المندوب' : 'Commercial'}</th>
                  <th className="py-3 px-3 text-start">{language === 'ar' ? 'الحالة الحالية' : 'Statut'}</th>
                  <th className="py-3 px-3 text-start">{language === 'ar' ? 'فئة السعر' : 'Niveau de Prix'}</th>
                  <th className="py-3 px-3 text-start">{language === 'ar' ? 'الإجراءات الإدارية' : 'Actions Admin'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customersList.map((c) => (
                  <tr key={c.uid} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-3">
                      <strong className="block text-stone-900 text-sm">{c.storeName}</strong>
                      <span className="text-[10px] text-stone-400 font-mono">UID: {c.uid}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div>{c.firstName} {c.lastName}</div>
                      <div className="text-stone-500 font-mono text-[11px]">{c.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      <div>{language === 'ar' ? c.wilayaName.ar : c.wilayaName.fr} ({c.wilayaCode})</div>
                      <div className="text-[10px] text-stone-400">{language === 'ar' ? c.communeName.ar : c.communeName.fr}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                        {c.commercialCode || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {c.status === 'pending' && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {t.status.pending}
                        </span>
                      )}
                      {c.status === 'approved' && (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {t.status.approved}
                        </span>
                      )}
                      {c.status === 'suspended' && (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {t.status.suspended}
                        </span>
                      )}
                      {c.status === 'rejected' && (
                        <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {t.status.rejected}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {c.priceTier ? (
                        <span className="font-extrabold text-[#0F392B] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                          {t.tiers[c.priceTier]}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px] italic">لم تحدد بعد</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {/* Admin action buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {c.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveTier(c.uid, 'GROS')}
                              className="bg-[#0F392B] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-emerald-950 transition"
                              title="اعتماد مباشر كتاجر جملة"
                            >
                              + جملة (Gros)
                            </button>
                            <button
                              onClick={() => handleApproveTier(c.uid, 'DEMI_GROS')}
                              className="bg-amber-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-amber-700 transition"
                              title="اعتماد مباشر كنصف جملة"
                            >
                              + نصف جملة
                            </button>
                            <button
                              onClick={() => handleApproveTier(c.uid, 'DETAIL')}
                              className="bg-stone-700 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-stone-800 transition"
                              title="اعتماد مباشر كتجزئة"
                            >
                              + تجزئة
                            </button>
                            <button
                              onClick={() => handleSetStatus(c.uid, 'rejected')}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="رفض الحساب"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Change tier */}
                            <select
                              value={c.priceTier || 'GROS'}
                              onChange={(e) =>
                                handleApproveTier(c.uid, e.target.value as PriceTier)
                              }
                              className="bg-white border border-stone-300 rounded px-1.5 py-1 text-[11px] font-semibold focus:outline-emerald-800"
                            >
                              <option value="GROS">جملة (Gros)</option>
                              <option value="DEMI_GROS">نصف جملة (Demi-Gros)</option>
                              <option value="DETAIL">تجزئة (Détail)</option>
                            </select>

                            {/* Suspend / Reactivate */}
                            {c.status === 'approved' ? (
                              <button
                                onClick={() => handleSetStatus(c.uid, 'suspended')}
                                className="text-amber-700 hover:bg-amber-50 p-1 rounded border border-amber-200 text-[10px] font-medium"
                                title="تعليق الحساب مؤقتاً"
                              >
                                تعليق
                              </button>
                            ) : c.status === 'suspended' ? (
                              <button
                                onClick={() => handleSetStatus(c.uid, 'approved')}
                                className="text-emerald-700 hover:bg-emerald-50 p-1 rounded border border-emerald-200 text-[10px] font-medium"
                                title="إعادة تفعيل الحساب"
                              >
                                إعادة تفعيل
                              </button>
                            ) : null}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS & INVENTORY MANAGEMENT */}
      {activeTab === 'products' && (
        <ProductManagementTab
          products={productsList}
          stockMovements={stockMovements}
          onRefresh={refreshProductsAndStock}
          language={language}
          currency={t.common.currency}
        />
      )}

      {/* TAB: PRICING & CUSTOMER-SPECIFIC PRICING (PHASE 5 CORE FOCUS) */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {pricingSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pricingSuccessMsg}</span>
            </div>
          )}

          {/* Section 1: Customer-Specific Pricing (تخصيص الأسعار لكل زبون) */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-1">
                  <Percent className="w-3 h-3 text-amber-600" />
                  <span>Customer-Specific Pricing Engine</span>
                </div>
                <h3 className="text-base font-black text-stone-900">
                  {language === 'ar' ? 'تخصيص الأسعار لكل زبون (أعلى درجات الأولوية)' : 'Tarification Individualisée par Client'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'ar'
                    ? 'يستطيع المدير تحديد سعر حبة مستقل لزبون معين على منتج محدد، ويتفوق هذا السعر تلقائياً على فئة سعر الزبون.'
                    : 'Le prix unitaire personnalisé est prioritaire sur la grille tarifaire standard du client.'}
                </p>
              </div>

              <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded font-semibold">
                {customPricesList.length} {language === 'ar' ? 'أسعار مخصصة نشطة' : 'tarifs personnalisés'}
              </span>
            </div>

            {/* Form to Assign Customer Custom Price */}
            <form onSubmit={handleAssignCustomPrice} className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? '1. اختر التاجر / المحل' : '1. Client commerçant'}
                </label>
                <select
                  required
                  value={assignUserUid}
                  onChange={(e) => setAssignUserUid(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-emerald-800"
                >
                  <option value="">{language === 'ar' ? '-- اختر الزبون --' : '-- Choisir le client --'}</option>
                  {customersList.map((c) => (
                    <option key={c.uid} value={c.uid}>
                      {c.storeName} ({c.firstName} {c.lastName}) - {c.priceTier || c.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? '2. اختر المنتج' : '2. Produit'}
                </label>
                <select
                  required
                  value={assignProdId}
                  onChange={(e) => setAssignProdId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-emerald-800"
                >
                  <option value="">{language === 'ar' ? '-- اختر المنتج --' : '-- Choisir le produit --'}</option>
                  {productsList
                    .filter((p) => !p.product.isDeleted)
                    .map(({ product }) => (
                      <option key={product.id} value={product.id}>
                        {product.sku} - {language === 'ar' ? product.nameAr : product.nameFr}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? '3. سعر الحبة المخصص (د.ج)' : '3. Prix Unitaire (DA)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="مثال: 220"
                  value={assignUnitPrice || ''}
                  onChange={(e) => setAssignUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-2 text-xs font-bold text-[#0F392B] focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? '4. سبب التخصيص أو ملاحظة' : '4. Motif / Note'}
                </label>
                <input
                  type="text"
                  placeholder="زبون وفي، كميات ضخمة..."
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-2 text-xs focus:outline-emerald-800"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#0F392B] hover:bg-emerald-950 text-white font-bold py-2 rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تخصيص السعر' : 'Attribuer'}</span>
                </button>
              </div>
            </form>

            {/* List of Active Customer-Specific Prices */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المحل والتاجر' : 'Client'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المنتج' : 'Produit'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'سعر الحبة المخصص' : 'Prix Unitaire Spécial'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'سعر الكرتون المحسوب' : 'Carton Calculé'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الملاحظة' : 'Note'}</th>
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customPricesList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-stone-400">
                        {language === 'ar'
                          ? 'لا توجد أسعار استثنائية مخصصة حالياً. جميع الزبائن يخضعون لأسعار فئاتهم (جملة/نصف جملة/تجزئة).'
                          : 'Aucun tarif personnalisé actif.'}
                      </td>
                    </tr>
                  ) : (
                    customPricesList.map((cp) => {
                      const matchedCust = customersList.find((c) => c.uid === cp.userId);
                      const matchedProd = productsList.find((p) => p.product.id === cp.productId);
                      return (
                        <tr key={cp.id} className="hover:bg-stone-50/70">
                          <td className="py-2.5 px-3 font-bold text-stone-900">
                            {matchedCust?.storeName || cp.userId}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono text-stone-500 font-bold me-1">
                              {matchedProd?.product.sku}
                            </span>
                            <span>{language === 'ar' ? matchedProd?.product.nameAr : matchedProd?.product.nameFr}</span>
                          </td>
                          <td className="py-2.5 px-3 font-black text-[#0F392B] text-sm">
                            {cp.customUnitPrice?.toLocaleString()} {t.common.currency} / حبة
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-stone-700">
                            {cp.customCartonPrice?.toLocaleString()} {t.common.currency}
                          </td>
                          <td className="py-2.5 px-3 text-stone-500 italic">
                            {cp.note || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => handleDeleteCustomPrice(cp.userId, cp.productId)}
                              className="text-red-600 hover:text-red-800 text-[11px] font-semibold flex items-center gap-1 p-1 hover:bg-red-50 rounded transition"
                              title="حذف السعر المخصص والرجوع لسعر فئة الزبون"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? 'حذف واسترجاع الفئة' : 'Supprimer'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Base Unit Prices across 3 Tiers (GROS, DEMI_GROS, DETAIL) */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="text-base font-black text-stone-900">
                {language === 'ar' ? 'جدول أسعار الحبة والكرتون للفئات الثلاث (GROS, DEMI, DETAIL)' : 'Grille Tarifaire des 3 Niveaux'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'ar'
                  ? 'سعر الحبة هو الأساس، وسعر الكرتون يُحسب تلقائياً وفق عدد الحبات في العبوة (Total = سعر الحبة × عدد الحبات).'
                  : 'Prix unitaire de base par niveau. Le prix carton est calculé instantanément selon le colisage.'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-3 text-start">SKU</th>
                    <th className="py-3 px-3 text-start">{t.cart.productHeader}</th>
                    <th className="py-3 px-3 text-start">{t.product.unitsPerCarton}</th>
                    <th className="py-3 px-3 text-start bg-emerald-50/50">
                      {language === 'ar' ? 'سعر الحبة GROS' : 'Unité GROS'}
                    </th>
                    <th className="py-3 px-3 text-start bg-amber-50/50">
                      {language === 'ar' ? 'سعر الحبة DEMI' : 'Unité DEMI'}
                    </th>
                    <th className="py-3 px-3 text-start bg-stone-100/50">
                      {language === 'ar' ? 'سعر الحبة DETAIL' : 'Unité DETAIL'}
                    </th>
                    <th className="py-3 px-3 text-start">{language === 'ar' ? 'تعديل سعر الحبة' : 'Modifier'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {productsList
                    .filter((p) => !p.product.isDeleted)
                    .map(({ product, prices }) => {
                    const currentPrices = productPricesMap[product.id] || prices;
                    return (
                      <tr key={product.id} className="hover:bg-stone-50/60">
                        <td className="py-3 px-3 font-mono font-bold text-stone-900">{product.sku}</td>
                        <td className="py-3 px-3 font-medium">
                          {language === 'ar' ? product.nameAr : product.nameFr}
                        </td>
                        <td className="py-3 px-3 text-stone-500">{product.unitsPerCarton} UNIT</td>
                        <td className="py-3 px-3 bg-emerald-50/40">
                          <strong className="text-emerald-900 block text-sm">
                            {currentPrices.grosUnitPrice} {t.common.currency} / حبة
                          </strong>
                          <span className="text-[10px] text-stone-400">
                            الكرتون: {currentPrices.grosCartonPrice} {t.common.currency}
                          </span>
                        </td>
                        <td className="py-3 px-3 bg-amber-50/40">
                          <strong className="text-amber-900 block text-sm">
                            {currentPrices.demiGrosUnitPrice} {t.common.currency} / حبة
                          </strong>
                          <span className="text-[10px] text-stone-400">
                            الكرتون: {currentPrices.demiGrosCartonPrice} {t.common.currency}
                          </span>
                        </td>
                        <td className="py-3 px-3 bg-stone-100/40">
                          <strong className="text-stone-900 block text-sm">
                            {currentPrices.detailUnitPrice} {t.common.currency} / حبة
                          </strong>
                          <span className="text-[10px] text-stone-400">
                            الكرتون: {currentPrices.detailCartonPrice} {t.common.currency}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => {
                              const newGros = prompt(
                                `أدخل سعر الحبة الجديد للجملة (GROS) لمنتج ${product.nameAr}:`,
                                currentPrices.grosUnitPrice.toString()
                              );
                              if (newGros && !isNaN(parseFloat(newGros))) {
                                handleUpdateProductBasePrice(
                                  product.id,
                                  'gros',
                                  parseFloat(newGros),
                                  product.unitsPerCarton
                                );
                              }
                            }}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-2 py-1 rounded text-[10px] font-semibold transition"
                          >
                            تعديل السعر
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS, INVOICES & DELIVERY SLIPS */}
      {activeTab === 'orders' && (
        <OrderManagementTab
          orders={ordersList}
          productsList={productsList}
          onRefresh={refreshOrders}
          language={language}
          currency={t.common.currency}
        />
      )}

      {/* TAB 5: COMMERCIALS (PHASE 4 CORE FOCUS) */}
      {activeTab === 'commercials' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-stone-900 text-base">
                {language === 'ar' ? 'إدارة المندوبين التجاريين وأكواد التوزيع' : 'Gestion des Commerciaux & Codes de Suivi'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ar'
                  ? 'كل مندوب يمتلك كوداً فريداً (D01, D02...). يتم ربط الزبون به عند التسجيل لحساب عمولات ومبيعات المندوب.'
                  : 'Codes commerciaux permanents liés aux comptes commerçants lors de l’inscription.'}
              </p>
            </div>

            <button
              onClick={() => setShowAddCommModal(true)}
              className="bg-[#0F392B] hover:bg-emerald-950 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إضافة مندوب جديد' : 'Ajouter un commercial'}</span>
            </button>
          </div>

          {commMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
              {commMsg}
            </div>
          )}

          {/* Add Commercial Form Modal */}
          {showAddCommModal && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
              <h3 className="font-bold text-stone-900 text-xs">
                {language === 'ar' ? 'تسجيل مندوب تجاري جديد' : 'Nouveau Commercial'}
              </h3>
              <form onSubmit={handleCreateCommercial} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {language === 'ar' ? 'الكود الفريد (D06...)' : 'Code unique'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="D06"
                    value={newCommCode}
                    onChange={(e) => setNewCommCode(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مصطفى بوجمعة"
                    value={newCommName}
                    onChange={(e) => setNewCommName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0550XX XX XX"
                    value={newCommPhone}
                    onChange={(e) => setNewCommPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="bg-[#0F392B] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-950 transition"
                  >
                    {language === 'ar' ? 'حفظ المندوب' : 'Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCommModal(false)}
                    className="bg-stone-200 text-stone-700 px-3 py-1.5 rounded text-xs"
                  >
                    {t.common.cancel}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Commercials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commercialsList.map((comm) => (
              <div
                key={comm.code}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono bg-[#0F392B] text-amber-300 font-black px-2.5 py-0.5 rounded text-sm">
                    {comm.code}
                  </span>
                  <button
                    onClick={() => handleToggleComm(comm.code)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded transition ${
                      comm.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {comm.active ? (language === 'ar' ? 'نشط' : 'Actif') : (language === 'ar' ? 'معطل' : 'Inactif')}
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{comm.fullName}</h4>
                  <div className="text-xs text-stone-500 font-mono">{comm.phone}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px]">
                      {language === 'ar' ? 'عدد الزبائن المرتبطين' : 'Clients liés'}
                    </span>
                    <strong className="text-stone-900 text-sm">{comm.stats.totalCustomers}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">
                      {language === 'ar' ? 'إجمالي المبيعات' : 'Ventes'}
                    </span>
                    <strong className="text-emerald-800 text-sm">
                      {comm.stats.totalSalesAmount.toLocaleString()} DA
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DELIVERY ZONES */}
      {activeTab === 'delivery' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
          <h2 className="font-bold text-stone-900 text-base">
            {language === 'ar' ? 'مناطق التوصيل ورسوم الشحن (58 ولاية)' : 'Zones de Livraison'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
            {ALGERIA_GEOGRAPHY.map((w) => (
              <div
                key={w.code}
                className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-stone-500 me-1.5">{w.code}</span>
                  <span className="font-bold text-stone-900">
                    {language === 'ar' ? w.nameAr : w.nameFr}
                  </span>
                </div>
                <div className="text-end">
                  <span className="font-bold text-[#0F392B] block">{w.deliveryFee} DA</span>
                  <span className="text-[10px] text-emerald-700">
                    {w.deliveryAvailable ? 'متاحة' : 'معطلة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
