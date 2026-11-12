import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 text-sm mt-auto border-t-4 border-[#0F392B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#0F392B] text-amber-400 font-bold flex items-center justify-center border border-amber-400">
                S
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight">
                SELSABIL <span className="text-amber-400 font-light text-sm">DELIVERY</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              {language === 'ar'
                ? 'المنصة التجارية الرائدة لتوزيع المواد والمنتجات في الجزائر. خدمات مخصصة لتجار التجزئة، نصف الجملة، والجملة مع البيع بالكرتون والحبة والتوصيل المباشر.'
                : 'La plateforme de référence pour la distribution et le commerce B2B/B2C en Algérie. Vente au carton et à l’unité avec tarification par niveau et livraison sécurisée.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ar' ? 'منصة آمنة وموثوقة' : 'Plateforme certifiée & sécurisée'}</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-amber-400 transition">
                  {t.nav.categories}
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-amber-400 transition">
                  {t.nav.trackOrder}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Commercial & Invoicing rules */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              {language === 'ar' ? 'الضوابط التجارية' : 'Informations légales'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'ar'
                    ? 'الدفع نقداً عند الاستلام (COD)'
                    : 'Paiement à la livraison (Cash on Delivery)'}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'ar'
                    ? 'الفواتير ووصولات التسليم بالفرنسية فقط'
                    : 'Factures et Bons de livraison en Français'}
                </span>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-400 transition">
                  {t.nav.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-amber-400 transition">
                  {t.nav.privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              {language === 'ar' ? 'التواصل وخدمة الزبائن' : 'Contact & Support'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Alger, Algérie — تغطية 58 ولاية</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span dir="ltr">+213 (0) 550 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@selsabil-delivery.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 text-center text-xs text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            © {new Date().getFullYear()} SELSABIL DELIVERY. Tous droits réservés.
          </span>
          <span className="text-[11px] text-stone-400">
            Algérie • Système de Vente B2B & B2C • Carton & Unité
          </span>
        </div>
      </div>
    </footer>
  );
};
