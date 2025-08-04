import { AIAnalysisReport, Photo, Treatment } from '../types';

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random score with slight variations
const generateScore = (base: number, variance: number = 5): number => {
  const min = Math.max(0, base - variance);
  const max = Math.min(100, base + variance);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate skin analysis report
export const mockAnalyzeSkin = async (photoId: string): Promise<AIAnalysisReport> => {
  await delay(2000); // Simulate API processing time
  
  const baseScores = {
    overall: 75,
    hydration: 70,
    elasticity: 80,
    pores: 65,
    texture: 72,
    radiance: 78,
  };
  
  const report: AIAnalysisReport = {
    id: `analysis_${Date.now()}`,
    photoId,
    userId: 'user123',
    createdAt: new Date(),
    scores: {
      overall: generateScore(baseScores.overall),
      hydration: generateScore(baseScores.hydration),
      elasticity: generateScore(baseScores.elasticity),
      pores: generateScore(baseScores.pores),
      texture: generateScore(baseScores.texture),
      radiance: generateScore(baseScores.radiance),
    },
    insights: [
      {
        category: 'hydration',
        title: 'Skin Hydration Status',
        description: 'Your skin hydration level is within normal range. Continue maintaining good hydration habits.',
        severity: 'info',
        recommendations: [
          'Use hydrating face masks daily',
          'Increase water intake to 8 glasses per day',
          'Use skincare products with hyaluronic acid',
        ],
      },
      {
        category: 'pores',
        title: 'Pore Condition Needs Attention',
        description: 'Detected slightly enlarged pores in T-zone, possibly related to oil secretion.',
        severity: 'warning',
        recommendations: [
          'Use pore-minimizing toner',
          'Perform deep cleansing 1-2 times per week',
          'Avoid over-cleansing which may increase oil production',
        ],
      },
      {
        category: 'radiance',
        title: 'Good Skin Radiance',
        description: 'Your skin shows healthy natural radiance. Keep it up!',
        severity: 'success',
        recommendations: [
          'Continue using products with Vitamin C',
          'Maintain regular sleep schedule',
          'Moderate exercise to promote blood circulation',
        ],
      },
    ],
    detectedIssues: [
      {
        type: 'Slight Dehydration',
        severity: 'low',
        location: 'cheeks',
        confidence: 0.85,
      },
      {
        type: 'Enlarged Pores',
        severity: 'medium',
        location: 't-zone',
        confidence: 0.78,
      },
    ],
    comparisonWithLast: {
      overall: generateScore(2, 3),
      hydration: generateScore(1, 2),
      elasticity: generateScore(0, 1),
      pores: generateScore(-1, 2),
      texture: generateScore(1, 2),
      radiance: generateScore(3, 2),
    },
  };
  
  return report;
};

// Compare multiple photos
export const mockComparePhotos = async (photoIds: string[]): Promise<{
  photos: Photo[];
  trends: {
    metric: string;
    values: number[];
    trend: 'improving' | 'stable' | 'declining';
  }[];
  summary: string;
}> => {
  await delay(1500);
  
  const mockPhotos = photoIds.map((id, index) => ({
    id,
    uri: `https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Photo+${index + 1}`,
    takenAt: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000), // 7 days apart
    lightQuality: 'good' as const,
    faceDetected: true,
    paths: {
      original: '',
      compressed: '',
      thumbnail: '',
    },
    metadata: {
      fileSize: 1024 * 1024,
      dimensions: { width: 1920, height: 1920 },
      format: 'jpeg' as const,
    },
  }));
  
  return {
    photos: mockPhotos,
    trends: [
      {
        metric: 'Overall Score',
        values: [72, 74, 75, 78],
        trend: 'improving',
      },
      {
        metric: 'Hydration',
        values: [68, 70, 70, 71],
        trend: 'stable',
      },
      {
        metric: 'Pores',
        values: [65, 64, 66, 65],
        trend: 'stable',
      },
    ],
    summary: 'Your skin condition shows an overall upward trend, especially with significant improvement in overall score. Continue your current skincare routine!',
  };
};

