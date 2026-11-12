import React, { useState } from 'react';
import { Plus, Minus, Package, Box, AlertCircle, ShoppingCart, Sparkles } from 'lucide-react';
import { Product, PriceTier } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface CartonUnitSelectorProps {
  product: Product;
  authorizedCartonPrice?: number;
  authorizedUnitPrice?: number;
  priceTier?: PriceTier | null;
  priceSource?: 'CUSTOM' | 'TIER' | 'NONE';
  onAdded?: () => void;
}

export const CartonUnitSelector: React.FC<CartonUnitSelectorProps> = ({
  product,
  authorizedCartonPrice,
  authorizedUnitPrice,
  priceTier,
  priceSource = 'TIER',
  onAdded,
}) => {
  const { t, language } = useLanguage();
  const { role, isApproved } = useAuth();
  const { addItem } = useCart();

  const [cartons, setCartons] = useState<number>(0);
  const [units, setUnits] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Calculate total units
  const totalUnits = cartons * product.unitsPerCarton + units;
  const isAvailable = product.totalUnitsInStock > 0 && product.status === 'active';
  const hasValidPrice = authorizedUnitPrice !== undefined && authorizedUnitPrice > 0;

  // Breakdown of available stock into Cartons + Units
  const availableCartons = Math.floor(product.totalUnitsInStock / product.unitsPerCarton);
  const availableUnits = product.totalUnitsInStock % product.unitsPerCarton;

  // Actual unit price & computed carton price
  const unitPrice = authorizedUnitPrice || 0;
  const cartonPrice = authorizedCartonPrice || unitPrice * product.unitsPerCarton;

  const handleCartonChange = (val: number) => {
    const nextVal = Math.max(0, val);
    const nextTotalUnits = nextVal * product.unitsPerCarton + units;
    if (nextTotalUnits > product.totalUnitsInStock) {
      setErrorMsg(
        language === 'ar'
          ? `الكمية الإجمالية (${nextTotalUnits} حبة) تتجاوز المخزون المتوفر (${product.totalUnitsInStock} حبة)`
          : `Quantité demandée (${nextTotalUnits} unités) supérieure au stock (${product.totalUnitsInStock})`
      );
    } else {
      setErrorMsg(null);
    }
    setCartons(nextVal);
  };

  const handleUnitsChange = (val: number) => {
    const nextVal = Math.max(0, val);
    const nextTotalUnits = cartons * product.unitsPerCarton + nextVal;
    if (nextTotalUnits > product.totalUnitsInStock) {
      setErrorMsg(
        language === 'ar'
          ? `الكمية الإجمالية (${nextTotalUnits} حبة) تتجاوز المخزون المتوفر (${product.totalUnitsInStock} حبة)`
          : `Quantité demandée (${nextTotalUnits} unités) supérieure au stock (${product.totalUnitsInStock})`
      );
    } else {
      setErrorMsg(null);
    }
    setUnits(nextVal);
  };

  const handleAddToCart = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (totalUnits <= 0) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى تحديد عدد الكراتين أو الحبات المطلوبة للشراء'
          : 'Veuillez saisir un nombre de cartons ou d’unités'
      );
      return;
    }

    if (!hasValidPrice) {
      setErrorMsg(
        language === 'ar'
          ? 'الأسعار غير مصرح بها لحسابك حالياً'
          : 'Tarifs non autorisés pour votre compte'
      );
      return;
    }

    const res = addItem(
      product,
      cartons,
      units,
      cartonPrice,
      unitPrice,
      priceSource === 'CUSTOM' ? 'CUSTOM' : 'TIER'
    );

    if (res.success) {
      setSuccessMsg(
        language === 'ar'
          ? `تمت إضافة (${cartons} كرتون + ${units} حبة = ${totalUnits} حبة) إلى السلة بنجاح!`
          : `Ajouté au panier (${cartons} cartons + ${units} unités = ${totalUnits} unités) !`
      );
      setCartons(0);
      setUnits(0);
      if (onAdded) onAdded();
      setTimeout(() => setSuccessMsg(null), 3500);
    } else {
      setErrorMsg(res.error || 'حدث خطأ أثناء الإضافة');
    }
  };

  // Line total calculation based on UNIT price
  const lineTotal = hasValidPrice ? totalUnits * unitPrice : 0;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm space-y-3">
      {/* Primary Focus: UNIT PRICE (سعر الحبة الأساسي) */}
      <div className="bg-white p-3 rounded-lg border border-emerald-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">
              {language === 'ar' ? 'سعر الحبة المعتمد (Prix Unitaire):' : 'Prix Unitaire Appliqué :'}
            </span>
            {priceSource === 'CUSTOM' && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>{language === 'ar' ? 'سعر مخصص لك' : 'Tarif personnalisé'}</span>
              </span>
            )}
          </div>

          {hasValidPrice ? (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-[#0F392B]">
                {unitPrice.toLocaleString()} {t.common.currency}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ {t.product.unit}</span>
              <span className="text-stone-300">|</span>
              <span className="text-xs text-stone-500">
                {cartonPrice.toLocaleString()} {t.common.currency} / {t.product.carton} ({product.unitsPerCarton} {t.product.units})
              </span>
            </div>
          ) : (
            <div className="text-xs text-amber-800 font-semibold mt-1">
              {role === 'visitor' ? t.tiers.loginToViewPrices : t.tiers.pendingNotice}
            </div>
          )}
        </div>

        {/* Stock in Cartons + Units */}
        <div className="text-end">
          <span className="text-[11px] text-stone-500 block">{t.product.stockAvailable}</span>
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200 inline-block">
            {availableCartons} {t.product.cartons} + {availableUnits} {t.product.units}
          </span>
        </div>
      </div>

      {/* Cartons and Units Selector Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Cartons selector */}
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
              <Box className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.product.carton}</span>
            </span>
            <span className="text-[11px] text-stone-500">
              {product.unitsPerCarton} {t.product.unitsPerCarton}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleCartonChange(cartons - 1)}
              disabled={cartons <= 0}
              className="w-8 h-8 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-700 transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="0"
              value={cartons}
              onChange={(e) => handleCartonChange(parseInt(e.target.value) || 0)}
              className="w-14 text-center font-bold text-stone-900 focus:outline-emerald-600 border-b border-stone-300 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => handleCartonChange(cartons + 1)}
              disabled={!isAvailable}
              className="w-8 h-8 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-stone-500 text-center mt-1.5 font-medium">
            = {cartons * product.unitsPerCarton} {t.product.units}
          </div>
        </div>

        {/* Units selector */}
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
              <Package className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.product.unit} ({language === 'ar' ? 'بالحبة' : 'Unité'})</span>
            </span>
            <span className="text-[11px] text-stone-500">
              {language === 'ar' ? 'مفرد' : 'Vrac'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleUnitsChange(units - 1)}
              disabled={units <= 0}
              className="w-8 h-8 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-700 transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="0"
              value={units}
              onChange={(e) => handleUnitsChange(parseInt(e.target.value) || 0)}
              className="w-14 text-center font-bold text-stone-900 focus:outline-emerald-600 border-b border-stone-300 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => handleUnitsChange(units + 1)}
              disabled={!isAvailable}
              className="w-8 h-8 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-stone-500 text-center mt-1.5 font-medium">
            {hasValidPrice ? `${unitPrice} ${t.common.currency} / ${t.product.unit}` : '—'}
          </div>
        </div>
      </div>

      {/* Real-time Calculation Summary based on UNIT price */}
      <div className="bg-stone-100 rounded-lg p-2.5 flex items-center justify-between text-xs">
        <span className="text-stone-600">
          {t.product.totalUnitsRequested}{' '}
          <strong className="text-stone-900">{totalUnits}</strong> {t.product.units}
          {totalUnits > 0 && hasValidPrice && (
            <span className="text-stone-500 ms-1">
              (× {unitPrice} {t.common.currency})
            </span>
          )}
        </span>
        {hasValidPrice ? (
          <span className="font-extrabold text-[#0F392B] text-base">
            {lineTotal.toLocaleString()} {t.common.currency}
          </span>
        ) : (
          <span className="text-amber-800 text-[11px] font-medium">
            {role === 'visitor' ? t.tiers.loginToViewPrices : t.tiers.pendingNotice}
          </span>
        )}
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="text-xs bg-red-50 text-red-700 p-2.5 rounded-lg flex items-center gap-1.5 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg font-medium border border-emerald-200">
          {successMsg}
        </div>
      )}

      {/* Add to Cart button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!isAvailable || !hasValidPrice}
        className="w-full bg-[#0F392B] hover:bg-[#134937] text-white py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
      >
        <ShoppingCart className="w-4 h-4 text-amber-300" />
        <span>{t.product.addToCart}</span>
      </button>
    </div>
  );
};
