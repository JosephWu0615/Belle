export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skinType?: string;
  primaryGoal?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  barcode?: string;
  image?: string;
  addedAt: Date;
}

export interface SkinAnalysis {
  overallScore: number;
  metrics: {
    hydration: number;
    oiliness: number;
    sensitivity: number;
    poreSize: number;
    wrinkles: number;
    darkSpots: number;
  };
  recommendations: string[];
  timestamp: string;
}

export interface SkinRecord {
  id: string;
  date: Date;
  photo: string;
  products: string[];
  analysis?: SkinAnalysis;
  type: 'daily';
}

export interface MedicalRecord {
  id: string;
  date: Date;
  treatment: string;
  clinic: string;
  doctor: string;
  price: number;
  rating: number;
  notes: string;
  photos: string[];
  type: 'medical';
}

export interface ProductRecord {
  id: string;
  date: Date;
  productId: string;
  feelings: string[];
  notes: string;
  photos: string[];
  type: 'product';
}

export type Record = SkinRecord | MedicalRecord | ProductRecord;

export interface WeeklyReport {
  id: string;
  weekStartDate: Date;
  improvements: string[];
  concerns: string[];
  productEffectiveness: { [productId: string]: number };
  weeklyTrend: number[];
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

// New interfaces for photo storage and enhanced features
export interface Photo {
  id: string;
  uri: string;  // Original photo URI from camera
  takenAt: Date;
  lightQuality: 'excellent' | 'good' | 'poor';
  faceDetected: boolean;
  analysisId?: string;
  // Storage paths
  paths: {
    original: string;    // Full resolution for AI analysis
    compressed: string;  // 80% quality, max 1080p for display
    thumbnail: string;   // 150x150px for calendar view
  };
  metadata: {
    fileSize: number;    // In bytes
    dimensions: { width: number; height: number };
    format: 'jpeg' | 'png';
    compressionRatio?: number;  // Original size / compressed size
  };
}

export interface DailyPhotoRecord {
  id: string;
  date: Date;
  photoId: string;
  analysisId: string;
  userId: string;
}

export interface AIAnalysisReport {
  id: string;
  photoId: string;
  userId: string;
  createdAt: Date;
  scores: {
    overall: number;
    hydration: number;
    elasticity: number;
    pores: number;
    texture: number;
    radiance: number;
  };
  insights: {
    category: string;
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'success';
    recommendations: string[];
  }[];
  detectedIssues: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
    confidence: number;
  }[];
  comparisonWithLast: {
    overall: number;
    hydration: number;
    elasticity: number;
    pores: number;
    texture: number;
    radiance: number;
  };
}

export interface ProductRecommendation {
  productId: string;
  reason: string;
  matchScore: number;
}

export interface FacialAnalysis {
  faceShape: string;
  eyeShape: string;
  features: { [key: string]: string };
}

export interface CelebrityMatch {
  name: string;
  similarity: number;
  imageUrl: string;
}

export interface ComparisonAnalysis {
  photo1Id: string;
  photo2Id: string;
  improvements: string[];
  deteriorations: string[];
  overallChange: number;
}

export interface AchievementType {
  id: string;
  category: 'daily' | 'improvement' | 'milestone';
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'streak' | 'count' | 'improvement';
    target: number;
    metric?: string;
  };
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

export interface StorageStats {
  totalSizeMB: number;
  fileCount: number;
  averageSizeMB: number;
  remainingMB: number;
}