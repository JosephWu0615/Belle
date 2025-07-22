import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Photo, StorageStats } from '../types';

interface PhotoStore {
  photos: Map<string, Photo>;
  totalStorageUsed: number;
  isLoading: boolean;
  
  // Photo management
  addPhoto: (photo: Photo) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  getPhoto: (photoId: string) => Photo | undefined;
  updatePhoto: (photoId: string, updates: Partial<Photo>) => Promise<void>;
  
  // Query methods
  getPhotosByDateRange: (start: Date, end: Date) => Photo[];
  getPhotosByDate: (date: Date) => Photo[];
  getRecentPhotos: (limit: number) => Photo[];
  
  // Storage management
  cleanupOldPhotos: () => Promise<number>;
  getStorageStats: () => StorageStats;
  updateStorageUsed: (bytes: number) => void;
  
  // Persistence
  loadPhotos: () => Promise<void>;
  savePhotosToStorage: () => Promise<void>;
}

export const usePhotoStore = create<PhotoStore>((set, get) => ({
  photos: new Map(),
  totalStorageUsed: 0,
  isLoading: false,

  addPhoto: async (photo) => {
    const photos = new Map(get().photos);
    photos.set(photo.id, photo);
    
    const totalStorageUsed = get().totalStorageUsed + photo.metadata.fileSize;
    
    set({ photos, totalStorageUsed });
    await get().savePhotosToStorage();
  },

  deletePhoto: async (photoId) => {
    const photos = new Map(get().photos);
    const photo = photos.get(photoId);
    
    if (photo) {
      const totalStorageUsed = get().totalStorageUsed - photo.metadata.fileSize;
      photos.delete(photoId);
      set({ photos, totalStorageUsed });
      await get().savePhotosToStorage();
    }
  },

  getPhoto: (photoId) => {
    return get().photos.get(photoId);
  },

  updatePhoto: async (photoId, updates) => {
    const photos = new Map(get().photos);
    const photo = photos.get(photoId);
    
    if (photo) {
      photos.set(photoId, { ...photo, ...updates });
      set({ photos });
      await get().savePhotosToStorage();
    }
  },

  getPhotosByDateRange: (start, end) => {
    const photos = Array.from(get().photos.values());
    return photos.filter(photo => {
      const photoDate = new Date(photo.takenAt);
      return photoDate >= start && photoDate <= end;
    }).sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime());
  },

  getPhotosByDate: (date) => {
    const photos = Array.from(get().photos.values());
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    return photos.filter(photo => {
      const photoDate = new Date(photo.takenAt);
      return photoDate >= targetDate && photoDate < nextDate;
    }).sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime());
  },

  getRecentPhotos: (limit) => {
    const photos = Array.from(get().photos.values());
    return photos
      .sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime())
      .slice(0, limit);
  },

  cleanupOldPhotos: async () => {
    const photos = new Map(get().photos);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    let freedBytes = 0;
    const photosToDelete: string[] = [];
    
    photos.forEach((photo, id) => {
      if (photo.takenAt < sixMonthsAgo) {
        freedBytes += photo.metadata.fileSize;
        photosToDelete.push(id);
      }
    });
    
    photosToDelete.forEach(id => photos.delete(id));
    
    const totalStorageUsed = get().totalStorageUsed - freedBytes;
    set({ photos, totalStorageUsed });
    await get().savePhotosToStorage();
    
    return freedBytes;
  },

  getStorageStats: () => {
    const photos = Array.from(get().photos.values());
    const totalSizeMB = get().totalStorageUsed / (1024 * 1024);
    const fileCount = photos.length;
    const averageSizeMB = fileCount > 0 ? totalSizeMB / fileCount : 0;
    const remainingMB = 500 - totalSizeMB; // 500MB limit
    
    return {
      totalSizeMB,
      fileCount,
      averageSizeMB,
      remainingMB,
    };
  },

  updateStorageUsed: (bytes) => {
    set({ totalStorageUsed: get().totalStorageUsed + bytes });
  },

  loadPhotos: async () => {
    set({ isLoading: true });
    try {
      const photosJson = await AsyncStorage.getItem('photos');
      const storageUsed = await AsyncStorage.getItem('totalStorageUsed');
      
      if (photosJson) {
        const photosArray = JSON.parse(photosJson);
        const photos = new Map<string, Photo>();
        
        photosArray.forEach((photo: Photo) => {
          // Convert date strings back to Date objects
          photo.takenAt = new Date(photo.takenAt);
          photos.set(photo.id, photo);
        });
        
        set({ 
          photos,
          totalStorageUsed: storageUsed ? parseInt(storageUsed) : 0,
        });
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  savePhotosToStorage: async () => {
    try {
      const photosArray = Array.from(get().photos.values());
      await AsyncStorage.setItem('photos', JSON.stringify(photosArray));
      await AsyncStorage.setItem('totalStorageUsed', get().totalStorageUsed.toString());
    } catch (error) {
      console.error('Failed to save photos:', error);
    }
  },
}));