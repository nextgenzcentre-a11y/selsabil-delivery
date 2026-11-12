import React, { useState } from 'react';
import {
  User,
  Store,
  MapPin,
  Phone,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Save,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { updateCustomerProfileByCustomer } from '../../services/customerService';

export const ProfilePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, updateProfile, isApproved, isPending, priceTier, status } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    storeName: user?.storeName || '',
    address: user?.address || '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">
          {language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Veuillez vous connecter'}
        </h2>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Updates through protected service
      const updated = updateCustomerProfileByCustomer(user.uid, formData);
      if (updated) {
        updateProfile(formData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: any) {
      setSaveError(err?.message || 'حدث خطأ أثناء حفظ البيانات');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 mb-1">
            <Store className="w-3.5 h-3.5" />
            <span>SELSABIL MERCHANT ACCOUNT</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {language === 'ar' ? 'الملف الشخصي وحساب التاجر' : 'Profil & Compte Commerçant'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'ar'
              ? 'متابعة حالة اعتماد الحساب، فئة الأسعار، والمندوب التجاري المعتمد'
              : 'Informations professionnelles, niveau de prix et statut de validation'}
          </p>
        </div>

        {/* Account Status Badge */}
        <div>
          {isPending && (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{t.status.pending} (قيد المراجعة)</span>
            </span>
          )}
          {isApproved && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t.status.approved} (معتمد ونشط)</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid of Protected Attributes (Price Tier & Commercial Code) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Price Tier Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-600">
              {language === 'ar' ? 'فئة الأسعار المعتمدة' : 'Grille Tarifaire'}
            </span>
            <span title="مغلق بواسطة الإدارة">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
            </span>
          </div>
          <div className="text-base font-black text-[#0F392B]">
            {priceTier ? (
              t.tiers[priceTier]
            ) : (
              <span className="text-amber-700 text-xs font-medium">
                {language === 'ar' ? 'في انتظار تحديد المدير' : 'En attente d’attribution'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">
            {language === 'ar'
              ? 'تحدد حصرياً من إدارة مبيعات سلسبيل ولا يمكن تعديلها من الزبون.'
              : 'Attribué exclusivement par la direction commerciale.'}
          </p>
        </div>

        {/* 2. Commercial Representative Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-600">
              {language === 'ar' ? 'المندوب التجاري المرتبط' : 'Commercial Associé'}
            </span>
            <span title="علاقة دائمة مثبتة">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
            </span>
          </div>
          <div className="text-base font-black text-amber-800 flex items-center gap-2">
            <span className="font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-sm">
              {user.commercialCode || (language === 'ar' ? 'تسجيل مباشر' : 'Direct')}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">
            {language === 'ar'
              ? 'علاقة دائمة مسجلة عند إنشاء الحساب لحفظ عمولات ومتابعة المندوب.'
              : 'Lien commercial permanent enregistré lors de l’inscription.'}
          </p>
        </div>

        {/* 3. Administrative Region Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-600">
              {language === 'ar' ? 'المنطقة الإدارية' : 'Zone Administrative'}
            </span>
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
          </div>
          <div className="text-sm font-bold text-stone-900">
            {language === 'ar' ? user.wilayaName.ar : user.wilayaName.fr} ({user.wilayaCode})
          </div>
          <div className="text-xs text-stone-500 truncate">
            {language === 'ar' ? user.dairaName.ar : user.dairaName.fr} •{' '}
            {language === 'ar' ? user.communeName.ar : user.communeName.fr}
          </div>
        </div>
      </div>

      {/* Editable Personal Details Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-stone-100">
          <div>
            <h2 className="font-bold text-stone-900 text-base">
              {language === 'ar' ? 'البيانات الشخصية ومعلومات الاتصال' : 'Informations Personnelles'}
            </h2>
            <p className="text-xs text-stone-500">
              {language === 'ar'
                ? 'يمكنك تعديل اسم المحل ورقم الهاتف والعنوان الدقيق'
                : 'Modifiez votre téléphone, nom d’établissement et adresse de livraison'}
            </p>
          </div>
          <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-1 rounded">
            UID: {user.uid}
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'ar'
                ? 'تم تحديث بيانات ملفك التجاري بنجاح!'
                : 'Vos coordonnées ont été mises à jour avec succès !'}
            </span>
          </div>
        )}

        {saveError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.checkout.storeName}
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.checkout.phone}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.auth.firstName}
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.auth.lastName}
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.checkout.addressDetails}
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-800"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="bg-[#0F392B] hover:bg-emerald-950 text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'حفظ التعديلات' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
