"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type BasketItem = { id: string; name: string; price: number; quantity: number };

// 1. Updated the type definition to include setBasket
const BasketContext = createContext<{
  basket: BasketItem[];
  setBasket: React.Dispatch<React.SetStateAction<BasketItem[]>>; // Added this
  addToBasket: (item: any) => void;
  removeFromBasket: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  itemCount: number;
} | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // LOAD: Pull from localStorage on initial render
  useEffect(() => {
    const savedBasket = localStorage.getItem("user_basket");
    if (savedBasket) {
      try {
        setBasket(JSON.parse(savedBasket));
      } catch (e) {
        console.error("Failed to parse basket", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // SAVE: Push to localStorage every time the basket changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("user_basket", JSON.stringify(basket));
    }
  }, [basket, isLoaded]);

  const addToBasket = (product: any) => {
    setBasket((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromBasket = (id: string) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setBasket((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const itemCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  return (
    // 2. Included setBasket in the Provider value
    <BasketContext.Provider value={{ basket, setBasket, addToBasket, removeFromBasket, updateQuantity, itemCount }}>
      {children}
    </BasketContext.Provider>
  );
}

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used within BasketProvider");
  return context;
};