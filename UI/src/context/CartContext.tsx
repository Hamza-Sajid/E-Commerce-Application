import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  totalCartItem: number;
  setTotalCartItem: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [totalCartItem, setTotalCartItem] = useState(0);

  return (
    <CartContext.Provider value={{ totalCartItem, setTotalCartItem }}>
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCartContext };
