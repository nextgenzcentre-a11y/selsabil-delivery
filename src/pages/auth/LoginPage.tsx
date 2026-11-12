import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Quick demo login routing:
    // If admin email: log in as admin
    if (email.toLowerCase().includes('admin')) {
      loginAs({
        role: 'admin',
        status: 'approved',
        email,
        storeName: 'Direction Selsabil Delivery',
      });
      navigate('/admin');
    } else {
      // Customer login
      loginAs({
        role: 'customer',
        status: 'approved',
        priceTier: 'GROS',
        email,
        storeName: 'سوبرماركت التوزيع الجزائري',
      });
      navigate('/shop');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold text-lg">
            S
          </div>
          <h1 className="text-xl font-black text-stone-900 tracking-tight">{t.auth.loginTitle}</h1>
          <p className="text-xs text-stone-500">SELSABIL DELIVERY B2B & B2C</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.auth.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute top-2.5 start-3 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="direction@selsabil-delivery.dz"
                className="w-full bg-white border border-stone-300 rounded-lg py-2 ps-9 pe-3 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.auth.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute top-2.5 start-3 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-stone-300 rounded-lg py-2 ps-9 pe-3 text-xs text-stone-900 focus:outline-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F392B] hover:bg-emerald-950 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-md"
          >
            {t.auth.loginBtn}
          </button>

          {/* Quick Admin Demo Login Button */}
          <button
            type="button"
            onClick={() => {
              loginAs({
                role: 'admin',
                status: 'approved',
                email: 'direction@selsabil-delivery.dz',
                storeName: 'الإدارة المركزية سلسبيل',
              });
              navigate('/admin');
            }}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>{language === 'ar' ? '🔑 دخول مباشر كمدير المنصة (Admin)' : '🔑 Accès Direct Administrateur'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-stone-600 pt-2 border-t border-stone-100">
          <span>{t.auth.noAccount} </span>
          <Link to="/register" className="text-emerald-800 font-bold hover:underline">
            {t.nav.register}
          </Link>
        </div>
      </div>
    </div>
  );
};
