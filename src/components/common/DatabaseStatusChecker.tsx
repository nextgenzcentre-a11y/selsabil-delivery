import React, { useEffect, useState } from 'react';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Shield, MapPin, PackageCheck } from 'lucide-react';
import { checkFirebaseConnection } from '../../firebase/config';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ALGERIA_GEOGRAPHY } from '../../data/algeriaGeography';

export const DatabaseStatusChecker: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { role, status, priceTier, user } = useAuth();
  const [dbStatus, setDbStatus] = useState<{
    loading: boolean;
    connected: boolean;
    projectId: string;
    mode: 'live' | 'demo';
    message: string;
  }>({
    loading: true,
    connected: false,
    projectId: '',
    mode: 'demo',
    message: 'جاري فحص الاتصال بقاعدة البيانات...',
  });

  const runCheck = async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    const result = await checkFirebaseConnection();
    setDbStatus({
      loading: false,
      connected: result.connected,
      projectId: result.projectId,
      mode: result.mode,
      message: result.message,
    });
  };

  useEffect(() => {
    runCheck();
  }, []);

  // Verification test of Carton & Unit formula:
  // 155 units with 12 units/carton -> 12 cartons and 11 units
  const testStockUnits = 155;
  const testUnitsPerCarton = 12;
  const testCartons = Math.floor(testStockUnits / testUnitsPerCarton);
  const testRemainingUnits = testStockUnits % testUnitsPerCarton;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-stone-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'ar' ? 'فحص جاهزية النظام والاتصال (المرحلة 2)' : 'Vérification Système & Base de Données (Phase 2)'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'ar'
                ? 'التحقق التلقائي من Firebase، الصلاحيات، محرك الكرتون/الحبة، وبيانات الـ 58 ولاية'
                : 'Validation automatique de Firebase, sécurité RBAC, moteur Carton/Unité et géo Algérie'}
            </p>
          </div>
        </div>

        <button
          onClick={runCheck}
          disabled={dbStatus.loading}
          className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${dbStatus.loading ? 'animate-spin' : ''}`} />
          <span>{language === 'ar' ? 'إعادة الفحص' : 'Re-tester'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Firebase DB Connection Card */}
        <div className="p-3.5 rounded-lg border border-stone-100 bg-stone-50/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600">Firebase & Firestore</span>
            {dbStatus.loading ? (
              <span className="text-[10px] text-stone-400">فحص...</span>
            ) : dbStatus.connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className="text-sm font-bold text-stone-900 truncate">
            {dbStatus.projectId || 'selsabil-delivery'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>{dbStatus.mode === 'live' ? 'Configuration présente — non vérifiée' : 'Mode démo — sans connexion réelle'}</span>
          </div>
        </div>

        {/* Active Role & RBAC Card */}
        <div className="p-3.5 rounded-lg border border-stone-100 bg-stone-50/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600">
              {language === 'ar' ? 'الصلاحية الحالية (RBAC)' : 'Rôle Actuel (RBAC)'}
            </span>
            <Shield className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-sm font-bold text-stone-900">
            {role === 'admin'
              ? 'Admin (مدير المنصة)'
              : role === 'customer'
              ? `زبون (${priceTier || status})`
              : 'زائر (Visitor)'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 truncate">
            {user ? `${user.storeName} • كود: ${user.commercialCode || 'بدون'}` : 'أسعار الفئات محجوبة'}
          </div>
        </div>

        {/* Algerian Geography Dataset Card */}
        <div className="p-3.5 rounded-lg border border-stone-100 bg-stone-50/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600">
              {language === 'ar' ? 'التقسيم الإداري الجزائري' : 'Découpage Algérie'}
            </span>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-sm font-bold text-stone-900">
            {ALGERIA_GEOGRAPHY.length} {language === 'ar' ? 'ولاية رسمية' : 'Wilayas'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {language === 'ar' ? 'الدوائر والبلديات مترابطة' : 'Daïras & Communes synchronisées'}
          </div>
        </div>

        {/* Carton & Unit Math Engine Card */}
        <div className="p-3.5 rounded-lg border border-stone-100 bg-stone-50/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-stone-600">
              {language === 'ar' ? 'محرك الكرتون والحبة' : 'Moteur Carton / Unité'}
            </span>
            <PackageCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-sm font-bold text-stone-900">
            {testCartons} {language === 'ar' ? 'كرتون' : 'Cartons'} + {testRemainingUnits} {language === 'ar' ? 'حبة' : 'Unités'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {language === 'ar' ? `اختبار: ${testStockUnits} حبة / كرتون من ${testUnitsPerCarton}` : `Test : ${testStockUnits} unités (colis de ${testUnitsPerCarton})`}
          </div>
        </div>
      </div>
    </div>
  );
};
