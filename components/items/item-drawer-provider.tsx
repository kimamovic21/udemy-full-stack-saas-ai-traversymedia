"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { ItemDetail } from "@/lib/db/items";

interface ItemDrawerContextType {
  isOpen: boolean;
  itemId: string | null;
  item: ItemDetail | null;
  isLoading: boolean;
  openDrawer: (itemId: string) => void;
  closeDrawer: () => void;
  setIsLoading: (loading: boolean) => void;
  setItem: (item: ItemDetail | null) => void;
}

const ItemDrawerContext = createContext<ItemDrawerContextType | undefined>(
  undefined,
);

export function ItemDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openDrawer = (id: string) => {
    setItemId(id);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Delay clearing the item to allow animation
    setTimeout(() => {
      setItem(null);
      setItemId(null);
    }, 300);
  };

  const value: ItemDrawerContextType = {
    isOpen,
    itemId,
    item,
    isLoading,
    openDrawer,
    closeDrawer,
    setIsLoading,
    setItem,
  };

  return (
    <ItemDrawerContext.Provider value={value}>
      {children}
    </ItemDrawerContext.Provider>
  );
}

export function useItemDrawer() {
  const context = useContext(ItemDrawerContext);
  if (context === undefined) {
    throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  }
  return context;
}
