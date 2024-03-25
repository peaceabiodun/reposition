'use client';

import React, { ReactNode, useState, createContext, useContext } from 'react';
import { ProductDetailType } from '@/utils/types';

type ProductContextType = {
  products: ProductDetailType[];
  setProducts: (item: ProductDetailType[]) => void;
};

export const ProductContext = createContext({} as ProductContextType);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductDetailType[]>([]);
  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
