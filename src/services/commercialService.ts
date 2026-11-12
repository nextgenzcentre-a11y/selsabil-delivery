import { CommercialRepresentative } from '../types';
import { getStoredCustomers } from './customerService';

const COMMERCIALS_STORAGE_KEY = 'selsabil_commercials_db';

const INITIAL_COMMERCIALS: CommercialRepresentative[] = [
  {
    id: 'comm-D01',
    code: 'D01',
    fullName: 'ياسين بلحاج',
    phone: '0550111222',
    active: true,
    wilayasCovered: ['16', '31', '35'], // Alger, Oran, Boumerdès
    stats: {
      totalCustomers: 2,
      totalOrders: 18,
      totalSalesAmount: 345000,
      cancelledOrders: 1,
    },
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-11-10T12:00:00Z',
  },
  {
    id: 'comm-D02',
    code: 'D02',
    fullName: 'عبد الرحمن زروقي',
    phone: '0661222333',
    active: true,
    wilayasCovered: ['09', '42', '44'], // Blida, Tipaza, Ain Defla
    stats: {
      totalCustomers: 1,
      totalOrders: 14,
      totalSalesAmount: 280000,
      cancelledOrders: 0,
    },
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-11-10T12:00:00Z',
  },
  {
    id: 'comm-D03',
    code: 'D03',
    fullName: 'طارق مسعودي',
    phone: '0772333444',
    active: true,
    wilayasCovered: ['19', '25', '34'], // Sétif, Constantine, Bordj
    stats: {
      totalCustomers: 1,
      totalOrders: 11,
      totalSalesAmount: 215000,
      cancelledOrders: 1,
    },
    createdAt: '2026-10-10T08:00:00Z',
    updatedAt: '2026-11-10T12:00:00Z',
  },
  {
    id: 'comm-D04',
    code: 'D04',
    fullName: 'هشام عماري',
    phone: '0553444555',
    active: true,
    wilayasCovered: ['35', '15', '06'], // Boumerdès, Tizi Ouzou, Béjaïa
    stats: {
      totalCustomers: 1,
      totalOrders: 8,
      totalSalesAmount: 160000,
      cancelledOrders: 0,
    },
    createdAt: '2026-10-15T08:00:00Z',
    updatedAt: '2026-11-10T12:00:00Z',
  },
  {
    id: 'comm-D05',
    code: 'D05',
    fullName: 'سفيان دراجي',
    phone: '0664555666',
    active: true,
    wilayasCovered: ['02', '27', '29'], // Chlef, Mostaganem, Mascara
    stats: {
      totalCustomers: 0,
      totalOrders: 6,
      totalSalesAmount: 95000,
      cancelledOrders: 0,
    },
    createdAt: '2026-10-20T08:00:00Z',
    updatedAt: '2026-11-10T12:00:00Z',
  },
];

export const getStoredCommercials = (): CommercialRepresentative[] => {
  const data = localStorage.getItem(COMMERCIALS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(COMMERCIALS_STORAGE_KEY, JSON.stringify(INITIAL_COMMERCIALS));
    return INITIAL_COMMERCIALS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COMMERCIALS;
  }
};

export const saveCommercials = (commercials: CommercialRepresentative[]) => {
  localStorage.setItem(COMMERCIALS_STORAGE_KEY, JSON.stringify(commercials));
};

export const validateCommercialCode = (
  code: string
): { valid: boolean; commercial?: CommercialRepresentative; message: string } => {
  const clean = code.trim().toUpperCase();
  if (!clean) {
    return { valid: false, message: 'الكود فارغ' };
  }

  const commercials = getStoredCommercials();
  const rep = commercials.find((c) => c.code === clean);

  if (!rep) {
    return { valid: false, message: 'كود المندوب غير موجود في النظام' };
  }

  if (!rep.active) {
    return { valid: false, message: 'كود المندوب معطل حالياً' };
  }

  return { valid: true, commercial: rep, message: `كود المندوب صالح (${rep.fullName})` };
};

export const addCommercial = (
  code: string,
  fullName: string,
  phone: string,
  wilayasCovered: string[]
): { success: boolean; error?: string; commercial?: CommercialRepresentative } => {
  const cleanCode = code.trim().toUpperCase();
  const commercials = getStoredCommercials();

  if (commercials.some((c) => c.code === cleanCode)) {
    return { success: false, error: 'كود المندوب موجود مسبقاً، يرجى اختيار كود فريد' };
  }

  const newRep: CommercialRepresentative = {
    id: `comm-${cleanCode}`,
    code: cleanCode,
    fullName,
    phone,
    active: true,
    wilayasCovered,
    stats: {
      totalCustomers: 0,
      totalOrders: 0,
      totalSalesAmount: 0,
      cancelledOrders: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  commercials.push(newRep);
  saveCommercials(commercials);
  return { success: true, commercial: newRep };
};

export const toggleCommercialActive = (code: string): CommercialRepresentative | null => {
  const commercials = getStoredCommercials();
  const idx = commercials.findIndex((c) => c.code === code);
  if (idx === -1) return null;

  commercials[idx] = {
    ...commercials[idx],
    active: !commercials[idx].active,
    updatedAt: new Date().toISOString(),
  };

  saveCommercials(commercials);
  return commercials[idx];
};

export const getCustomersForCommercial = (commercialCode: string) => {
  const all = getStoredCustomers();
  return all.filter((c) => c.commercialCode === commercialCode);
};
