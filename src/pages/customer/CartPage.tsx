import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Truck, AlertCircle, Box, Package } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user, isApproved } = useAuth();
  const {
    items,
    updateItemQuantity,
    removeItem,
    clearCart,
    itemsSubtotal,
    totalCartonsCount,
    totalUnitsCount,
    itemsCount,
  } = useCart();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const estimatedDeliveryFee = user?.wilayaCode ? 400 : 500; // estimated standard delivery
  const grandTotal = itemsSubtotal + (itemsCount > 0 ? estimatedDeliveryFee : 0);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-800">{t.cart.empty}</h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          {language === 'ar'
            ? 'تصفح قائمة منتجاتنا بالجملة ونصف الجملة والتجزئة وأضف الكميات المناسبة بالكرتون والحبة.'
            : 'Consultez notre catalogue et commandez en colis complets ou à l’unité.'}
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#0F392B] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-950 transition"
          >
            <span>{t.cart.startShopping}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">{t.cart.title}</h1>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'ar'
              ? `${itemsCount} منتج • إجمالي ${totalCartonsCount} كرتون و ${totalUnitsCount} حبة`
              : `${itemsCount} articles • Total ${totalCartonsCount} cartons et ${totalUnitsCount} unités`}
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'إفراغ السلة' : 'Vider le panier'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
            >
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                  <img
                    src={item.product.mainImage}
                    alt={language === 'ar' ? item.product.nameAr : item.product.nameFr}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-stone-400 font-semibold">
                    {item.product.sku}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    {language === 'ar' ? item.product.nameAr : item.product.nameFr}
                  </h3>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {item.cartonsQuantity} {t.product.cartons} ({item.appliedCartonPrice} {t.common.currency}) +{' '}
                    {item.unitsQuantity} {t.product.units} ({item.appliedUnitPrice} {t.common.currency})
                  </div>
                </div>
              </div>

              {/* Quantity inputs and removal */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 px-2 py-1 rounded">
                    <Box className="w-3 h-3 text-emerald-800" />
                    <span className="font-bold text-stone-800">{item.cartonsQuantity}</span>
                    <span className="text-[10px] text-stone-500">{t.product.carton}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 px-2 py-1 rounded">
                    <Package className="w-3 h-3 text-emerald-800" />
                    <span className="font-bold text-stone-800">{item.unitsQuantity}</span>
                    <span className="text-[10px] text-stone-500">{t.product.unit}</span>
                  </div>
                </div>

                <div className="text-end">
                  <div className="font-extrabold text-[#0F392B] text-sm">
                    {item.lineTotal.toLocaleString()} {t.common.currency}
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-stone-400 hover:text-red-600 text-xs mt-1 transition"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs h-fit space-y-4">
          <h2 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
            {t.cart.summary}
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>{t.cart.subtotal}</span>
              <span className="font-semibold text-stone-900">
                {itemsSubtotal.toLocaleString()} {t.common.currency}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.cart.deliveryFee}</span>
              </span>
              <span className="font-semibold text-stone-900">
                {estimatedDeliveryFee.toLocaleString()} {t.common.currency}
              </span>
            </div>
            <div className="border-t border-stone-100 pt-3 flex justify-between text-sm font-black text-[#0F392B]">
              <span>{t.cart.totalToPay}</span>
              <span>
                {grandTotal.toLocaleString()} {t.common.currency}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 leading-relaxed">
            {t.cart.paymentMethodNotice}
          </div>

          <Link
            to="/checkout"
            className="w-full bg-[#0F392B] hover:bg-emerald-950 text-white font-bold py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <span>{t.cart.checkoutBtn}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
