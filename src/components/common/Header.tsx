import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Globe,
  ShieldCheck,
  Menu,
  X,
  Truck,
  Layers,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { isDemoMode } from '../../config/runtime';

export const Header: React.FC = () => {
  const { t, language, toggleLanguage, isRtl } = useLanguage();
  const { user, role, status, priceTier, isAdmin, logout, loginAs } = useAuth();
  const { itemsCount, totalCartonsCount, totalUnitsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devRoleMenuOpen, setDevRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-xs">
      {/* Top utility bar */}
      <div className="bg-[#0F392B] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>SELSABIL DELIVERY — الجزائر</span>
            </span>
            <span className="hidden md:inline text-stone-300">|</span>
            <span className="hidden md:inline text-stone-200">
              {language === 'ar'
                ? 'البيع بالجملة ونصف الجملة والتجزئة (كرتون / حبة)'
                : 'Vente en Gros, Demi-Gros & Détail (Carton / Unité)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview-only direct admin entry; never show in a real deployment. */}
            {isDemoMode && <Link
              to="/admin"
              onClick={() => {
                if (!isAdmin) {
                  loginAs({
                    role: 'admin',
                    status: 'approved',
                    storeName: 'الإدارة المركزية سلسبيل',
                    priceTier: null,
                  });
                }
              }}
              className="bg-amber-400 hover:bg-amber-300 text-stone-900 px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition shadow-xs"
              title="دخول فوري إلى وحدة تحكم المدير"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-900" />
              <span>{language === 'ar' ? 'وحدة التحكم (المدير)' : 'Panneau Admin'}</span>
            </Link>}

            {/* Demo role switcher is disabled in production mode. */}
            {isDemoMode && <div className="relative">
              <button
                onClick={() => setDevRoleMenuOpen(!devRoleMenuOpen)}
                className="bg-emerald-900/80 hover:bg-emerald-800 text-stone-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition"
                title="تبديل الصلاحية للتجربة السريعة"
              >
                <span>
                  {isAdmin
                    ? 'المدير (Admin)'
                    : user
                    ? `${user.storeName} (${priceTier || status})`
                    : 'زائر (Visitor)'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {devRoleMenuOpen && (
                <div
                  className={`absolute top-full mt-1 ${
                    isRtl ? 'left-0' : 'right-0'
                  } bg-white text-stone-800 rounded-md shadow-xl border border-stone-200 py-1.5 w-56 z-50 text-xs`}
                >
                  <div className="px-3 py-1 font-semibold text-stone-400 text-[10px] uppercase">
                    اختبار أدوار المنصة (Test Roles)
                  </div>
                  <button
                    onClick={() => {
                      loginAs({
                        role: 'admin',
                        status: 'approved',
                        storeName: 'الإدارة المركزية سلسبيل',
                        priceTier: null,
                      });
                      setDevRoleMenuOpen(false);
                    }}
                    className="w-full text-start px-3 py-1.5 hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span className="font-medium text-emerald-800">1. مدير المنصة (Admin)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">كامل</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs({
                        role: 'customer',
                        status: 'approved',
                        priceTier: 'GROS',
                        storeName: 'سوبرماركت النور (جملة)',
                      });
                      setDevRoleMenuOpen(false);
                    }}
                    className="w-full text-start px-3 py-1.5 hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span>2. تاجر جملة (GROS)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">معتمد</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs({
                        role: 'customer',
                        status: 'approved',
                        priceTier: 'DEMI_GROS',
                        storeName: 'محل البركة (نصف جملة)',
                      });
                      setDevRoleMenuOpen(false);
                    }}
                    className="w-full text-start px-3 py-1.5 hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span>3. نصف جملة (DEMI_GROS)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">معتمد</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs({
                        role: 'customer',
                        status: 'pending',
                        priceTier: null,
                        storeName: 'متجر قيد المراجعة',
                      });
                      setDevRoleMenuOpen(false);
                    }}
                    className="w-full text-start px-3 py-1.5 hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span>4. تاجر جديد (En attente)</span>
                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded">معلق</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setDevRoleMenuOpen(false);
                    }}
                    className="w-full text-start px-3 py-1.5 hover:bg-stone-100 text-red-600 border-t border-stone-100"
                  >
                    5. زائر غير مسجل (Visitor)
                  </button>
                </div>
              )}
            </div>}

            {/* Language switch button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900 px-2.5 py-0.5 rounded text-xs transition"
              title={t.switchLang}
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ar' ? 'Français' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-[#0F392B] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-amber-400 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#0F392B] tracking-tight flex items-center gap-1.5">
                <span>SELSABIL</span>
                <span className="text-amber-600 font-light text-base">DELIVERY</span>
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                {language === 'ar' ? 'التجارة والتوزيع في الجزائر' : 'Distribution & E-commerce Algérie'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
            <Link to="/" className="hover:text-[#0F392B] transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/shop" className="hover:text-[#0F392B] transition-colors">
              {t.nav.shop}
            </Link>
            <Link to="/categories" className="hover:text-[#0F392B] transition-colors">
              {t.nav.categories}
            </Link>
            {user && (
              <Link to="/orders" className="hover:text-[#0F392B] transition-colors">
                {t.nav.myOrders}
              </Link>
            )}
            <Link to="/track" className="hover:text-[#0F392B] transition-colors">
              {t.nav.trackOrder}
            </Link>
            <Link to="/contact" className="hover:text-[#0F392B] transition-colors">
              {t.nav.contact}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-amber-100 text-amber-900 px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 hover:bg-amber-200 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.nav.adminDashboard}</span>
              </Link>
            )}
          </nav>

          {/* Action buttons: Cart & Account */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-[#F4EFE6] text-[#0F392B] px-3.5 py-2 rounded-lg font-medium text-sm hover:bg-[#EAE2D4] transition"
            >
              <ShoppingBag className="w-5 h-5 text-[#0F392B]" />
              <span className="hidden sm:inline">{t.nav.cart}</span>
              {itemsCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#0F392B] text-white text-xs font-bold rounded-full h-5 min-w-5 px-1">
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* User profile / login button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 border border-stone-300 text-stone-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 transition"
                >
                  <User className="w-4 h-4 text-emerald-800" />
                  <span className="hidden lg:inline max-w-[120px] truncate">{user.storeName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-stone-400 hover:text-red-600 p-2 transition"
                  title={t.nav.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#0F392B] hover:text-emerald-900 px-2 py-1"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0F392B] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-emerald-900 transition shadow-xs"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-700 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium"
          >
            {t.nav.home}
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium"
          >
            {t.nav.shop}
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium"
          >
            {t.nav.categories}
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium"
          >
            {t.nav.myOrders}
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium"
          >
            {t.nav.trackOrder}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-amber-800 font-bold"
            >
              {t.nav.adminDashboard}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
