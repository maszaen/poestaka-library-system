"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Anggota } from "@/lib/types";

interface BorrowFormState {
  member: Anggota | null;
  itemBarcodes: string[];
}

interface BorrowFormContextType {
  formState: BorrowFormState;
  setMember: (member: Anggota | null) => void;
  setItemBarcodes: (barcodes: string[]) => void;
  addBarcode: (barcode: string) => void;
  removeBarcode: (barcode: string) => void;
  resetForm: () => void;
}

const defaultState: BorrowFormState = {
  member: null,
  itemBarcodes: [],
};

const BorrowFormContext = createContext<BorrowFormContextType | undefined>(undefined);

export function BorrowFormProvider({ children }: { children: ReactNode }) {
  const [formState, setFormState] = useState<BorrowFormState>(defaultState);

  const setMember = (member: Anggota | null) => {
    setFormState((prev) => ({ ...prev, member }));
  };

  const setItemBarcodes = (itemBarcodes: string[]) => {
    setFormState((prev) => ({ ...prev, itemBarcodes }));
  };

  const addBarcode = (barcode: string) => {
    setFormState((prev) => {
      if (prev.itemBarcodes.includes(barcode)) return prev;
      return { ...prev, itemBarcodes: [...prev.itemBarcodes, barcode] };
    });
  };

  const removeBarcode = (barcode: string) => {
    setFormState((prev) => ({
      ...prev,
      itemBarcodes: prev.itemBarcodes.filter((b) => b !== barcode),
    }));
  };

  const resetForm = () => {
    setFormState(defaultState);
  };

  return (
    <BorrowFormContext.Provider
      value={{
        formState,
        setMember,
        setItemBarcodes,
        addBarcode,
        removeBarcode,
        resetForm,
      }}
    >
      {children}
    </BorrowFormContext.Provider>
  );
}

export function useBorrowForm() {
  const context = useContext(BorrowFormContext);
  if (!context) {
    throw new Error("useBorrowForm must be used within BorrowFormProvider");
  }
  return context;
}
