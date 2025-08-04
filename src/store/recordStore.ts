import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Record } from '../types';
import { format } from 'date-fns';

interface RecordStore {
  records: Record[];
  isLoading: boolean;
  addRecord: (record: Record) => Promise<void>;
  getRecordsByDate: (date: Date) => Record[];
  getRecordsByType: (type: 'daily' | 'medical' | 'product') => Record[];
  loadRecords: () => Promise<void>;
}

export const useRecordStore = create<RecordStore>((set, get) => ({
  records: [],
  isLoading: false,

  addRecord: async (record) => {
    const updatedRecords = [...get().records, record];
    set({ records: updatedRecords });
    await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));
  },

  getRecordsByDate: (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return get().records.filter(record => 
      format(new Date(record.date), 'yyyy-MM-dd') === dateStr
    );
  },

  getRecordsByType: (type) => {
    return get().records.filter(record => record.type === type);
  },

  loadRecords: async () => {
    set({ isLoading: true });
    try {
      const recordsStr = await AsyncStorage.getItem('records');
      if (recordsStr) {
        set({ records: JSON.parse(recordsStr) });
      }
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));