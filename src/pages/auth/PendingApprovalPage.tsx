import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Phone, Store, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const PendingApprovalPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user } = useAuth();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {language === 'ar' ? 'طلب حسابكم قيد المراجعة الإدارية' : 'Votre Compte est en Cours de Validation'}
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            {language === 'ar'
              ? 'مرحباً بكم في سلسبيل للتوصيل! حرصاً على تطبيق أسعار الجملة ونصف الجملة العادلة والمحمية، تقوم إدارة المبيعات بدراسة كل حساب وتعيين فئة السعر المناسبة قبل تفعيل إمكانية تأكيد الطلبات.'
              : 'Votre compte commerçant est en cours de vérification par notre service commercial afin de vous attribuer la grille tarifaire (Gros, Demi-Gros, Détail).'}
          </p>
        </div>

        {user && (
          <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-700 text-start space-y-2 border border-stone-200">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">{language === 'ar' ? 'اسم المتجر:' : 'Magasin :'}</span>
              <strong className="text-stone-900">{user.storeName}</strong>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">{language === 'ar' ? 'المنطقة:' : 'Région :'}</span>
              <span>
                {language === 'ar' ? user.wilayaName.ar : user.wilayaName.fr} •{' '}
                {language === 'ar' ? user.communeName.ar : user.communeName.fr}
              </span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">{language === 'ar' ? 'المندوب المرتبط:' : 'Commercial :'}</span>
              <span className="font-mono font-bold text-amber-800">
                {user.commercialCode || (language === 'ar' ? 'تسجيل مباشر' : 'Direct')}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-stone-500">{language === 'ar' ? 'الحالة الحالية:' : 'Statut :'}</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                {t.status.pending}
              </span>
            </div>
          </div>
        )}

        <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>
            {language === 'ar'
              ? 'للاستعجال يرجى الاتصال بمصلحة المبيعات: 0550 11 22 33'
              : 'Pour accélérer la validation, contactez-nous au : 0550 11 22 33'}
          </span>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="bg-[#0F392B] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-950 transition flex items-center gap-1.5"
          >
            <span>{language === 'ar' ? 'تصفح الكتالوج كزائر' : 'Consulter le catalogue'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/profile"
            className="bg-white border border-stone-300 text-stone-700 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-50 transition"
          >
            {t.nav.account}
          </Link>
        </div>
      </div>
    </div>
  );
};
