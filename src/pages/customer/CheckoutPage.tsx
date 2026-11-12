import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Box,
  Package,
  Phone,
  MapPin,
  Store,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { AlgerianGeoSelect } from '../../components/common/AlgerianGeoSelect';
import { ALGERIA_GEOGRAPHY } from '../../data/algeriaGeography';
import { createNewOrder } from '../../services/orderService';
import { OrderItemSnapshot, PriceTier } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user, isApproved, priceTier } = useAuth();
  const {
    items,
    itemsSubtotal,
    totalCartonsCount,
    totalUnitsCount,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Form states initialized with customer's registered profile
  const [fullName, setFullName] = useState(
    user ? `${user.firstName} ${user.lastName}` : ''
  );
  const [phone, setPhone] = useState(user?.phone || '');
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [wilayaCode, setWilayaCode] = useState(user?.wilayaCode || '16');
  const [dairaName, setDairaName] = useState(user?.dairaName.ar || '');
  const [communeName, setCommuneName] = useState(user?.communeName.ar || '');
  const [address, setAddress] = useState(user?.address || '');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  // Delivery fee calculation based on Wilaya
  const selectedWilaya = ALGERIA_GEOGRAPHY.find((w) => w.code === wilayaCode);
  const deliveryFee = selectedWilaya?.deliveryFee || 500;
  const grandTotal = itemsSubtotal + deliveryFee;

  // Handle Order Submit
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const orderItems: OrderItemSnapshot[] = items.map((item) => ({
      productId: item.product.id,
      sku: item.product.sku,
      nameAr: item.product.nameAr,
      nameFr: item.product.nameFr,
      unitsPerCarton: item.product.unitsPerCarton,
      cartonsQuantity: item.cartonsQuantity,
      unitsQuantity: item.unitsQuantity,
      totalUnits: item.totalUnits,
      cartonPriceApplied: item.appliedCartonPrice,
      unitPriceApplied: item.appliedUnitPrice,
      priceSource: item.priceSource,
      lineTotal: item.lineTotal,
    }));

    const newOrder = createNewOrder({
      customerId: user?.uid || `guest-${Date.now()}`,
      customerInfo: {
        fullName: fullName.trim() || 'Client Selsabil',
        phone: phone.trim() || '0550000000',
        storeName: storeName.trim() || 'Magasin Client',
        priceTier: (priceTier as PriceTier) || 'DETAIL',
      },
      commercialId: user?.commercialId || 'comm-01',
      commercialCode: user?.commercialCode || 'D01',
      shippingAddress: {
        wilayaCode,
        wilayaName: {
          ar: selectedWilaya?.nameAr || 'الجزائر',
          fr: selectedWilaya?.nameFr || 'Alger',
        },
        dairaName: {
          ar: dairaName || 'الجزائر',
          fr: dairaName || 'Alger',
        },
        communeName: {
          ar: communeName || 'الجزائر الوسطى',
          fr: communeName || 'Alger Centre',
        },
        detailedAddress: address.trim() || 'عنوان المحل التجاري',
      },
      items: orderItems,
      subtotal: itemsSubtotal,
      deliveryFee,
      totalAmount: grandTotal,
      paymentMethod: 'COD',
      status: 'NOUVEAU',
      customerNotes: customerNotes.trim() || undefined,
      internalNotes: 'طلب جديد تم إنشاؤه عبر المتجر الإلكتروني',
    });

    clearCart();
    setIsSubmitting(false);
    setCreatedOrderNumber(newOrder.orderNumber);
  };

  // If order was successfully created
  if (createdOrderNumber) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {language === 'ar' ? 'تم تسجيل طلبكم بنجاح' : 'Commande enregistrée avec succès'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {language === 'ar' ? 'شكراً لتعاملكم مع سلسبيل للتوصيل' : 'Merci pour votre commande !'}
          </h1>
          <p className="text-xs text-stone-500 max-w-lg mx-auto">
            {language === 'ar'
              ? 'تم إرسال طلبكم إلى قسم التوزيع والمندوب التجاري. سيتم التواصل معكم هاتفياً لتأكيد انطلاق شاحنة التوصيل.'
              : 'Votre commande a été transmise à notre service commercial. Vous serez contacté par téléphone pour la livraison.'}
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-start max-w-md mx-auto space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500">رقم الطلب (N° Commande) :</span>
            <strong className="font-mono text-stone-900 font-bold">{createdOrderNumber}</strong>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500">المبلغ الإجمالي للدفع (COD) :</span>
            <strong className="text-emerald-900 font-black text-sm">
              {grandTotal.toLocaleString()} {t.common.currency}
            </strong>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500">طريقة الدفع :</span>
            <strong className="text-amber-900">نقداً عند الاستلام (Contre Remboursement)</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500">الولاية وجهة التوصيل :</span>
            <strong className="text-stone-800">{selectedWilaya?.nameAr} ({wilayaCode})</strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#0F392B] hover:bg-emerald-950 text-white font-bold text-xs rounded-lg transition"
          >
            {language === 'ar' ? 'العودة للمتجر والكتالوج' : 'Retour au magasin'}
          </Link>
          <Link
            to="/admin"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs rounded-lg transition"
          >
            {language === 'ar' ? 'عرض الفاتورة في لوحة الإدارة' : 'Voir dans le panneau admin'}
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-lg font-bold text-stone-800">
          {language === 'ar' ? 'السلة فارغة، لا يمكن إتمام الطلب' : 'Votre panier est vide'}
        </h2>
        <Link
          to="/shop"
          className="inline-block bg-[#0F392B] text-white px-5 py-2.5 rounded-lg text-xs font-bold"
        >
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          {language === 'ar' ? 'تأكيد الطلب ومعلومات التوصيل (COD)' : 'Validation de Commande'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {language === 'ar'
            ? 'الدفع نقداً عند استلام البضاعة من شاحنة التوزيع. الفواتير تصدر بالفرنسية الرسمية.'
            : 'Paiement en espèces à la livraison. Facturation certifiée en langue française.'}
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Customer & Delivery Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer / Store Details */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-800" />
              <span>{language === 'ar' ? 'بيانات التاجر والمحل' : 'Informations du Commerçant'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'اسم المحل التجاري / الشركة *' : 'Nom du Magasin *'}
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="مثال: سوبرماركت الوفاء"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'الاسم واللقب للمسؤول *' : 'Nom complet du contact *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: محمد بن عمر"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'رقم الهاتف للتنسيق والتسليم *' : 'Téléphone de livraison *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05 / 06 / 07..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-mono text-stone-900 focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'فئة السعر المطبقة' : 'Barème de Prix'}
                </label>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-bold text-xs">
                  {priceTier ? t.tiers[priceTier] : 'DETAIL (تجزئة)'}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Geography */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-800" />
              <span>{language === 'ar' ? 'عنوان وجهة التوصيل (58 ولاية)' : 'Adresse de Livraison'}</span>
            </h2>

            <AlgerianGeoSelect
              selectedWilayaCode={wilayaCode}
              selectedDairaName={dairaName}
              selectedCommuneName={communeName}
              onWilayaChange={(code) => setWilayaCode(code)}
              onDairaChange={(daira) => setDairaName(daira)}
              onCommuneChange={(commune) => setCommuneName(commune)}
            />

            <div className="text-xs">
              <label className="block font-semibold text-stone-700 mb-1">
                {language === 'ar' ? 'العنوان التفصيلي ومكان المستودع *' : 'Adresse détaillée du local *'}
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الشارع، الحي، رقم المحل، معالم قريبة لتسهيل وصول الشاحنة..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-stone-700 mb-1">
                {language === 'ar' ? 'ملاحظات إضافية للتوصيل (اختياري)' : 'Instructions de livraison'}
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="مثال: يرجى التوصيل في الفترة الصباحية..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Confirmation */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
              {language === 'ar' ? 'ملخص الوصل والسلع' : 'Récapitulatif de Commande'}
            </h2>

            <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-stone-100 text-xs">
              {items.map((item) => (
                <div key={item.product.id} className="pt-2 flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-stone-900">
                      {language === 'ar' ? item.product.nameAr : item.product.nameFr}
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium">
                      {item.cartonsQuantity} {t.product.cartons} + {item.unitsQuantity} {t.product.units}
                    </div>
                  </div>
                  <div className="font-black text-stone-900 shrink-0 font-mono">
                    {item.lineTotal.toLocaleString()} {t.common.currency}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>المجموع الفرعي للسلع :</span>
                <span className="font-semibold text-stone-900">
                  {itemsSubtotal.toLocaleString()} {t.common.currency}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>توصيل {selectedWilaya?.nameAr} :</span>
                </span>
                <span className="font-semibold text-stone-900">
                  {deliveryFee.toLocaleString()} {t.common.currency}
                </span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-black text-[#0F392B]">
                <span>المبلغ الإجمالي للدفع (COD) :</span>
                <span>
                  {grandTotal.toLocaleString()} {t.common.currency}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-950 font-bold space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>الدفع نقداً عند الاستلام (COD)</span>
              </div>
              <p className="text-[10px] text-amber-800 font-normal leading-relaxed">
                لا تدفع أي مبلغ مسبقاً. يتم الدفع نقداً لسائق التوزيع بعد استلام وتفقد الصناديق ووصول التوصيل.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0F392B] hover:bg-emerald-950 disabled:opacity-50 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>{isSubmitting ? 'جاري تسجيل الطلب...' : 'تأكيد الطلب وإصدار الوصل'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
