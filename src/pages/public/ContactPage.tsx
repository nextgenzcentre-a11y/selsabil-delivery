import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          {language === 'ar' ? 'اتصل بإدارة سلسبيل للتوصيل' : 'Contactez Selsabil Delivery'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {language === 'ar'
            ? 'فريق المبيعات والتوزيع في خدمتكم عبر كامل التراب الوطني الجزائري'
            : 'Notre équipe commerciale et logistique est à votre écoute'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact info cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
              {language === 'ar' ? 'معلومات الاتصال والمستودع' : 'Coordonnées & Dépôt'}
            </h3>

            <div className="space-y-4 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 text-sm">
                    {language === 'ar' ? 'المقر والمستودع المركزي' : 'Siège & Entrepôt Central'}
                  </strong>
                  <span>Zone Industrielle Oued Smar / Rouïba, Alger, Algérie</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 text-sm">
                    {language === 'ar' ? 'خدمة الزبائن والمندوبين' : 'Service Clientèle & Commerciaux'}
                  </strong>
                  <span dir="ltr">+213 (0) 550 11 22 33 / +213 (0) 23 45 67 89</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 text-sm">
                    {language === 'ar' ? 'البريد الإلكتروني التجاري' : 'Email Professionnel'}
                  </strong>
                  <span>contact@selsabil-delivery.dz</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 text-sm">
                    {language === 'ar' ? 'أوقات العمل واستقبال الطلبات' : 'Horaires d’ouverture'}
                  </strong>
                  <span>{language === 'ar' ? 'السبت - الخميس: 08:00 - 17:00' : 'Samedi - Jeudi : 08h00 - 17h00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <h3 className="font-bold text-stone-900 text-base mb-4">
            {language === 'ar' ? 'أرسل استفسارك أو طلبك التجاري' : 'Envoyer un message'}
          </h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-stone-900 text-sm">
                {language === 'ar' ? 'تم استلام رسالتكم بنجاح' : 'Message envoyé avec succès'}
              </h4>
              <p className="text-xs text-stone-600">
                {language === 'ar'
                  ? 'سيتواصل معكم أحد مندوبي سلسبيل التجاريين خلال وقت قصير.'
                  : 'Un représentant commercial vous répondra dans les plus brefs délais.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ar' ? 'الاسم الكامل أو اسم المحل' : 'Nom complet ou Magasin'}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.checkout.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'الموضوع' : 'Objet'}
                </label>
                <select className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700">
                  <option>
                    {language === 'ar' ? 'طلب تسعيرة خاصة (Gros / Demi-Gros)' : 'Demande de tarif spécial'}
                  </option>
                  <option>
                    {language === 'ar' ? 'استفسار عن كود مندوب مبيعات' : 'Question sur un code commercial'}
                  </option>
                  <option>
                    {language === 'ar' ? 'متابعة شحنة أو توصيل' : 'Suivi de livraison'}
                  </option>
                  <option>{language === 'ar' ? 'اقتراح أو ملاحظة' : 'Autre demande'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'نص الرسالة' : 'Votre message'}
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#0F392B] hover:bg-emerald-950 text-white font-bold py-2.5 px-6 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إرسال الرسالة' : 'Envoyer'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
