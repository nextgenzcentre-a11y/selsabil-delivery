import React from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Truck,
  ShieldCheck,
  Percent,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStatusChecker } from '../../components/common/DatabaseStatusChecker';
import { getStoredProductsWithPrices } from '../../services/productService';
import { CartonUnitSelector } from '../../components/product/CartonUnitSelector';
import { getAuthorizedPriceForProduct } from '../../services/pricingService';

export const HomePage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user, role, isApproved, priceTier } = useAuth();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#0F392B] text-white overflow-hidden py-16 lg:py-24 border-b-4 border-amber-400">
        <div className="absolute inset-0 bg-[radial-gradient(#16543F_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-amber-300 text-xs font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? 'منصة التجارة والتوزيع B2B / B2C عبر 58 ولاية'
                  : 'Plateforme E-commerce & Distribution B2B/B2C — 58 Wilayas'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {language === 'ar' ? (
                <>
                  منصتكم الأولى للبيع{' '}
                  <span className="text-amber-300 underline decoration-amber-500/50">
                    بالكرتون والحبة
                  </span>{' '}
                  في الجزائر
                </>
              ) : (
                <>
                  Votre plateforme B2B & B2C au{' '}
                  <span className="text-amber-300">Carton et à l’Unité</span> en Algérie
                </>
              )}
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              {language === 'ar'
                ? 'خدمات بيع وتوزيع مخصصة لتجار الجملة ونصف الجملة والتجزئة. أسعار تجارية حصرية، إدارة دقيقة للمخزون بالحبة والكرتون، وتوصيل موثوق مع الدفع عند الاستلام (COD).'
                : 'Solutions professionnelles pour grossistes, demi-grossistes et détaillants. Tarification par catégorie, gestion précise du stock par unité et carton, avec paiement sécurisé à la livraison.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold px-6 py-3 rounded-lg text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                <span>{language === 'ar' ? 'تصفح قائمة المنتجات' : 'Accéder au catalogue'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>

              {!isApproved && (
                <Link
                  to="/register"
                  className="bg-emerald-950/70 hover:bg-emerald-900 text-white border border-emerald-700 font-semibold px-6 py-3 rounded-lg text-sm transition"
                >
                  {language === 'ar' ? 'طلب فتح حساب تاجر' : 'Créer un compte pro'}
                </Link>
              )}
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="font-extrabold text-amber-300 text-lg">58</div>
                <div className="text-stone-300">{language === 'ar' ? 'ولاية مغطاة' : 'Wilayas'}</div>
              </div>
              <div>
                <div className="font-extrabold text-amber-300 text-lg">Carton & Unit</div>
                <div className="text-stone-300">{language === 'ar' ? 'بيع بالكرتون والحبة' : 'Double unité'}</div>
              </div>
              <div>
                <div className="font-extrabold text-amber-300 text-lg">Gros / Demi / Détail</div>
                <div className="text-stone-300">{language === 'ar' ? '3 فئات أسعار' : 'Grilles de prix'}</div>
              </div>
              <div>
                <div className="font-extrabold text-amber-300 text-lg">100% COD</div>
                <div className="text-stone-300">{language === 'ar' ? 'دفع عند الاستلام' : 'Paiement livraison'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database & System Verification (Phase 2 Diagnostic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DatabaseStatusChecker />
      </section>

      {/* Core Advantages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-stone-900">
            {language === 'ar' ? 'مزايا منصة سلسبيل للتوصيل' : 'Fonctionnalités Clés de la Plateforme'}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2">
            {language === 'ar'
              ? 'نظام تجاري مصمم هندسياً لتلبية احتياجات السوق الجزائري بأعلى معايير الأمان والدقة'
              : 'Une architecture pensée pour le marché algérien, alliant sécurité serveur et flexibilité'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'ar' ? 'البيع بالكرتون والحبة (Carton / Unit)' : 'Gestion Carton & Unité'}
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {language === 'ar'
                ? 'إمكانية طلب كراتين كاملة أو حبات منفردة أو الجمع بينهما في نفس الطلب، مع تخزين المخزون بالحبة (UNIT) كوحدة أساسية تضمن الحسابات الرياضية الدقيقة.'
                : 'Achetez en colis complets ou à l’unité. Le stock est géré à l’unité pour garantir zéro rupture et un calcul instantané.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'ar' ? 'أسعار تجارية محمية (3 فئات + سعر مخصص)' : 'Tarification Protégée B2B'}
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {language === 'ar'
                ? 'فئات مستقلة (جملة، نصف جملة، تجزئة) لا يمكن للزبون تغييرها بنفسه أو كشف أسعار الفئات الأخرى في المتصفح. مع إمكانية تحديد سعر خاص لكل زبون.'
                : 'Trois niveaux de prix (Gros, Demi-gros, Détail) et tarifs individualisés. Les prix sont sécurisés côté serveur sans fuite dans le navigateur.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'ar' ? 'توصيل عبر 58 ولاية وأكواد المندوبين' : 'Livraison 58 Wilayas & Commerciaux'}
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {language === 'ar'
                ? 'قاعدة بيانات جغرافية رسمية للولايات والدوائر والبلديات، مع ربط دائم للزبائن بأكواد مندوبي المبيعات (D01, D02) لحساب عمولاتهم وتقاريرهم بدقة.'
                : 'Structure géographique officielle (Wilayas/Daïras/Communes) et suivi des représentants commerciaux via codes uniques permanents.'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products with Carton & Unit Live Demo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              {language === 'ar' ? 'منتجات مميزة (عينة للتجربة الحية)' : 'Produits Disponibles (Démonstration)'}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              {language === 'ar'
                ? 'جرب الشراء بالكرتون أو الحبة وملاحظة الحساب التلقائي وفق فئة السعر المفعلة'
                : 'Testez la sélection carton/unité et observez le recalcul selon votre tarif autorisé'}
            </p>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>{language === 'ar' ? 'عرض كافة المنتجات' : 'Voir tout le catalogue'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {getStoredProductsWithPrices()
            .filter(({ product }) => !product.isDeleted && product.status === 'active')
            .slice(0, 4)
            .map(({ product }) => {
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
                    className="w-full sm:w-36 h-36 rounded-lg bg-stone-100 overflow-hidden shrink-0 group relative block"
                  >
                    <img
                      src={product.mainImage}
                      alt={language === 'ar' ? product.nameAr : product.nameFr}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </Link>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-stone-500 font-semibold">{product.sku}</span>
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {product.unitsPerCarton} {t.product.unitsPerCarton}
                      </span>
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-stone-900 text-base hover:text-emerald-800 transition">
                        {language === 'ar' ? product.nameAr : product.nameFr}
                      </h3>
                    </Link>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {language === 'ar' ? product.descriptionAr : product.descriptionFr}
                    </p>

                    {/* Unit Price Display */}
                    {authPrice.authorized && (
                      <div className="pt-1 flex items-baseline gap-1.5">
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
      </section>
    </div>
  );
};
