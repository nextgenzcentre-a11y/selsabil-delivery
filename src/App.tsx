import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/public/HomePage';
import { ShopPage } from './pages/public/ShopPage';
import { ProductDetailsPage } from './pages/public/ProductDetailsPage';
import { CategoriesPage } from './pages/public/CategoriesPage';
import { ContactPage } from './pages/public/ContactPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';
import { PendingApprovalPage } from './pages/auth/PendingApprovalPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { isDemoMode } from './config/runtime';
import { useLanguage } from './i18n/LanguageContext';

const Router = import.meta.env.VITE_ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter;

function PreviewBanner() {
  const { language } = useLanguage();
  return (
    <div role="status" className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-xs font-semibold text-amber-950">
      {language === 'ar'
        ? 'نسخة تجريبية فقط — الحسابات والطلبات والمخزون محفوظة في متصفحك، ولا تُرسل طلبات شراء فعلية.'
        : 'DÉMONSTRATION UNIQUEMENT — Comptes, commandes et stock restent dans ce navigateur. Aucune commande réelle n’est transmise.'}
    </div>
  );
}

function SetupRequired() {
  const { language } = useLanguage();
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center" role="alert">
      <h1 className="text-2xl font-bold text-stone-900">
        {language === 'ar' ? 'هذه الميزة غير متاحة بعد' : 'Fonctionnalité indisponible'}
      </h1>
      <p className="mt-4 text-stone-600">
        {language === 'ar'
          ? 'لحماية بيانات العملاء، لا يمكن استخدام الحسابات والطلبات ولوحة الإدارة حتى يتم ربط النظام بخادم آمن وقاعدة بيانات حقيقية.'
          : 'Pour protéger les clients, les comptes, commandes et l’administration nécessitent une authentification et une base de données sécurisées côté serveur.'}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-amber-300 selection:text-stone-900">
              {isDemoMode && <PreviewBanner />}
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/cart" element={isDemoMode ? <CartPage /> : <SetupRequired />} />
                  <Route path="/checkout" element={isDemoMode ? <CheckoutPage /> : <SetupRequired />} />
                  <Route path="/profile" element={isDemoMode ? <ProfilePage /> : <SetupRequired />} />
                  <Route path="/register" element={isDemoMode ? <RegisterPage /> : <SetupRequired />} />
                  <Route path="/login" element={isDemoMode ? <LoginPage /> : <SetupRequired />} />
                  <Route path="/pending-approval" element={isDemoMode ? <PendingApprovalPage /> : <SetupRequired />} />
                  <Route path="/admin" element={isDemoMode ? <DashboardPage /> : <SetupRequired />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
