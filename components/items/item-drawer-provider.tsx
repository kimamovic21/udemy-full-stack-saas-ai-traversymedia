"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ItemDetail } from "@/lib/db/items";

interface ItemDrawerContextValue {
  isOpen: boolean;
  item: ItemDetail | null;
  isLoading: boolean;
  openDrawer: (itemId: string) => void;
  closeDrawer: () => void;
}

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function useItemDrawer() {
  const context = useContext(ItemDrawerContext);
  if (!context) {
    throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  }
  return context;
}

export default function ItemDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openDrawer = useCallback(async (itemId: string) => {
    setIsOpen(true);
    setIsLoading(true);
    setItem(null);

    try {
      const res = await fetch(`/api/items/${itemId}`);
      const json = await res.json();

      if (json.success && json.data) {
        setItem(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch item:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setItem(null);
  }, []);

  return (
    <ItemDrawerContext.Provider
      value={{ isOpen, item, isLoading, openDrawer, closeDrawer }}
    >
      {children}
    </ItemDrawerContext.Provider>
  );
}
