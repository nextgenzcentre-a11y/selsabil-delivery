import { UserProfile, PriceTier, AccountStatus } from '../types';

const CUSTOMERS_STORAGE_KEY = 'selsabil_customers_db';

// Initial pre-seeded accounts for realistic Algerian commercial environment
const INITIAL_CUSTOMERS: UserProfile[] = [
  {
    uid: 'cust-101',
    email: 'toufik.market@gmail.com',
    role: 'customer',
    status: 'pending',
    priceTier: null,
    firstName: 'توفيق',
    lastName: 'بن عيسى',
    phone: '0551234567',
    storeName: 'سوبرماركت التوفيق',
    wilayaCode: '16',
    wilayaName: { ar: 'الجزائر العاصمة', fr: 'Alger' },
    dairaName: { ar: 'الدار البيضاء', fr: 'Dar El Beïda' },
    communeName: { ar: 'باب الزوار', fr: 'Bab Ezzouar' },
    address: 'حي 8 ماي 1945، عمارة 12 محل رقم 4',
    commercialId: 'comm-D01',
    commercialCode: 'D01',
    createdAt: '2026-11-10T14:20:00Z',
    updatedAt: '2026-11-10T14:20:00Z',
  },
  {
    uid: 'cust-102',
    email: 'kader.alimentation@yahoo.fr',
    role: 'customer',
    status: 'pending',
    priceTier: null,
    firstName: 'عبد القادر',
    lastName: 'محداد',
    phone: '0662345678',
    storeName: 'تغذية عامة السلام',
    wilayaCode: '09',
    wilayaName: { ar: 'البليدة', fr: 'Blida' },
    dairaName: { ar: 'بوفاريك', fr: 'Boufarik' },
    communeName: { ar: 'بوفاريك', fr: 'Boufarik' },
    address: 'شارع أول نوفمبر، مقابل البريد المركزي',
    commercialId: 'comm-D02',
    commercialCode: 'D02',
    createdAt: '2026-11-09T09:15:00Z',
    updatedAt: '2026-11-09T09:15:00Z',
  },
  {
    uid: 'cust-103',
    email: 'samir.elhidab@gmail.com',
    role: 'customer',
    status: 'approved',
    priceTier: 'GROS',
    firstName: 'سمير',
    lastName: 'رحموني',
    phone: '0770987654',
    storeName: 'مؤسسة الهضاب للتوزيع والجملة',
    wilayaCode: '19',
    wilayaName: { ar: 'سطيف', fr: 'Sétif' },
    dairaName: { ar: 'العلمة', fr: 'El Eulma' },
    communeName: { ar: 'العلمة', fr: 'El Eulma' },
    address: 'حي دبي التجاري، شارع المستودعات',
    commercialId: 'comm-D03',
    commercialCode: 'D03',
    createdAt: '2026-11-01T11:00:00Z',
    updatedAt: '2026-11-02T16:30:00Z',
    approvedAt: '2026-11-02T16:30:00Z',
    approvedBy: 'admin-master-01',
  },
  {
    uid: 'cust-104',
    email: 'khaled.bahia@gmail.com',
    role: 'customer',
    status: 'approved',
    priceTier: 'DEMI_GROS',
    firstName: 'خالد',
    lastName: 'بوعزة',
    phone: '0560112233',
    storeName: 'ميني ماركت الباهية',
    wilayaCode: '31',
    wilayaName: { ar: 'وهران', fr: 'Oran' },
    dairaName: { ar: 'السانية', fr: 'Es Senia' },
    communeName: { ar: 'السانية', fr: 'Es Senia' },
    address: 'نهج الأمير عبد القادر، رقم 88',
    commercialId: 'comm-D01',
    commercialCode: 'D01',
    createdAt: '2026-11-03T10:45:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
    approvedAt: '2026-11-04T12:00:00Z',
    approvedBy: 'admin-master-01',
  },
  {
    uid: 'cust-105',
    email: 'amine.superette@gmail.com',
    role: 'customer',
    status: 'approved',
    priceTier: 'DETAIL',
    firstName: 'أمين',
    lastName: 'سعيدي',
    phone: '0555998877',
    storeName: 'سوبريت زهرة الشمال',
    wilayaCode: '35',
    wilayaName: { ar: 'بومرداس', fr: 'Boumerdès' },
    dairaName: { ar: 'بودواو', fr: 'Boudouaou' },
    communeName: { ar: 'بودواو', fr: 'Boudouaou' },
    address: 'وسط المدينة، طريق الجزائر',
    commercialId: 'comm-D04',
    commercialCode: 'D04',
    createdAt: '2026-11-05T08:30:00Z',
    updatedAt: '2026-11-05T14:10:00Z',
    approvedAt: '2026-11-05T14:10:00Z',
    approvedBy: 'admin-master-01',
  },
];

