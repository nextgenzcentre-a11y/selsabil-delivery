import React from 'react';
import { ALGERIA_GEOGRAPHY } from '../../data/algeriaGeography';
import { useLanguage } from '../../i18n/LanguageContext';

interface AlgerianGeoSelectProps {
  selectedWilayaCode: string;
  selectedDairaName: string;
  selectedCommuneName: string;
  onWilayaChange: (wilayaCode: string, wilayaName: { ar: string; fr: string }) => void;
  onDairaChange: (dairaName: string) => void;
  onCommuneChange: (communeName: string) => void;
  required?: boolean;
}

export const AlgerianGeoSelect: React.FC<AlgerianGeoSelectProps> = ({
  selectedWilayaCode,
  selectedDairaName,
  selectedCommuneName,
  onWilayaChange,
  onDairaChange,
  onCommuneChange,
  required = true,
}) => {
  const { language } = useLanguage();

  const currentWilaya = ALGERIA_GEOGRAPHY.find((w) => w.code === selectedWilayaCode);
  const currentDaira = currentWilaya?.dairas.find(
    (d) => d.nameAr === selectedDairaName || d.nameFr === selectedDairaName
  );

  const handleWilayaSelect = (code: string) => {
    const wilaya = ALGERIA_GEOGRAPHY.find((w) => w.code === code);
    if (wilaya) {
      onWilayaChange(wilaya.code, { ar: wilaya.nameAr, fr: wilaya.nameFr });
      // Reset dependent daira and commune
      onDairaChange('');
      onCommuneChange('');
    } else {
      onWilayaChange('', { ar: '', fr: '' });
      onDairaChange('');
      onCommuneChange('');
    }
  };

  const handleDairaSelect = (dairaName: string) => {
    onDairaChange(dairaName);
    // Reset dependent commune
    onCommuneChange('');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 1. Wilaya */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          {language === 'ar' ? '1. الولاية' : '1. Wilaya'}{' '}
          {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedWilayaCode}
          onChange={(e) => handleWilayaSelect(e.target.value)}
          required={required}
          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700"
        >
          <option value="">
            {language === 'ar' ? '-- اختر الولاية --' : '-- Choisir la wilaya --'}
          </option>
          {ALGERIA_GEOGRAPHY.map((w) => (
            <option key={w.code} value={w.code}>
              {w.code} - {language === 'ar' ? w.nameAr : w.nameFr}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Daira (Cascading) */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          {language === 'ar' ? '2. الدائرة' : '2. Daïra'}{' '}
          {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedDairaName}
          onChange={(e) => handleDairaSelect(e.target.value)}
          disabled={!currentWilaya}
          required={required}
          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700 disabled:bg-stone-100 disabled:text-stone-400"
        >
          <option value="">
            {language === 'ar' ? '-- اختر الدائرة --' : '-- Choisir la daïra --'}
          </option>
          {currentWilaya?.dairas.map((d) => (
            <option key={d.id} value={language === 'ar' ? d.nameAr : d.nameFr}>
              {language === 'ar' ? d.nameAr : d.nameFr}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Commune (Cascading) */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          {language === 'ar' ? '3. البلدية' : '3. Commune'}{' '}
          {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedCommuneName}
          onChange={(e) => onCommuneChange(e.target.value)}
          disabled={!currentDaira}
          required={required}
          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-emerald-700 disabled:bg-stone-100 disabled:text-stone-400"
        >
          <option value="">
            {language === 'ar' ? '-- اختر البلدية --' : '-- Choisir la commune --'}
          </option>
          {currentDaira?.communes.map((c) => (
            <option key={c.id} value={language === 'ar' ? c.nameAr : c.nameFr}>
              {language === 'ar' ? c.nameAr : c.nameFr}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
