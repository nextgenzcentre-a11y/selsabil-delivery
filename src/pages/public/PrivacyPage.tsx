import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2 pb-6 border-b border-stone-200">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          {language === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Politique de Confidentialité'}
        </h1>
        <p className="text-xs text-stone-500">SELSABIL DELIVERY — Algérie</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6 text-xs text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'ar' ? '1. البيانات التي نجمعها' : '1. Collecte des données'}
          </h2>
          <p>
            {language === 'ar'
              ? 'عند استخدام النسخة التجريبية، تُحفظ البيانات التي تُدخلها في نماذج الحساب أو الطلبات داخل متصفحك المحلي فقط. لا تُستخدم لأغراض تشغيل تجاري، فلا تُدخل بيانات حقيقية أو حساسة.'
              : 'Dans cette démonstration, les informations saisies dans les formulaires de compte et de commande restent dans le stockage local de votre navigateur. Ne saisissez aucune donnée personnelle réelle ou sensible.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'ar' ? '2. سرية الأسعار والمعاملات' : '2. Confidentialité des Tarifs B2B'}
          </h2>
          <p>
            {language === 'ar'
              ? 'هذه نسخة تجريبية: الأسعار والبيانات التجريبية محفوظة داخل متصفحك فقط. لا توجد حماية لخدمات الإنتاج أو أسعار تجارية حقيقية في هذه النسخة.'
              : 'Cette version de démonstration conserve les tarifs de test uniquement dans ce navigateur. Aucun serveur de commerce sécurisé n’est encore connecté.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-900">
            {language === 'ar' ? '3. أمن كلمات المرور والمعاملات' : '3. Connexion simulée — aucun mot de passe vérifié'}
          </h2>
          <p>
            {language === 'ar'
              ? 'تسجيل الدخول في هذه النسخة تجريبي فقط. لا يتم التحقق من كلمات المرور، ولذلك يجب عدم إدخال كلمة مرور حقيقية أو بيانات شخصية حساسة.'
              : 'La connexion de cette démo est simulée et ne vérifie aucun mot de passe. N’utilisez pas vos véritables mots de passe ou données personnelles sensibles.'}
          </p>
        </section>
      </div>
    </div>
  );
};
