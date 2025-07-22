import { Photo } from '../types';
import { format } from 'date-fns';

export class TestDataGenerator {
  private static photoIdCounter = 1;
  private static analysisIdCounter = 1;

  static generateMockPhoto(options?: {
    date?: Date;
    lightQuality?: 'poor' | 'good' | 'excellent';
    score?: number;
  }): Photo {
    const date = options?.date || new Date();
    const lightQuality = options?.lightQuality || this.randomLightQuality();
    const score = options?.score || this.randomScore(lightQuality);
    
    const colors = {
      excellent: '4CAF50',
      good: 'FFC107', 
      poor: 'F44336'
    };
    
    const color = colors[lightQuality];
    const timeStr = format(date, 'HH:mm:ss');
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const photoId = `photo-test-${this.photoIdCounter++}`;
    const uri = `https://via.placeholder.com/400x400/${color}/FFFFFF?text=${dateStr}%20${timeStr}%20Score:${score}`;
    
    return {
      id: photoId,
      uri,
      takenAt: date,
      lightQuality,
      faceDetected: true,
      paths: {
        original: uri,
        compressed: uri,
        thumbnail: uri,
      },
      metadata: {
        fileSize: 1024 * 1024 * (1 + Math.random() * 2),
        dimensions: { width: 400, height: 400 },
        format: 'jpeg',
        compressionRatio: 0.85,
      },
      analysisId: `analysis-${this.analysisIdCounter++}`,
    };
  }

  static generateMultiplePhotos(count: number, startDate?: Date): Photo[] {
    const photos: Photo[] = [];
    const baseDate = startDate || new Date();
    
    for (let i = 0; i < count; i++) {
      // Generate photos with dates going backwards
      const photoDate = new Date(baseDate);
      photoDate.setDate(photoDate.getDate() - i);
      photoDate.setHours(Math.floor(Math.random() * 24));
      photoDate.setMinutes(Math.floor(Math.random() * 60));
      
      photos.push(this.generateMockPhoto({ date: photoDate }));
    }
    
    return photos;
  }

  static generateProgressionPhotos(count: number = 7): Photo[] {
    const photos: Photo[] = [];
    const baseDate = new Date();
    const baseScore = 70;
    
    for (let i = 0; i < count; i++) {
      const photoDate = new Date(baseDate);
      photoDate.setDate(photoDate.getDate() - (count - 1 - i));
      
      // Simulate gradual improvement
      const score = Math.min(90, baseScore + (i * 3) + Math.random() * 2);
      const lightQuality = score > 85 ? 'excellent' : score > 75 ? 'good' : 'poor';
      
      photos.push(this.generateMockPhoto({ 
        date: photoDate,
        lightQuality,
        score: Math.round(score)
      }));
    }
    
    return photos;
  }

  private static randomLightQuality(): 'poor' | 'good' | 'excellent' {
    const rand = Math.random();
    if (rand < 0.2) return 'poor';
    if (rand < 0.7) return 'good';
    return 'excellent';
  }

  private static randomScore(lightQuality: 'poor' | 'good' | 'excellent'): number {
    const baseScores = {
      excellent: 85,
      good: 75,
      poor: 65
    };
    
    const baseScore = baseScores[lightQuality];
    const variation = Math.floor(Math.random() * 10);
    
    return baseScore + variation;
  }

  static generateAnalysisReport(photoId: string) {
    const overall = 70 + Math.floor(Math.random() * 20);
    
    return {
      id: `analysis-${photoId}`,
      photoId,
      analyzedAt: new Date(),
      scores: {
        overall,
        hydration: 60 + Math.floor(Math.random() * 30),
        elasticity: 60 + Math.floor(Math.random() * 30),
        pores: 60 + Math.floor(Math.random() * 30),
        texture: 60 + Math.floor(Math.random() * 30),
        radiance: 60 + Math.floor(Math.random() * 30),
      },
      insights: [
        {
          category: 'hydration',
          title: '肌肤水分状态',
          description: '您的肌肤水分含量处于正常范围，建议继续保持当前的护肤习惯。',
          severity: 'success' as const,
          recommendations: [
            '每天饮用8杯水',
            '使用保湿精华液',
            '避免过度清洁'
          ]
        },
        {
          category: 'elasticity',
          title: '肌肤弹性分析',
          description: '肌肤弹性良好，胶原蛋白含量正常。',
          severity: 'info' as const,
          recommendations: [
            '坚持使用含维C的护肤品',
            '适当进行面部按摩',
            '保证充足睡眠'
          ]
        }
      ],
      comparisonWithLast: {
        overall: Math.floor(Math.random() * 10) - 5,
        hydration: Math.floor(Math.random() * 10) - 5,
        elasticity: Math.floor(Math.random() * 10) - 5,
        pores: Math.floor(Math.random() * 10) - 5,
        texture: Math.floor(Math.random() * 10) - 5,
        radiance: Math.floor(Math.random() * 10) - 5,
      }
    };
  }

  static generateRecommendations(analysisId: string) {
    return {
      analysisId,
      products: [
        {
          category: '保湿精华',
          name: '玻尿酸保湿精华',
          description: '深层补水，改善肌肤干燥',
          keyIngredients: ['玻尿酸', '维生素B5', '甘油'],
          usage: '早晚洁面后使用，取2-3滴均匀涂抹全脸'
        },
        {
          category: '防晒霜',
          name: '清爽防晒乳',
          description: 'SPF50+ PA++++，防护紫外线伤害',
          keyIngredients: ['氧化锌', '二氧化钛', '积雪草提取物'],
          usage: '日间护肤最后一步，出门前15分钟涂抹'
        }
      ],
      routines: {
        morning: [
          '温和洁面',
          '爽肤水',
          '精华液',
          '乳液',
          '防晒霜'
        ],
        evening: [
          '卸妆',
          '洁面',
          '爽肤水', 
          '精华液',
          '晚霜'
        ]
      },
      lifestyle: [
        '保证每天8小时睡眠',
        '多喝水，保持水分摄入',
        '避免熬夜和过度压力',
        '定期运动，促进血液循环'
      ]
    };
  }
}