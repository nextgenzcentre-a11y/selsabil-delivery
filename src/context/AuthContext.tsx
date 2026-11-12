import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role, AccountStatus, PriceTier } from '../types';
import { isDemoMode } from '../config/runtime';

interface AuthContextType {
  user: UserProfile | null;
  role: Role;
  status: AccountStatus | 'guest';
  priceTier: PriceTier | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  isPending: boolean;
  loginAs: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultAdminUser: UserProfile = {
  uid: 'admin-master-01',
  email: 'direction@selsabil-delivery.dz',
  role: 'admin',
  status: 'approved',
  priceTier: null,
  firstName: 'Admin',
  lastName: 'Selsabil',
  phone: '0550112233',
  storeName: 'Direction Selsabil Delivery',
  wilayaCode: '16',
  wilayaName: { ar: 'الجزائر العاصمة', fr: 'Alger' },
  dairaName: { ar: 'سيدي امحمد', fr: 'Sidi M’Hamed' },
  communeName: { ar: 'الجزائر الوسطى', fr: 'Alger Centre' },
  address: 'Zone Industrielle, Alger',
  commercialId: null,
  commercialCode: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (!isDemoMode) return null;
    const saved = localStorage.getItem('selsabil_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to visitor initially, with easy switch to Admin or Merchant
    return null;
  });

  useEffect(() => {
    if (!isDemoMode) return;
    if (user) {
      localStorage.setItem('selsabil_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('selsabil_active_user');
    }
  }, [user]);

  const loginAs = (profile: Partial<UserProfile>) => {
    if (!isDemoMode) return;
    const newUser: UserProfile = {
      uid: profile.uid || `user-${Date.now()}`,
      email: profile.email || 'client@magasin.dz',
      role: profile.role || 'customer',
      status: profile.status || 'pending',
      priceTier: profile.priceTier || null,
      firstName: profile.firstName || 'Karim',
      lastName: profile.lastName || 'Boudiaf',
      phone: profile.phone || '0661234567',
      storeName: profile.storeName || 'Superette El Amel',
      wilayaCode: profile.wilayaCode || '16',
      wilayaName: profile.wilayaName || { ar: 'الجزائر العاصمة', fr: 'Alger' },
      dairaName: profile.dairaName || { ar: 'الدار البيضاء', fr: 'Dar El Beïda' },
      communeName: profile.communeName || { ar: 'باب الزوار', fr: 'Bab Ezzouar' },
      address: profile.address || 'Cité 5 Juillet, Local N°14',
      commercialId: profile.commercialId || 'comm-01',
      commercialCode: profile.commercialCode || 'D01',
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedAt: profile.approvedAt,
      approvedBy: profile.approvedBy,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!isDemoMode || !user) return;
    // Security check: Customer cannot modify priceTier, status, or commercial link!
    const filteredUpdates = { ...updates };
    if (user.role !== 'admin') {
      delete filteredUpdates.priceTier;
      delete filteredUpdates.status;
      delete filteredUpdates.commercialId;
      delete filteredUpdates.commercialCode;
      delete filteredUpdates.role;
    }
    setUser({ ...user, ...filteredUpdates, updatedAt: new Date().toISOString() });
  };

  const role: Role = user ? user.role : 'visitor';
  const status: AccountStatus | 'guest' = user ? user.status : 'guest';
  const priceTier: PriceTier | null = user ? user.priceTier : null;
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const isApproved = user?.status === 'approved';
  const isPending = user?.status === 'pending';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        status,
        priceTier,
        isAuthenticated,
        isAdmin,
        isApproved,
        isPending,
        loginAs,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
