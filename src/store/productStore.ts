import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  loadProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,

  addProduct: async (product) => {
    const updatedProducts = [...get().products, product];
    set({ products: updatedProducts });
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  },

  removeProduct: async (productId) => {
    const updatedProducts = get().products.filter(p => p.id !== productId);
    set({ products: updatedProducts });
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  },

  updateProduct: async (productId, updates) => {
    const updatedProducts = get().products.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    );
    set({ products: updatedProducts });
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  },

  loadProducts: async () => {
    set({ isLoading: true });
    try {
      const productsStr = await AsyncStorage.getItem('products');
      if (productsStr) {
        set({ products: JSON.parse(productsStr) });
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));