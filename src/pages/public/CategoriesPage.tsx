import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers, Package, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';

export const CategoriesPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    {
      id: 'cat-alimentaire',
      nameAr: 'المواد الغذائية الأساسية والزيوت',
      nameFr: 'Alimentaire & Huiles de Table',
      descriptionAr: 'زيوت الطبخ المائدة، السكر، البقوليات، والدقيق بعبوات الكرتون والجملة.',
      descriptionFr: 'Huiles raffinées, farines, sucres et denrées de première nécessité.',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
      count: SAMPLE_PRODUCTS.filter((p) => p.product.categoryId === 'cat-alimentaire').length,
    },
    {
      id: 'cat-conserves',
      nameAr: 'المعلبات والمصبرات الجزائرية',
      nameFr: 'Conserves & Tomates Concentrées',
      descriptionAr: 'طماطم مصبرة، تونة، مصبرات الخضر والفواكه بأعلى معايير الجودة والتغليف.',
      descriptionFr: 'Concentrés de tomate algérienne, thon, conserves végétales certifiées.',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      count: SAMPLE_PRODUCTS.filter((p) => p.product.categoryId === 'cat-conserves').length,
    },
    {
      id: 'cat-boissons',
      nameAr: 'القهوة والمشروبات والعصائر',
      nameFr: 'Café & Boissons Chaudes / Fraîches',
      descriptionAr: 'بن محمص ممتاز، شاي، مياه معدنية وعصائر طبيعية لتجار التجزئة والجملة.',
      descriptionFr: 'Cafés moulus, thés et boissons destinées à la distribution commerciale.',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
      count: SAMPLE_PRODUCTS.filter((p) => p.product.categoryId === 'cat-boissons').length,
    },
    {
      id: 'cat-entretien',
      nameAr: 'مواد التنظيف والغسيل ومساحيق العناية',
      nameFr: 'Entretien & Produits de Nettoyage',
      descriptionAr: 'مساحيق غسيل الملابس، سوائل تنظيف الأواني والمعقمات بأسعار تجارية منافسة.',
      descriptionFr: 'Lessives, détergents professionnels et produits d’hygiène en vrac et colis.',
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80',
      count: SAMPLE_PRODUCTS.filter((p) => p.product.categoryId === 'cat-entretien').length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>SELSABIL CATEGORIES</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          {language === 'ar' ? 'تصنيفات منتجات سلسبيل' : 'Catégories de Produits'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {language === 'ar'
            ? 'تصفح الأصناف التجارية المتاحة للبيع بالجملة ونصف الجملة والتجزئة'
            : 'Explorez notre gamme complète organisée par secteurs d’activité'}
        </p>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition duration-300 flex flex-col sm:flex-row"
          >
            <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0 relative bg-stone-100">
              <img
                src={cat.image}
                alt={language === 'ar' ? cat.nameAr : cat.nameFr}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 start-3 bg-[#0F392B] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {cat.count} {language === 'ar' ? 'منتج' : 'produits'}
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition">
                  {language === 'ar' ? cat.nameAr : cat.nameFr}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {language === 'ar' ? cat.descriptionAr : cat.descriptionFr}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 pt-2 border-t border-stone-100">
                <span>{language === 'ar' ? 'استعراض المنتجات والكراتين' : 'Voir les produits'}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
