import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AchievementType, UserAchievement } from '../types';

interface AchievementStore {
  achievementTypes: AchievementType[];
  userAchievements: UserAchievement[];
  isLoading: boolean;
  
  // Achievement management
  unlockAchievement: (userId: string, achievementId: string) => Promise<void>;
  updateProgress: (userId: string, achievementId: string, progress: number) => Promise<void>;
  getUserAchievements: (userId: string) => UserAchievement[];
  getAchievementProgress: (userId: string, achievementId: string) => number;
  
  // Check achievements
  checkDailyStreak: (userId: string, consecutiveDays: number) => Promise<void>;
  checkPhotoCount: (userId: string, photoCount: number) => Promise<void>;
  checkSkinImprovement: (userId: string, improvementScore: number) => Promise<void>;
  
  // Persistence
  loadAchievements: () => Promise<void>;
  saveAchievements: () => Promise<void>;
}

// Default achievement types
const defaultAchievementTypes: AchievementType[] = [
  {
    id: 'first_photo',
    category: 'milestone',
    name: '第一步',
    description: '拍摄您的第一张照片',
    icon: '📸',
    requirement: { type: 'count', target: 1 },
  },
  {
    id: 'week_streak',
    category: 'daily',
    name: '坚持一周',
    description: '连续7天记录',
    icon: '🔥',
    requirement: { type: 'streak', target: 7 },
  },
  {
    id: 'month_streak',
    category: 'daily',
    name: '月度达人',
    description: '连续30天记录',
    icon: '⭐',
    requirement: { type: 'streak', target: 30 },
  },
  {
    id: 'skin_improvement_10',
    category: 'improvement',
    name: '初见成效',
    description: '皮肤评分提升10分',
    icon: '✨',
    requirement: { type: 'improvement', target: 10, metric: 'overallScore' },
  },
  {
    id: 'photo_milestone_10',
    category: 'milestone',
    name: '记录达人',
    description: '拍摄10张照片',
    icon: '🎯',
    requirement: { type: 'count', target: 10 },
  },
  {
    id: 'photo_milestone_50',
    category: 'milestone',
    name: '美肤专家',
    description: '拍摄50张照片',
    icon: '🏆',
    requirement: { type: 'count', target: 50 },
  },
  {
    id: 'photo_milestone_100',
    category: 'milestone',
    name: '百日挑战',
    description: '拍摄100张照片',
    icon: '👑',
    requirement: { type: 'count', target: 100 },
  },
];

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  achievementTypes: defaultAchievementTypes,
  userAchievements: [],
  isLoading: false,

  unlockAchievement: async (userId, achievementId) => {
    const existingAchievement = get().userAchievements.find(
      a => a.userId === userId && a.achievementId === achievementId
    );
    
    if (!existingAchievement) {
      const newAchievement: UserAchievement = {
        userId,
        achievementId,
        unlockedAt: new Date(),
        progress: 100,
      };
      
      const userAchievements = [...get().userAchievements, newAchievement];
      set({ userAchievements });
      await get().saveAchievements();
      
      // TODO: Trigger celebration animation and notification
    }
  },

  updateProgress: async (userId, achievementId, progress) => {
    const userAchievements = get().userAchievements.map(achievement => {
      if (achievement.userId === userId && achievement.achievementId === achievementId) {
        return { ...achievement, progress };
      }
      return achievement;
    });
    
    // If achievement doesn't exist yet, create it
    const exists = userAchievements.some(
      a => a.userId === userId && a.achievementId === achievementId
    );
    
    if (!exists) {
      userAchievements.push({
        userId,
        achievementId,
        unlockedAt: new Date(),
        progress,
      });
    }
    
    set({ userAchievements });
    
    // Check if achievement is completed
    const achievementType = get().achievementTypes.find(a => a.id === achievementId);
    if (achievementType && progress >= achievementType.requirement.target) {
      await get().unlockAchievement(userId, achievementId);
    } else {
      await get().saveAchievements();
    }
  },

  getUserAchievements: (userId) => {
    return get().userAchievements.filter(a => a.userId === userId);
  },

  getAchievementProgress: (userId, achievementId) => {
    const achievement = get().userAchievements.find(
      a => a.userId === userId && a.achievementId === achievementId
    );
    return achievement?.progress || 0;
  },

  checkDailyStreak: async (userId, consecutiveDays) => {
    // Check week streak
    if (consecutiveDays >= 7) {
      await get().updateProgress(userId, 'week_streak', consecutiveDays);
    }
    
    // Check month streak
    if (consecutiveDays >= 30) {
      await get().updateProgress(userId, 'month_streak', consecutiveDays);
    }
  },

  checkPhotoCount: async (userId, photoCount) => {
    // Check first photo
    if (photoCount >= 1) {
      await get().updateProgress(userId, 'first_photo', photoCount);
    }
    
    // Check 10 photos
    if (photoCount >= 10) {
      await get().updateProgress(userId, 'photo_milestone_10', photoCount);
    }
    
    // Check 50 photos
    if (photoCount >= 50) {
      await get().updateProgress(userId, 'photo_milestone_50', photoCount);
    }
    
    // Check 100 photos
    if (photoCount >= 100) {
      await get().updateProgress(userId, 'photo_milestone_100', photoCount);
    }
  },

  checkSkinImprovement: async (userId, improvementScore) => {
    if (improvementScore >= 10) {
      await get().updateProgress(userId, 'skin_improvement_10', improvementScore);
    }
  },

  loadAchievements: async () => {
    set({ isLoading: true });
    try {
      const achievementsJson = await AsyncStorage.getItem('userAchievements');
      
      if (achievementsJson) {
        const achievements = JSON.parse(achievementsJson);
        // Convert date strings back to Date objects
        achievements.forEach((achievement: UserAchievement) => {
          achievement.unlockedAt = new Date(achievement.unlockedAt);
        });
        
        set({ userAchievements: achievements });
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveAchievements: async () => {
    try {
      await AsyncStorage.setItem(
        'userAchievements',
        JSON.stringify(get().userAchievements)
      );
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  },
}));