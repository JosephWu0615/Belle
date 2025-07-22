import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { Photo } from '../types';
import uuid from 'react-native-uuid';

export class PhotoStorage {
  static readonly BASE_DIR = `${RNFS.DocumentDirectoryPath}/photos`;
  static readonly MAX_STORAGE_MB = 500;
  static readonly CLEANUP_AGE_MONTHS = 6;
  
  static readonly COMPRESSION_SETTINGS = {
    original: { quality: 100, maxWidth: 4096, maxHeight: 4096 },
    compressed: { quality: 85, maxWidth: 1920, maxHeight: 1920 },
    thumbnail: { quality: 70, maxWidth: 200, maxHeight: 200 },
  };

  static async init(): Promise<void> {
    try {
      const dirExists = await RNFS.exists(this.BASE_DIR);
      if (!dirExists) {
        await RNFS.mkdir(this.BASE_DIR);
      }
      
      // Create subdirectories
      const subdirs = ['original', 'compressed', 'thumbnail'];
      for (const subdir of subdirs) {
        const path = `${this.BASE_DIR}/${subdir}`;
        const exists = await RNFS.exists(path);
        if (!exists) {
          await RNFS.mkdir(path);
        }
      }
    } catch (error) {
      console.error('Failed to initialize photo storage:', error);
      throw error;
    }
  }

  static async savePhoto(photoUri: string, userId: string): Promise<Photo> {
    try {
      const photoId = uuid.v4() as string;
      const timestamp = new Date();
      
      // Create file names
      const baseName = `${userId}_${photoId}_${timestamp.getTime()}`;
      const paths = {
        original: `${this.BASE_DIR}/original/${baseName}_original.jpg`,
        compressed: `${this.BASE_DIR}/compressed/${baseName}_compressed.jpg`,
        thumbnail: `${this.BASE_DIR}/thumbnail/${baseName}_thumb.jpg`,
      };
      
      // Copy original
      await RNFS.copyFile(photoUri, paths.original);
      
      // Create compressed version
      const compressed = await ImageResizer.createResizedImage(
        photoUri,
        this.COMPRESSION_SETTINGS.compressed.maxWidth,
        this.COMPRESSION_SETTINGS.compressed.maxHeight,
        'JPEG',
        this.COMPRESSION_SETTINGS.compressed.quality,
        0,
        undefined,
        false,
        { mode: 'contain' }
      );
      await RNFS.moveFile(compressed.uri, paths.compressed);
      
      // Create thumbnail
      const thumbnail = await ImageResizer.createResizedImage(
        photoUri,
        this.COMPRESSION_SETTINGS.thumbnail.maxWidth,
        this.COMPRESSION_SETTINGS.thumbnail.maxHeight,
        'JPEG',
        this.COMPRESSION_SETTINGS.thumbnail.quality,
        0,
        undefined,
        false,
        { mode: 'cover' }
      );
      await RNFS.moveFile(thumbnail.uri, paths.thumbnail);
      
      // Get file stats
      const originalStats = await RNFS.stat(paths.original);
      const compressedStats = await RNFS.stat(paths.compressed);
      
      // Simulate light quality detection (in real app, would use image analysis)
      const lightQuality = this.detectLightQuality();
      
      // Create photo object
      const photo: Photo = {
        id: photoId,
        uri: paths.compressed, // Default to compressed for display
        takenAt: timestamp,
        lightQuality,
        faceDetected: Math.random() > 0.2, // Mock face detection
        paths,
        metadata: {
          fileSize: parseInt(originalStats.size.toString()),
          dimensions: {
            width: compressed.width || 1920,
            height: compressed.height || 1920,
          },
          format: 'jpeg',
          compressionRatio: parseInt(compressedStats.size.toString()) / parseInt(originalStats.size.toString()),
        },
      };
      
      return photo;
    } catch (error) {
      console.error('Failed to save photo:', error);
      throw error;
    }
  }

  static async deletePhoto(photo: Photo): Promise<void> {
    try {
      const paths = [photo.paths.original, photo.paths.compressed, photo.paths.thumbnail];
      
      for (const path of paths) {
        const exists = await RNFS.exists(path);
        if (exists) {
          await RNFS.unlink(path);
        }
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
      throw error;
    }
  }

  static async getStorageInfo(): Promise<{
    totalUsed: number;
    available: number;
    photoCount: number;
  }> {
    try {
      const files = await RNFS.readDir(`${this.BASE_DIR}/original`);
      
      let totalUsed = 0;
      for (const file of files) {
        totalUsed += parseInt(file.size.toString());
      }
      
      const diskInfo = await RNFS.getFSInfo();
      
      return {
        totalUsed,
        available: diskInfo.freeSpace,
        photoCount: files.length,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        totalUsed: 0,
        available: 0,
        photoCount: 0,
      };
    }
  }

  static async cleanupOldPhotos(): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - this.CLEANUP_AGE_MONTHS);
      
      const subdirs = ['original', 'compressed', 'thumbnail'];
      let totalFreed = 0;
      let filesDeleted = 0;
      
      for (const subdir of subdirs) {
        const files = await RNFS.readDir(`${this.BASE_DIR}/${subdir}`);
        
        for (const file of files) {
          const fileDate = new Date(file.mtime || 0);
          if (fileDate < cutoffDate) {
            totalFreed += parseInt(file.size.toString());
            await RNFS.unlink(file.path);
            filesDeleted++;
          }
        }
      }
      
      console.log(`Cleanup completed: ${filesDeleted} files deleted, ${totalFreed / (1024 * 1024)}MB freed`);
      return totalFreed;
    } catch (error) {
      console.error('Failed to cleanup old photos:', error);
      return 0;
    }
  }

  static async checkStorageLimit(): Promise<boolean> {
    const info = await this.getStorageInfo();
    const usedMB = info.totalUsed / (1024 * 1024);
    return usedMB < this.MAX_STORAGE_MB;
  }

  private static detectLightQuality(): 'excellent' | 'good' | 'poor' {
    // Mock light quality detection
    // In real app, would analyze image brightness/histogram
    const random = Math.random();
    if (random > 0.7) return 'excellent';
    if (random > 0.3) return 'good';
    return 'poor';
  }

  static async exportPhoto(photo: Photo, exportPath: string): Promise<void> {
    try {
      await RNFS.copyFile(photo.paths.original, exportPath);
    } catch (error) {
      console.error('Failed to export photo:', error);
      throw error;
    }
  }

  static async getPhotoUri(photo: Photo, quality: 'original' | 'compressed' | 'thumbnail' = 'compressed'): Promise<string> {
    const path = photo.paths[quality];
    const exists = await RNFS.exists(path);
    
    if (!exists) {
      throw new Error(`Photo file not found: ${path}`);
    }
    
    // On iOS, we need to use file:// prefix
    return `file://${path}`;
  }
}