export const getStoredCustomers = (): UserProfile[] => {
  const data = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

export const saveCustomers = (customers: UserProfile[]) => {
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
};

export const registerNewCustomer = (
  data: Omit<UserProfile, 'uid' | 'role' | 'status' | 'priceTier' | 'createdAt' | 'updatedAt'>
): UserProfile => {
  const customers = getStoredCustomers();
  const newCustomer: UserProfile = {
    ...data,
    uid: `cust-${Date.now()}`,
    role: 'customer',
    status: 'pending', // Always pending upon registration as required
    priceTier: null,   // Always null until Admin assigns tier
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  customers.unshift(newCustomer);
  saveCustomers(customers);
  return newCustomer;
};

export const approveCustomerWithTier = (
  uid: string,
  priceTier: PriceTier,
  adminId = 'admin-master-01'
): UserProfile | null => {
  const customers = getStoredCustomers();
  const idx = customers.findIndex((c) => c.uid === uid);
  if (idx === -1) return null;

  customers[idx] = {
    ...customers[idx],
    status: 'approved',
    priceTier,
    approvedAt: new Date().toISOString(),
    approvedBy: adminId,
    updatedAt: new Date().toISOString(),
  };

  saveCustomers(customers);
  return customers[idx];
};

export const updateCustomerStatus = (
  uid: string,
  status: AccountStatus,
  adminId = 'admin-master-01'
): UserProfile | null => {
  const customers = getStoredCustomers();
  const idx = customers.findIndex((c) => c.uid === uid);
  if (idx === -1) return null;

  customers[idx] = {
    ...customers[idx],
    status,
    updatedAt: new Date().toISOString(),
  };

  saveCustomers(customers);
  return customers[idx];
};

export const updateCustomerProfileByCustomer = (
  uid: string,
  allowedUpdates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    storeName?: string;
    address?: string;
  }
): UserProfile | null => {
  const customers = getStoredCustomers();
  const idx = customers.findIndex((c) => c.uid === uid);
  if (idx === -1) return null;

  // STRICT SECURITY CHECK: Customer cannot touch priceTier, status, or commercial relationship!
  customers[idx] = {
    ...customers[idx],
    firstName: allowedUpdates.firstName ?? customers[idx].firstName,
    lastName: allowedUpdates.lastName ?? customers[idx].lastName,
    phone: allowedUpdates.phone ?? customers[idx].phone,
    storeName: allowedUpdates.storeName ?? customers[idx].storeName,
    address: allowedUpdates.address ?? customers[idx].address,
    updatedAt: new Date().toISOString(),
  };

  saveCustomers(customers);
  return customers[idx];
};

export const searchCustomers = (query: string, statusFilter?: string): UserProfile[] => {
  const customers = getStoredCustomers();
  const q = query.trim().toLowerCase();

  return customers.filter((c) => {
    const matchesStatus =
      !statusFilter || statusFilter === 'all' || c.status === statusFilter;

    const matchesQuery =
      !q ||
      c.storeName.toLowerCase().includes(q) ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.commercialCode && c.commercialCode.toLowerCase().includes(q)) ||
      c.wilayaName.ar.includes(q) ||
      c.wilayaName.fr.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });
};
