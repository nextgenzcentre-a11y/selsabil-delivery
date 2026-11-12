import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Box,
  Package,
  PhoneCall,
  Save,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Order, OrderItemSnapshot } from '../../types';
import { ProductWithPrices } from '../../data/sampleProducts';
import { getAuthorizedPriceForProduct } from '../../services/pricingService';
import { editOrderItems } from '../../services/orderService';

interface OrderEditModalProps {
  order: Order | null;
  productsList: ProductWithPrices[];
  onClose: () => void;
  onSaved: () => void;
  language: 'ar' | 'fr';
  currency: string;
}

export const OrderEditModal: React.FC<OrderEditModalProps> = ({
  order,
  productsList,
  onClose,
  onSaved,
  language,
  currency,
}) => {
  if (!order) return null;

  // Local editable items list initialized from order
  const [items, setItems] = useState<OrderItemSnapshot[]>(() => [...order.items]);
  const [deliveryFee, setDeliveryFee] = useState<number>(order.deliveryFee);
  const [editReason, setEditReason] = useState<string>(
    'اتصال هاتفي من الزبون لتعديل سلع الوصل'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New item to append state
  const [selectedProdId, setSelectedProdId] = useState<string>('');
  const [addCartons, setAddCartons] = useState<number>(1);
  const [addUnits, setAddUnits] = useState<number>(0);

  // Calculate live subtotal & grand total
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const grandTotal = subtotal + deliveryFee;

  // Handle changing quantity on existing item
  const handleQuantityChange = (
    index: number,
    field: 'cartons' | 'units',
    value: number
  ) => {
    const updated = [...items];
    const item = { ...updated[index] };
    const validVal = Math.max(0, value || 0);

    if (field === 'cartons') {
      item.cartonsQuantity = validVal;
    } else {
      item.unitsQuantity = validVal;
    }

    item.totalUnits = item.cartonsQuantity * item.unitsPerCarton + item.unitsQuantity;
    item.lineTotal =
      item.cartonsQuantity * item.cartonPriceApplied +
      item.unitsQuantity * item.unitPriceApplied;

    updated[index] = item;
    setItems(updated);
  };

  // Remove item from order
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      setErrorMessage('لا يمكن حذف جميع السلع، يجب أن يحتوي الطلب على سلعة واحدة على الأقل');
      return;
    }
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
    setErrorMessage(null);
  };

  // Append new item to order
  const handleAddNewItemToOrder = () => {
    if (!selectedProdId) {
      setErrorMessage('يرجى اختيار سلعة لإضافتها إلى الوصل');
      return;
    }
    if (addCartons <= 0 && addUnits <= 0) {
      setErrorMessage('يرجى تحديد كمية صالحة (كرتون أو حبة)');
      return;
    }

    const prodItem = productsList.find((p) => p.product.id === selectedProdId);
    if (!prodItem) return;

    const { product, prices } = prodItem;

    // Check if already in order
    const existingIdx = items.findIndex((i) => i.productId === product.id);
    if (existingIdx > -1) {
      // Add quantities to existing line
      const updated = [...items];
      const item = { ...updated[existingIdx] };
      item.cartonsQuantity += addCartons;
      item.unitsQuantity += addUnits;
      item.totalUnits = item.cartonsQuantity * item.unitsPerCarton + item.unitsQuantity;
      item.lineTotal =
        item.cartonsQuantity * item.cartonPriceApplied +
        item.unitsQuantity * item.unitPriceApplied;
      updated[existingIdx] = item;
      setItems(updated);
    } else {
      // Determine price according to customer tier
      let unitPrice = prices.detailUnitPrice;
      let cartonPrice = prices.detailCartonPrice;

      if (order.customerInfo.priceTier === 'GROS') {
        unitPrice = prices.grosUnitPrice;
        cartonPrice = prices.grosCartonPrice;
      } else if (order.customerInfo.priceTier === 'DEMI_GROS') {
        unitPrice = prices.demiGrosUnitPrice;
        cartonPrice = prices.demiGrosCartonPrice;
      }

      const totalUnits = addCartons * product.unitsPerCarton + addUnits;
      const lineTotal = addCartons * cartonPrice + addUnits * unitPrice;

      const newItem: OrderItemSnapshot = {
        productId: product.id,
        sku: product.sku,
        nameAr: product.nameAr,
        nameFr: product.nameFr,
        unitsPerCarton: product.unitsPerCarton,
        cartonsQuantity: addCartons,
        unitsQuantity: addUnits,
        totalUnits,
        cartonPriceApplied: cartonPrice,
        unitPriceApplied: unitPrice,
        priceSource: 'TIER',
        lineTotal,
      };

      setItems([...items, newItem]);
    }

    // Reset adder fields
    setSelectedProdId('');
    setAddCartons(1);
    setAddUnits(0);
    setErrorMessage(null);
  };

  // Submit and save
  const handleSaveOrderChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('يجب أن يحتوي الطلب على سلعة واحدة على الأقل');
      return;
    }

    editOrderItems(order.id, items, editReason);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-lg">
                {language === 'ar'
                  ? 'تعديل سلع الطلب والوصل (إضافة / زيادة كميات)'
                  : 'Modifier les Articles du Bon de Commande'}
              </h3>
              <p className="text-xs text-stone-500">
                طلب رقم : <strong className="font-mono text-stone-800">{order.orderNumber}</strong> •{' '}
                الزبون : <strong className="text-stone-800">{order.customerInfo.storeName}</strong> ({order.customerInfo.priceTier})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Existing Order Items List (Editable) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-stone-900">
              {language === 'ar' ? 'السلع الحالية في الوصل :' : 'Articles actuellement dans le bon :'}
            </span>
            <span className="text-stone-500 text-[11px]">
              {items.length} {language === 'ar' ? 'سلع في الوصل' : 'articles'}
            </span>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'السلعة / SKU' : 'Produit'}</th>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'التعبئة' : 'Colisage'}</th>
                  <th className="py-2.5 px-3 text-center w-28">{language === 'ar' ? 'الكراتين' : 'Cartons'}</th>
                  <th className="py-2.5 px-3 text-center w-28">{language === 'ar' ? 'الحبات' : 'Unités'}</th>
                  <th className="py-2.5 px-3 text-end">{language === 'ar' ? 'سعر الحبة' : 'Prix Unit.'}</th>
                  <th className="py-2.5 px-3 text-end">{language === 'ar' ? 'المجموع' : 'Total'}</th>
                  <th className="py-2.5 px-3 text-center w-12">{language === 'ar' ? 'حذف' : 'Suppr'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/60">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-stone-900">
                        {language === 'ar' ? item.nameAr : item.nameFr}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 font-semibold">
                        {item.sku} • {item.nameFr}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">
                      {item.unitsPerCarton} UNIT/Ctn
                    </td>

                    {/* Cartons Input */}
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Box className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <input
                          type="number"
                          min="0"
                          value={item.cartonsQuantity}
                          onChange={(e) =>
                            handleQuantityChange(idx, 'cartons', parseInt(e.target.value) || 0)
                          }
                          className="w-16 bg-stone-50 border border-stone-300 rounded p-1 text-center font-bold text-stone-900 text-xs focus:outline-emerald-800"
                        />
                      </div>
                    </td>

                    {/* Units Input */}
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Package className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <input
                          type="number"
                          min="0"
                          value={item.unitsQuantity}
                          onChange={(e) =>
                            handleQuantityChange(idx, 'units', parseInt(e.target.value) || 0)
                          }
                          className="w-16 bg-stone-50 border border-stone-300 rounded p-1 text-center font-bold text-stone-900 text-xs focus:outline-emerald-800"
                        />
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-end font-semibold text-stone-800 font-mono">
                      {item.unitPriceApplied} {currency}
                    </td>

                    <td className="py-2.5 px-3 text-end font-black text-[#0F392B] font-mono">
                      {item.lineTotal.toLocaleString()} {currency}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                        title="حذف السلعة من الوصل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: ADD NEW PRODUCT TO ORDER (زبون اتصل وقال زدني سلعة) */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
              +
            </div>
            <h4 className="font-bold text-emerald-950 text-xs">
              {language === 'ar'
                ? 'إضافة سلعة جديدة إلى الوصل (بناءً على طلب الزبون الهاتفي) :'
                : 'Ajouter un nouvel article au bon de commande :'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                اختر السلعة من الكتالوج :
              </label>
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-semibold focus:outline-emerald-800"
              >
                <option value="">-- اختر السلعة المراد إضافتها --</option>
                {productsList
                  .filter((p) => !p.product.isDeleted && p.product.status === 'active')
                  .map(({ product, prices }) => (
                    <option key={product.id} value={product.id}>
                      {product.sku} - {language === 'ar' ? product.nameAr : product.nameFr} (
                      {product.unitsPerCarton} حبة/كرتون)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                عدد الكراتين :
              </label>
              <input
                type="number"
                min="0"
                value={addCartons}
                onChange={(e) => setAddCartons(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold focus:outline-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                عدد الحبات :
              </label>
              <input
                type="number"
                min="0"
                value={addUnits}
                onChange={(e) => setAddUnits(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold focus:outline-emerald-800"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleAddNewItemToOrder}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>إدراج السلعة في الوصل وتحديث الفاتورة</span>
            </button>
          </div>
        </div>

        {/* Reason / Admin Modification Note */}
        <div>
          <label className="block font-bold text-stone-700 text-xs mb-1">
            سبب التعديل أو الملاحظة الإدارية :
          </label>
          <input
            type="text"
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            placeholder="مثال: الزبون اتصل هاتفياً وطلب إضافة 5 كراتين زيت وكرتونين طماطم..."
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-emerald-800"
          />
        </div>

        {/* Totals Summary */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-stone-600">
              المجموع الفرعي للسلع :{' '}
              <strong className="text-stone-900 font-mono text-sm">
                {subtotal.toLocaleString()} {currency}
              </strong>
            </div>
            <div className="text-stone-600">
              تكلفة التوصيل ({order.shippingAddress.wilayaName.ar}) :{' '}
              <strong className="text-stone-900 font-mono">
                {deliveryFee.toLocaleString()} {currency}
              </strong>
            </div>
          </div>

          <div className="text-end bg-[#0F392B] text-white p-3.5 rounded-xl shadow-xs">
            <div className="text-[11px] text-amber-300 font-semibold">
              إجمالي الوصل الجديد المطلوب تحصيله (COD) :
            </div>
            <div className="text-xl font-black">
              {grandTotal.toLocaleString()} {currency}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 text-xs"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSaveOrderChanges}
            className="flex items-center gap-2 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-lg text-xs shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات على الوصل وتوليد الفاتورة الجديدة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
