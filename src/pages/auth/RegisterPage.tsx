import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, UserCheck, ShieldAlert, CheckCircle2, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { AlgerianGeoSelect } from '../../components/common/AlgerianGeoSelect';
import { registerNewCustomer } from '../../services/customerService';
import { validateCommercialCode } from '../../services/commercialService';

export const RegisterPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    storeName: '',
    wilayaCode: '',
    wilayaName: { ar: '', fr: '' },
    dairaName: '',
    communeName: '',
    address: '',
    email: '',
    password: '',
    commercialCode: '',
  });

  const [codeValidStatus, setCodeValidStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active commercial codes in Selsabil network
  const activeCommercialCodes = ['D01', 'D02', 'D03', 'D04', 'D05'];

  const handleCommercialCodeCheck = (code: string) => {
    const clean = code.trim().toUpperCase();
    setFormData((prev) => ({ ...prev, commercialCode: clean }));
    if (!clean) {
      setCodeValidStatus('idle');
      return;
    }
    const check = validateCommercialCode(clean);
    if (check.valid) {
      setCodeValidStatus('valid');
    } else {
      setCodeValidStatus('invalid');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation checks
    if (!formData.wilayaCode || !formData.dairaName || !formData.communeName) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى تحديد الولاية والدائرة والبلدية بدقة'
          : 'Veuillez sélectionner la wilaya, la daïra et la commune'
      );
      return;
    }

    if (formData.commercialCode && codeValidStatus === 'invalid') {
      setErrorMsg(
        language === 'ar'
          ? 'كود المندوب التجاري غير صالح أو غير نشط'
          : 'Code commercial invalide ou inactif'
      );
      return;
    }

    // Persist new customer in customer database
    const newCustomerRecord = registerNewCustomer({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      storeName: formData.storeName,
      wilayaCode: formData.wilayaCode,
      wilayaName: formData.wilayaName,
      dairaName: { ar: formData.dairaName, fr: formData.dairaName },
      communeName: { ar: formData.communeName, fr: formData.communeName },
      address: formData.address,
      commercialCode: formData.commercialCode || null,
      commercialId: formData.commercialCode ? `comm-${formData.commercialCode}` : null,
    });

    // Set active session for the user
    loginAs(newCustomerRecord);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">{t.auth.pendingAccountTitle}</h2>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            {t.auth.pendingAccountMsg}
          </p>

          <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-700 text-start space-y-1.5 border border-stone-200">
            <div>
              <strong>{language === 'ar' ? 'المحل:' : 'Magasin :'}</strong> {formData.storeName}
            </div>
            <div>
              <strong>{language === 'ar' ? 'المنطقة:' : 'Région :'}</strong>{' '}
              {language === 'ar' ? formData.wilayaName.ar : formData.wilayaName.fr} •{' '}
              {formData.communeName}
            </div>
            <div>
              <strong>{language === 'ar' ? 'كود المندوب:' : 'Code Commercial :'}</strong>{' '}
              {formData.commercialCode || (language === 'ar' ? 'تسجيل مباشر' : 'Direct')}
            </div>
            <div>
              <strong>{language === 'ar' ? 'الحالة الحالية:' : 'Statut :'}</strong>{' '}
              <span className="text-amber-700 font-semibold">{t.status.pending}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/shop"
              className="bg-[#0F392B] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-950 transition"
            >
              {language === 'ar' ? 'تصفح المتجر كزائر' : 'Voir le catalogue'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" />
            <span>SELSABIL DELIVERY B2B</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            {t.auth.registerTitle}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'ar'
              ? 'مخصص لتجار التجزئة ونصف الجملة والجملة في الجزائر'
              : 'Réservé aux commerçants et professionnels en Algérie'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.auth.firstName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.auth.lastName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
          </div>

          {/* Store Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.checkout.storeName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Supérette El Baraka"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.checkout.phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder={t.auth.phonePlaceholder}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
          </div>

          {/* Cascading Wilaya -> Daira -> Commune */}
          <AlgerianGeoSelect
            selectedWilayaCode={formData.wilayaCode}
            selectedDairaName={formData.dairaName}
            selectedCommuneName={formData.communeName}
            onWilayaChange={(code, name) =>
              setFormData((prev) => ({ ...prev, wilayaCode: code, wilayaName: name }))
            }
            onDairaChange={(daira) => setFormData((prev) => ({ ...prev, dairaName: daira }))}
            onCommuneChange={(commune) =>
              setFormData((prev) => ({ ...prev, communeName: commune }))
            }
          />

          {/* Address Details */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.checkout.addressDetails} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={
                language === 'ar'
                  ? 'رقم المحل، اسم الشارع، بجانب المسجد أو المعلم الرئيسي'
                  : 'Rue, N° de local, point de repère'
              }
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
            />
          </div>

          {/* Commercial Representative Code */}
          <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-stone-800">
              {t.commercial.codeLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.commercial.codePlaceholder}
                value={formData.commercialCode}
                onChange={(e) => handleCommercialCodeCheck(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs uppercase font-mono tracking-wider text-stone-900 focus:outline-emerald-700"
              />
            </div>
            {codeValidStatus === 'valid' && (
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.commercial.validCode} (مندوب سلسبيل المعتمد)</span>
              </div>
            )}
            {codeValidStatus === 'invalid' && (
              <div className="text-[11px] text-red-600 font-medium">
                {t.commercial.invalidCode}
              </div>
            )}
            <p className="text-[10px] text-stone-500">{t.commercial.optionalNotice}</p>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.auth.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.auth.password} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F392B] hover:bg-emerald-950 text-white font-bold py-3 rounded-lg text-xs transition shadow-md"
          >
            {t.auth.registerBtn}
          </button>
        </form>

        <div className="text-center text-xs text-stone-600 pt-2 border-t border-stone-100">
          <span>{t.auth.alreadyHaveAccount} </span>
          <Link to="/login" className="text-emerald-800 font-bold hover:underline">
            {t.nav.login}
          </Link>
        </div>
      </div>
    </div>
  );
};
