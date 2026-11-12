import React, { useState } from 'react';
import {
  ShoppingBag,
  FileText,
  Truck,
  Edit3,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Check,
  PhoneCall,
  Printer,
  ChevronRight,
  Eye,
  Trash2,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { ProductWithPrices } from '../../data/sampleProducts';
import { updateOrderStatus, softDeleteOrder } from '../../services/orderService';
import { OrderInvoiceModal } from './OrderInvoiceModal';
import { OrderEditModal } from './OrderEditModal';

interface OrderManagementTabProps {
  orders: Order[];
  productsList: ProductWithPrices[];
  onRefresh: () => void;
  language: 'ar' | 'fr';
  currency: string;
}

export const OrderManagementTab: React.FC<OrderManagementTabProps> = ({
  orders,
  productsList,
  onRefresh,
  language,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Status changer handler
  const handleSetOrderStatus = (orderId: string, status: OrderStatus, label: string) => {
    const updated = updateOrderStatus(orderId, status);
    if (updated) {
      onRefresh();
      showToast(
        language === 'ar'
          ? `تم تحديث حالة الطلب ${updated.orderNumber} إلى "${label}" بنجاح!`
          : `Statut de la commande mis à jour vers "${status}"`
      );
    }
  };

  // Delete handler
  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (
      window.confirm(
        language === 'ar'
          ? `هل أنت متأكد من حذف الطلب رقم ${orderNumber}؟`
          : `Confirmer la suppression de la commande ${orderNumber} ?`
      )
    ) {
      softDeleteOrder(orderId);
      onRefresh();
      showToast(`تم حذف الطلب ${orderNumber} بنجاح`);
    }
  };

  // Filtered orders (exclude deleted)
  const filteredOrders = orders.filter((o) => {
    if (o.isDeleted) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    const term = searchQuery.toLowerCase().trim();
    if (term) {
      const matchNum = o.orderNumber.toLowerCase().includes(term);
      const matchName = o.customerInfo.fullName.toLowerCase().includes(term);
      const matchStore = o.customerInfo.storeName.toLowerCase().includes(term);
      const matchPhone = o.customerInfo.phone.includes(term);
      const matchWilaya =
        o.shippingAddress.wilayaName.ar.toLowerCase().includes(term) ||
        o.shippingAddress.wilayaName.fr.toLowerCase().includes(term) ||
        o.shippingAddress.wilayaCode.includes(term);
      const matchComm = o.commercialCode ? o.commercialCode.toLowerCase().includes(term) : false;
      if (!matchNum && !matchName && !matchStore && !matchPhone && !matchWilaya && !matchComm) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Order Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>SELSABIL ORDERS & INVOICING ENGINE</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {language === 'ar' ? 'إدارة الطلبات، الفواتير ووصولات التوصيل' : 'Commandes, Facturation & Bons de Livraison'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'ar'
                ? 'تأكيد الطلبات، وضعها قيد المراجعة، تعديل محتوى الوصل هاتفياً، وتوليد الفواتير الفرنسية الرسمية'
                : 'Confirmation, mise en révision, modification des articles à la volée et factures en français'}
            </p>
          </div>

          <div className="text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-bold">
            {language === 'ar'
              ? `إجمالي الطلبات: ${orders.filter((o) => !o.isDeleted).length}`
              : `Total commandes : ${orders.filter((o) => !o.isDeleted).length}`}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute top-2.5 start-3 text-stone-400" />
            <input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'ابحث برقم الطلب (SEL-...)، اسم الزبون، المحل، الهاتف، الولاية، أو المندوب...'
                  : 'Recherche par N° commande, client, magasin, téléphone, wilaya...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 ps-9 pe-3 text-xs text-stone-900 focus:outline-emerald-800"
            />
          </div>

          <div className="sm:col-span-2 flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'Tous les statuts'}</option>
              <option value="NOUVEAU">{language === 'ar' ? 'قيد المراجعة / جديد (NOUVEAU)' : 'En révision (NOUVEAU)'}</option>
              <option value="CONFIRME">{language === 'ar' ? 'مؤكد (CONFIRME)' : 'Confirmé (CONFIRME)'}</option>
              <option value="EXPEDIE">{language === 'ar' ? 'قيد الشحن (EXPEDIE)' : 'Expédié (EXPEDIE)'}</option>
              <option value="LIVRE">{language === 'ar' ? 'تم التسليم (LIVRE)' : 'Livré (LIVRE)'}</option>
              <option value="ANNULE">{language === 'ar' ? 'ملغى (ANNULE)' : 'Annulé (ANNULE)'}</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-xs text-start">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'رقم الطلب / التاريخ' : 'N° / Date'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'الزبون والمحل' : 'Client & Magasin'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'منطقة التوصيل' : 'Wilaya / Commune'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'السلع المطلوبة' : 'Articles'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'المبلغ الإجمالي (COD)' : 'Montant Total'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'الحالة الحالية' : 'Statut'}</th>
                <th className="py-3 px-3 text-center min-w-[210px]">
                  {language === 'ar' ? 'إجراءات الطلب والفاتورة' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    {language === 'ar' ? 'لا توجد طلبات مطابقة.' : 'Aucune commande trouvée.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalCartons = order.items.reduce((s, i) => s + i.cartonsQuantity, 0);
                  const totalUnits = order.items.reduce((s, i) => s + i.unitsQuantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition">
                      {/* Order Number & Date */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-stone-900 text-xs">
                          {order.orderNumber}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 font-mono">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        {order.commercialCode && (
                          <span className="inline-block bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded text-[10px] font-mono mt-1">
                            مندوب: {order.commercialCode}
                          </span>
                        )}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900">
                          {order.customerInfo.storeName}
                        </div>
                        <div className="text-[11px] text-stone-600">
                          {order.customerInfo.fullName}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {order.customerInfo.phone} • {order.customerInfo.priceTier}
                        </div>
                      </td>

                      {/* Delivery Address */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-800">
                          {order.shippingAddress.wilayaName.ar} ({order.shippingAddress.wilayaCode})
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {order.shippingAddress.communeName.ar}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[150px]">
                          {order.shippingAddress.detailedAddress}
                        </div>
                      </td>

                      {/* Items snapshot */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900">
                          {order.items.length} {language === 'ar' ? 'سلع' : 'articles'}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {totalCartons} كرتون {totalUnits > 0 ? `+ ${totalUnits} حبة` : ''}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[140px]">
                          {order.items.map((i) => i.nameFr).join(', ')}
                        </div>
                      </td>

                      {/* Total Amount (COD) */}
                      <td className="py-3 px-3">
                        <div className="font-black text-[#0F392B] text-sm">
                          {order.totalAmount.toLocaleString()} {currency}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          شامل التوصيل ({order.deliveryFee} {currency})
                        </div>
                        <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded text-[10px] font-bold mt-0.5">
                          COD نقداً عند التسليم
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            order.status === 'CONFIRME'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : order.status === 'NOUVEAU'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : order.status === 'EXPEDIE'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : order.status === 'LIVRE'
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>
                            {order.status === 'NOUVEAU'
                              ? 'قيد المراجعة'
                              : order.status === 'CONFIRME'
                              ? 'مؤكد'
                              : order.status === 'EXPEDIE'
                              ? 'قيد الشحن'
                              : order.status === 'LIVRE'
                              ? 'تم التسليم'
                              : 'ملغى'}
                          </span>
                        </span>
                      </td>

                      {/* ACTIONS: EDIT, CONFIRM, IN REVIEW, INVOICE */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {/* 1. EDIT BUTTON: Customer calls to add or modify items */}
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold flex items-center gap-1 transition"
                            title="تعديل سلع الطلب في حال اتصال الزبون لإضافة سلع جديدة"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>تعديل السلع</span>
                          </button>

                          {/* 2. CONFIRM BUTTON */}
                          {order.status !== 'CONFIRME' && (
                            <button
                              onClick={() => handleSetOrderStatus(order.id, 'CONFIRME', 'مؤكد')}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs"
                              title="تأكيد الطلب واعتماده للشحن"
                            >
                              <Check className="w-3 h-3" />
                              <span>تأكيد</span>
                            </button>
                          )}

                          {/* 3. IN REVIEW BUTTON (قيد المراجعة) */}
                          {order.status !== 'NOUVEAU' && (
                            <button
                              onClick={() => handleSetOrderStatus(order.id, 'NOUVEAU', 'قيد المراجعة')}
                              className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition"
                              title="وضع الطلب في حالة قيد المراجعة"
                            >
                              <Clock className="w-3 h-3" />
                              <span>قيد المراجعة</span>
                            </button>
                          )}

                          {/* 4. FRENCH INVOICE & BL BUTTON */}
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-2.5 py-1 rounded-md bg-[#0F392B] hover:bg-[#16543F] text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs"
                            title="عرض وطباعة الفاتورة ووصل التوصيل بالفرنسية الكاملة"
                          >
                            <FileText className="w-3 h-3 text-amber-300" />
                            <span>الفاتورة و BL</span>
                          </button>

                          {/* 5. DELETE BUTTON */}
                          <button
                            onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                            className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: FRENCH INVOICE & DELIVERY SLIP MODAL */}
      {selectedInvoiceOrder && (
        <OrderInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* MODAL 2: ORDER EDIT MODAL (CUSTOMER CALLED TO ADD/CHANGE PRODUCTS) */}
      {editingOrder && (
        <OrderEditModal
          order={editingOrder}
          productsList={productsList}
          onClose={() => setEditingOrder(null)}
          onSaved={() => {
            onRefresh();
            showToast('تم حفظ التعديلات على سلع الطلب وتحديث الفاتورة بنجاح!');
          }}
          language={language}
          currency={currency}
        />
      )}
    </div>
  );
};
