import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Share2,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getStoredProductsWithPrices } from '../../services/productService';
import { CartonUnitSelector } from '../../components/product/CartonUnitSelector';
import { getAuthorizedPriceForProduct } from '../../services/pricingService';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language, isRtl } = useLanguage();
  const { user, isApproved, priceTier, role } = useAuth();

  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ArrowForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  const storedList = getStoredProductsWithPrices();
  const item = storedList.find((p) => p.product.id === id) || storedList[0];
  const { product, prices } = item;

  const [selectedImage, setSelectedImage] = useState<string>(product.mainImage);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');

  // Additional mock gallery images based on product theme
  const galleryImages = [
    product.mainImage,
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  ];

  // Resolve authorized price using zero-leak pricing hierarchy
  const authPrice = getAuthorizedPriceForProduct(
    product.id,
    user,
    product.unitsPerCarton
  );
  const authorizedCartonPrice = authPrice.authorized ? authPrice.cartonPrice : undefined;
  const authorizedUnitPrice = authPrice.authorized ? authPrice.unitPrice : undefined;

  // Stock breakdown
  const availableCartons = Math.floor(product.totalUnitsInStock / product.unitsPerCarton);
  const availableUnits = product.totalUnitsInStock % product.unitsPerCarton;

  // Related products
  const relatedProducts = storedList
    .filter((p) => p.product.id !== product.id && !p.product.isDeleted && p.product.status === 'active')
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-emerald-800 transition">
          {t.nav.home}
        </Link>
        <span className="text-stone-300">/</span>
        <Link to="/shop" className="hover:text-emerald-800 transition">
          {t.nav.shop}
        </Link>
        <span className="text-stone-300">/</span>
        <span className="font-semibold text-stone-900 truncate max-w-xs">
          {language === 'ar' ? product.nameAr : product.nameFr}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        {/* Left column: Gallery & Visuals (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-stone-50 rounded-xl overflow-hidden border border-stone-200 relative">
            <img
              src={selectedImage}
              alt={language === 'ar' ? product.nameAr : product.nameFr}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 start-3">
              <span className="bg-[#0F392B] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                {product.unitsPerCarton} {t.product.unitsPerCarton}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === img
                    ? 'border-[#0F392B] scale-102 shadow-xs'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Details, Pricing & Carton/Unit Selector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            {/* SKU and Category Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded">
                  SKU: {product.sku}
                </span>
                <span className="text-xs bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded border border-amber-200">
                  {language === 'ar' ? 'منتج معتمد 100% أصلي' : 'Produit certifié 100% original'}
                </span>
              </div>

              {/* In stock badge */}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar' ? 'متوفر بالمستودع' : 'En stock'} (
                  {availableCartons} {t.product.cartons} + {availableUnits} {t.product.units})
                </span>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug">
              {language === 'ar' ? product.nameAr : product.nameFr}
            </h1>

            {/* Dual language subtitle */}
            <p className="text-xs sm:text-sm text-stone-500 italic">
              {language === 'ar' ? product.nameFr : product.nameAr}
            </p>

            {/* Price Preview Card */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-500 block mb-0.5">
                  {language === 'ar' ? 'التسعيرة المعتمدة لحسابك:' : 'Tarification de votre compte :'}
                </span>
                {authorizedUnitPrice ? (
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl font-black text-[#0F392B]">
                      {authorizedUnitPrice.toLocaleString()} {t.common.currency}
                    </span>
                    <span className="text-xs text-stone-600 font-bold">/ {t.product.unit} ({language === 'ar' ? 'سعر الحبة' : 'Prix Unitaire'})</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-sm font-semibold text-stone-600">
                      {authorizedCartonPrice?.toLocaleString()} {t.common.currency} / {t.product.carton} ({product.unitsPerCarton} {t.product.units})
                    </span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {role === 'visitor' ? t.tiers.loginToViewPrices : t.tiers.pendingNotice}
                    </span>
                  </div>
                )}
              </div>

              {priceTier && (
                <div className="bg-[#0F392B] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs">
                  {t.tiers[priceTier]}
                </div>
              )}
            </div>
          </div>

          {/* Carton & Unit Engine Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-800" />
              <span>{t.product.chooseQuantity}</span>
            </h3>
            <CartonUnitSelector
              product={product}
              authorizedCartonPrice={authorizedCartonPrice}
              authorizedUnitPrice={authorizedUnitPrice}
              priceTier={priceTier}
              onAdded={() => {}}
            />
          </div>

          {/* Quick trust guarantee items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{language === 'ar' ? 'توصيل عبر 58 ولاية' : 'Livraison 58 Wilayas'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{language === 'ar' ? 'دفع عند الاستلام 100%' : 'Paiement à la livraison'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{language === 'ar' ? 'بيع مجزأ أو بالكرتون' : 'Colis ou Unité'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Delivery */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'desc'
                ? 'border-[#0F392B] text-[#0F392B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'ar' ? 'الوصف والتفاصيل' : 'Description'}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'specs'
                ? 'border-[#0F392B] text-[#0F392B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'ar' ? 'المواصفات الفنية والتعبئة' : 'Conditionnement & Colisage'}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'delivery'
                ? 'border-[#0F392B] text-[#0F392B]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'ar' ? 'سياسة التوصيل والفواتير' : 'Livraison & Facturation FR'}
          </button>
        </div>

        {activeTab === 'desc' && (
          <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
            <div>
              <h4 className="font-bold text-stone-900 mb-1">
                {language === 'ar' ? 'الوصف بالعربية:' : 'Description en Arabe :'}
              </h4>
              <p>{product.descriptionAr}</p>
            </div>
            <div className="pt-2 border-t border-stone-100">
              <h4 className="font-bold text-stone-900 mb-1">
                {language === 'ar' ? 'الوصف بالفرنسية:' : 'Description en Français :'}
              </h4>
              <p>{product.descriptionFr}</p>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-stone-500 block mb-1">
                {language === 'ar' ? 'عدد الحبات في الكرتون' : 'Unités par Carton'}
              </span>
              <strong className="text-stone-900 text-sm">{product.unitsPerCarton} UNIT</strong>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-stone-500 block mb-1">
                {language === 'ar' ? 'وحدة التخزين الأساسية' : 'Unité de base en stock'}
              </span>
              <strong className="text-stone-900 text-sm">UNIT (الحبة)</strong>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-stone-500 block mb-1">
                {language === 'ar' ? 'رمز التخزين التعريفي' : 'Code SKU Unique'}
              </span>
              <strong className="text-stone-900 text-sm font-mono">{product.sku}</strong>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-stone-500 block mb-1">
                {language === 'ar' ? 'حالة التوفر' : 'Disponibilité'}
              </span>
              <strong className="text-emerald-700 text-sm">
                {product.status === 'active' ? t.status.active : product.status}
              </strong>
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
            <p>
              {language === 'ar'
                ? '• يتم شحن الطلبات بواسطة أسطول توزيع سلسبيل عبر جميع الولايات الجزائرية الـ 58 وفق تسعيرة التوصيل المحددة لكل منطقة.'
                : '• Les commandes sont expédiées par la flotte logistique de Selsabil à travers les 58 Wilayas d’Algérie selon le barème officiel.'}
            </p>
            <p className="font-semibold text-stone-900">
              {language === 'ar'
                ? '• ملاحظة هامة: الفواتير ووصولات التسليم تصدر باللغة الفرنسية فقط (Factures et Bons de livraison en Français uniquement).'
                : '• Note importante : Les Factures et Bons de livraison sont établis exclusivement en Français.'}
            </p>
            <p>
              {language === 'ar'
                ? '• الدفع يتم حصراً عند الاستلام (Paiement en espèces à la livraison COD).'
                : '• Le règlement s’effectue à la réception du colis en espèces.'}
            </p>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-900">
            {language === 'ar' ? 'منتجات أخرى قد تهم متجرك' : 'Produits Recommandés'}
          </h2>
          <Link
            to="/shop"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>{language === 'ar' ? 'عرض الكتالوج كاملاً' : 'Voir tout'}</span>
            <ArrowForwardIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map(({ product: p, prices: pr }) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="aspect-video rounded-lg bg-stone-100 overflow-hidden mb-3">
                <img
                  src={p.mainImage}
                  alt={language === 'ar' ? p.nameAr : p.nameFr}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-stone-400 font-semibold">{p.sku}</div>
                <h4 className="font-bold text-stone-900 text-sm line-clamp-1">
                  {language === 'ar' ? p.nameAr : p.nameFr}
                </h4>
                <div className="text-xs text-stone-500">
                  {p.unitsPerCarton} {t.product.unitsPerCarton}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-800">
                  {language === 'ar' ? 'كرتون / حبة' : 'Carton / Unité'}
                </span>
                <span className="text-stone-400 group-hover:text-emerald-800 transition flex items-center gap-0.5">
                  <span>{t.product.details}</span>
                  <ArrowForwardIcon className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
