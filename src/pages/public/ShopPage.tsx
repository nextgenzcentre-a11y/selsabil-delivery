import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Box, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getStoredProductsWithPrices } from '../../services/productService';
import { CartonUnitSelector } from '../../components/product/CartonUnitSelector';
import { getAuthorizedPriceForProduct } from '../../services/pricingService';

export const ShopPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user, isApproved, priceTier, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', nameAr: 'جميع المنتجات', nameFr: 'Tous les produits' },
    { id: 'cat-alimentaire', nameAr: 'مواد غذائية وزيوت', nameFr: 'Alimentaire & Huiles' },
    { id: 'cat-conserves', nameAr: 'معلبات ومصبرات', nameFr: 'Conserves & Tomates' },
    { id: 'cat-boissons', nameAr: 'قهوة ومشروبات وبسكويت', nameFr: 'Café & Biscuits' },
    { id: 'cat-entretien', nameAr: 'مواد تنظيف وصابون', nameFr: 'Entretien & Savons' },
  ];

  const allProducts = getStoredProductsWithPrices();

  const filteredProducts = allProducts.filter(({ product }) => {
    // Hide deleted products
    if (product.isDeleted) return false;
    // Hide inactive products for customers/visitors
    if (role !== 'admin' && product.status === 'inactive') return false;

    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.nameAr.toLowerCase().includes(term) ||
      product.nameFr.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {language === 'ar' ? 'كتالوج المنتجات والمخزون' : 'Catalogue des Produits'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'ar'
              ? 'الأسعار المعروضة هي سعر الحبة (Prix Unitaire) مع إمكانية الشراء بالكرتون والحبة'
              : 'Tarifs affichés à l’unité (Prix unitaire) avec commande en carton ou vrac'}
          </p>
        </div>

        {/* Current price tier info pill */}
        <div className="bg-stone-100 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-stone-200">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>
            {isApproved && priceTier
              ? t.tiers[priceTier]
              : role === 'visitor'
              ? t.tiers.loginToViewPrices
              : t.tiers.pendingNotice}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute top-3 start-3 text-stone-400" />
          <input
            type="text"
            placeholder={t.product.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg py-2.5 ps-9 pe-4 text-xs text-stone-900 focus:outline-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-[#0F392B] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {language === 'ar' ? cat.nameAr : cat.nameFr}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 text-sm">
          {t.product.noProductsFound}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProducts.map(({ product }) => {
            const authPrice = getAuthorizedPriceForProduct(
              product.id,
              user,
              product.unitsPerCarton
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full sm:w-40 h-40 rounded-lg bg-stone-100 overflow-hidden shrink-0 group relative block"
                  >
                    <img
                      src={product.mainImage}
                      alt={language === 'ar' ? product.nameAr : product.nameFr}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute bottom-2 start-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {product.unitsPerCarton} {t.product.unitsPerCarton}
                    </div>
                  </Link>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-stone-500 font-semibold">{product.sku}</span>
                      {authPrice.priceSource === 'CUSTOM' && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          <span>سعر مخصص</span>
                        </span>
                      )}
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-stone-900 text-base hover:text-emerald-800 transition">
                        {language === 'ar' ? product.nameAr : product.nameFr}
                      </h3>
                    </Link>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {language === 'ar' ? product.descriptionAr : product.descriptionFr}
                    </p>

                    {/* Unit Price Highlight */}
                    {authPrice.authorized && (
                      <div className="pt-1 flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#0F392B]">
                          {authPrice.unitPrice.toLocaleString()} {t.common.currency}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">/ {t.product.unit}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <CartonUnitSelector
                    product={product}
                    authorizedCartonPrice={authPrice.cartonPrice}
                    authorizedUnitPrice={authPrice.unitPrice}
                    priceTier={authPrice.priceTier}
                    priceSource={authPrice.priceSource}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
