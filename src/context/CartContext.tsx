import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PriceTier } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    cartons: number,
    units: number,
    cartonPrice: number,
    unitPrice: number,
    priceSource: 'CUSTOM' | 'TIER'
  ) => { success: boolean; error?: string };
  updateItemQuantity: (
    productId: string,
    cartons: number,
    units: number
  ) => { success: boolean; error?: string };
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalCartonsCount: number;
  totalUnitsCount: number;
  itemsSubtotal: number;
  itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('selsabil_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('selsabil_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (
    product: Product,
    cartons: number,
    units: number,
    cartonPrice: number,
    unitPrice: number,
    priceSource: 'CUSTOM' | 'TIER'
  ) => {
    const totalUnitsRequested = cartons * product.unitsPerCarton + units;

    if (totalUnitsRequested <= 0) {
      return { success: false, error: 'الكمية المطلوبة يجب أن تكون أكبر من الصفر' };
    }

    if (totalUnitsRequested > product.totalUnitsInStock) {
      return {
        success: false,
        error: `الكمية المطلوبة (${totalUnitsRequested} حبة) تتجاوز المخزون المتوفر (${product.totalUnitsInStock} حبة)`,
      };
    }

    const lineTotal = cartons * cartonPrice + units * unitPrice;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          product,
          cartonsQuantity: cartons,
          unitsQuantity: units,
          totalUnits: totalUnitsRequested,
          appliedCartonPrice: cartonPrice,
          appliedUnitPrice: unitPrice,
          priceSource,
          lineTotal,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            cartonsQuantity: cartons,
            unitsQuantity: units,
            totalUnits: totalUnitsRequested,
            appliedCartonPrice: cartonPrice,
            appliedUnitPrice: unitPrice,
            priceSource,
            lineTotal,
          },
        ];
      }
    });

    return { success: true };
  };

  const updateItemQuantity = (productId: string, cartons: number, units: number) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return { success: false, error: 'المنتج غير موجود في السلة' };

    const totalUnitsRequested = cartons * item.product.unitsPerCarton + units;

    if (totalUnitsRequested <= 0) {
      removeItem(productId);
      return { success: true };
    }

    if (totalUnitsRequested > item.product.totalUnitsInStock) {
      return {
        success: false,
        error: `المخزون المتوفر هو ${item.product.totalUnitsInStock} حبة فقط`,
      };
    }

    const lineTotal = cartons * item.appliedCartonPrice + units * item.appliedUnitPrice;

    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? {
              ...i,
              cartonsQuantity: cartons,
              unitsQuantity: units,
              totalUnits: totalUnitsRequested,
              lineTotal,
            }
          : i
      )
    );

    return { success: true };
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCartonsCount = items.reduce((sum, item) => sum + item.cartonsQuantity, 0);
  const totalUnitsCount = items.reduce((sum, item) => sum + item.unitsQuantity, 0);
  const itemsSubtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemsCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        totalCartonsCount,
        totalUnitsCount,
        itemsSubtotal,
        itemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