// Get skin care recommendations
export const mockGetRecommendations = async (_analysisId: string): Promise<{
  products: {
    category: string;
    name: string;
    description: string;
    keyIngredients: string[];
    usage: string;
  }[];
  treatments: Treatment[];
  routines: {
    time: 'morning' | 'evening';
    steps: {
      order: number;
      action: string;
      duration: string;
      tips: string;
    }[];
  }[];
}> => {
  await delay(1000);
  
  return {
    products: [
      {
        category: 'Toner',
        name: 'Balancing Hydrating Toner',
        description: 'Contains hyaluronic acid for deep hydration while minimizing pores',
        keyIngredients: ['Hyaluronic Acid', 'Niacinamide', 'Centella Asiatica Extract'],
        usage: 'After cleansing, pat gently with cotton pad until absorbed',
      },
      {
        category: 'Serum',
        name: 'Pore Minimizing Serum',
        description: 'Specifically targets T-zone pore issues, effectively improves skin texture',
        keyIngredients: ['Salicylic Acid', 'Tea Tree Oil', 'Witch Hazel'],
        usage: 'After toner, focus application on T-zone',
      },
      {
        category: 'Moisturizer',
        name: 'Lightweight Hydrating Cream',
        description: 'Light texture without stickiness, provides 24-hour hydration',
        keyIngredients: ['Ceramides', 'Squalane', 'Vitamin E'],
        usage: 'After serum, apply to entire face and gently massage until absorbed',
      },
    ],
    treatments: [
      {
        id: 'treatment-1',
        name: 'HydraFacial',
        description: 'Deep cleansing, exfoliation, extraction, and hydration treatment for instantly improved skin clarity and tone.',
        benefits: [
          'Deep cleansing and hydration',
          'Reduces fine lines and wrinkles',
          'Improves skin texture and tone',
          'Minimizes pore appearance'
        ],
        duration: '45-60 minutes',
        targetConcerns: ['Dryness', 'Fine lines', 'Dull skin', 'Clogged pores']
      },
      {
        id: 'treatment-2',
        name: 'Chemical Peel',
        description: 'Chemical solution that exfoliates skin and removes damaged outer layers, revealing fresher skin beneath.',
        benefits: [
          'Reduces hyperpigmentation',
          'Improves acne scars',
          'Smooths fine lines',
          'Evens out skin tone'
        ],
        duration: '30-45 minutes',
        targetConcerns: ['Pigmentation', 'Acne scars', 'Uneven texture', 'Sun damage']
      },
      {
        id: 'treatment-3',
        name: 'Oxygen Facial',
        description: 'Infuses oxygen, vitamins, and antioxidants into the skin for instant hydration and rejuvenation.',
        benefits: [
          'Instant hydration and plumping',
          'Boosts collagen production',
          'Detoxifies the skin',
          'Reduces inflammation'
        ],
        duration: '60-75 minutes',
        targetConcerns: ['Dehydration', 'Dull complexion', 'Fine lines', 'Sensitive skin']
      },
      {
        id: 'treatment-4',
        name: 'Microneedling',
        description: 'Creates tiny punctures in the skin to trigger collagen production, improving texture and reducing scars.',
        benefits: [
          'Reduces acne scars',
          'Minimizes large pores',
          'Improves skin texture',
          'Enhances product absorption'
        ],
        duration: '60-90 minutes',
        targetConcerns: ['Acne scars', 'Large pores', 'Wrinkles', 'Uneven texture']
      },
      {
        id: 'treatment-5',
        name: 'LED Light Therapy',
        description: 'Non-invasive treatment using different wavelengths of light to target specific skin concerns.',
        benefits: [
          'Reduces inflammation',
          'Kills acne-causing bacteria',
          'Stimulates collagen production',
          'Accelerates wound healing'
        ],
        duration: '20-30 minutes',
        targetConcerns: ['Acne', 'Redness', 'Inflammation', 'Signs of aging']
      }
    ],
    routines: [
      {
        time: 'morning',
        steps: [
          {
            order: 1,
            action: 'Gentle Cleansing',
            duration: '1 minute',
            tips: 'Use lukewarm water, avoid over-cleansing',
          },
          {
            order: 2,
            action: 'Toner',
            duration: '30 seconds',
            tips: 'Pat with cotton pad for secondary cleansing',
          },
          {
            order: 3,
            action: 'Serum',
            duration: '1 minute',
            tips: 'Focus on T-zone application',
          },
          {
            order: 4,
            action: 'Moisturizer',
            duration: '1 minute',
            tips: 'Gently massage from inside out',
          },
          {
            order: 5,
            action: 'Sunscreen',
            duration: '30 seconds',
            tips: 'SPF30+, reapply every 2 hours',
          },
        ],
      },
      {
        time: 'evening',
        steps: [
          {
            order: 1,
            action: 'Makeup Remover',
            duration: '2 minutes',
            tips: 'Thoroughly remove makeup and sunscreen',
          },
          {
            order: 2,
            action: 'Cleansing',
            duration: '1 minute',
            tips: 'Double cleanse to ensure thorough cleaning',
          },
          {
            order: 3,
            action: 'Toner',
            duration: '30 seconds',
            tips: 'Prepare for better absorption of subsequent products',
          },
          {
            order: 4,
            action: 'Serum',
            duration: '1 minute',
            tips: 'Can layer multiple serums',
          },
          {
            order: 5,
            action: 'Moisturizer',
            duration: '1 minute',
            tips: 'Choose richer formula for nighttime',
          },
          {
            order: 6,
            action: 'Eye Cream',
            duration: '30 seconds',
            tips: 'Gently pat, avoid pulling',
          },
        ],
      },
    ],
  };
};

// Track user activity
export const mockTrackActivity = async (activity: {
  type: string;
  data: any;
}): Promise<void> => {
  await delay(100);
  console.log('Activity tracked:', activity);
};

// Get achievement progress
export const mockGetAchievementProgress = async (_userId: string): Promise<{
  streak: number;
  totalPhotos: number;
  improvementScore: number;
  nextMilestone: {
    type: string;
    target: number;
    current: number;
  };
}> => {
  await delay(500);
  
  return {
    streak: 5,
    totalPhotos: 23,
    improvementScore: 8,
    nextMilestone: {
      type: 'photos',
      target: 50,
      current: 23,
    },
  };
};