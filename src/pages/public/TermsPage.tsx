import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const TermsPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2 pb-6 border-b border-stone-200">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-2">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          {language === 'ar' ? 'الشروط والأحكام العامة للتعامل التجاري' : 'Conditions Générales de Vente (CGV)'}
        </h1>
        <p className="text-xs text-stone-500">SELSABIL DELIVERY — Algérie (B2B & B2C)</p>
      </div>

      <div className="border border-amber-300 bg-amber-50 p-4 rounded-xl text-sm text-amber-950 font-semibold" role="alert">
        {language === 'ar'
          ? 'تنبيه: هذا نموذج تجريبي، ولا يتم إنشاء طلبات حقيقية أو فواتير رسمية. البنود التالية أمثلة على السياسة المقترحة وليست شروط بيع نافذة.'
          : 'Attention : démonstration sans vente, commande réelle ni facture officielle. Les clauses ci-dessous sont des exemples à valider avant toute exploitation commerciale.'}
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6 text-xs text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'ar' ? '1. نطاق التطبيق والبيع بالكرتون والحبة' : '1. Champ d’application et Vente Carton/Unité'}
          </h2>
          <p>
            {language === 'ar'
              ? 'تحدد هذه الشروط القواعد المنظمة لعمليات البيع والتوزيع المبرمة عبر منصة SELSABIL DELIVERY داخل التراب الجزائري. تدعم المنصة البيع بوحدتين: الكرتون (Carton) والحبة (Unit). يتم حساب الرصيد المخزني والكميات بالحبة لضمان دقة العمليات المحاسبية ومنع نفاد المخزون.'
              : 'Les présentes conditions régissent les ventes B2B et B2C conclues sur la plateforme SELSABIL DELIVERY en Algérie. Les commandes peuvent être passées au colis (carton) et/ou à l’unité.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'ar' ? '2. نظام الفئات والتسعير التجاري' : '2. Tarification par Niveau (Gros, Demi-Gros, Détail)'}
          </h2>
          <p>
            {language === 'ar'
              ? 'توضح النسخة التجريبية فئات التسعير بالجملة ونصف الجملة والتجزئة لأغراض العرض فقط. يتم حفظ الأسعار محلياً ولا توجد مصادقة فعلية أو تحقق من الأسعار عبر الخادم بعد.'
              : 'Les tarifs de gros, demi-gros et détail sont simulés localement. Aucun serveur ne vérifie actuellement les prix ou les autorisations.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'ar' ? '3. الفواتير وسندات التسليم (اللغة الفرنسية الإلزامية)' : '3. Facturation et Bons de Livraison en Français'}
          </h2>
          <p className="font-semibold text-emerald-950 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            {language === 'ar'
              ? 'تلتزم سلسبيل للتوصيل بأن جميع الفواتير الرسمية (Factures) ووصولات التسليم والتسليم (Bons de livraison) تصدر حصرياً باللغة الفرنسية وتتضمن كافة التفاصيل القانونية والكميات بالكرتون والحبة، بصرف النظر عن لغة واجهة المستخدم.'
              : 'Toutes les factures commerciales et les bons de livraison sont édités exclusivement en langue française avec détail précis en cartons et unités.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'ar' ? '4. التوصيل والدفع عند الاستلام (COD)' : '4. Livraison et Paiement (Cash on Delivery)'}
          </h2>
          <p>
            {language === 'ar'
              ? 'يتم الدفع نقداً عند استلام البضاعة (Paiement à la livraison). يلتزم الزبون بمعاينة البضاعة ومطابقة عدد الكراتين والحبات مع سند التسليم قبل تسليم المبلغ لمندوب التوصيل.'
              : 'Le règlement s’effectue en espèces à la livraison. Le client est tenu de vérifier la conformité du colis avant paiement.'}
          </p>
        </section>
      </div>
    </div>
  );
};
