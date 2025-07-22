import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface UserStore {
  user: User | null;
  isOnboarded: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setOnboarded: (value: boolean) => void;
  logout: () => void;
  loadUserData: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isOnboarded: false,
  isLoading: true,

  setUser: (user) => {
    set({ user });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  setOnboarded: (value) => {
    set({ isOnboarded: value });
    AsyncStorage.setItem('isOnboarded', JSON.stringify(value));
  },

  logout: () => {
    set({ user: null, isOnboarded: false });
    AsyncStorage.multiRemove(['user', 'isOnboarded']);
  },

  loadUserData: async () => {
    try {
      const [userStr, onboardedStr] = await AsyncStorage.multiGet(['user', 'isOnboarded']);
      
      if (userStr[1]) {
        set({ user: JSON.parse(userStr[1]) });
      }
      
      if (onboardedStr[1]) {
        set({ isOnboarded: JSON.parse(onboardedStr[1]) });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));