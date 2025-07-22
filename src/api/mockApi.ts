import { SkinAnalysis, WeeklyReport } from '../types';

const skinConditions = ['干性', '油性', '混合性', '敏感性', '中性'];
const recommendations = [
  '建议增加保湿产品的使用频率',
  '注意防晒，避免紫外线伤害',
  '适当减少清洁产品的使用',
  '增加抗氧化产品的使用',
  '保持充足的睡眠',
  '多喝水，保持肌肤水分',
  '定期去角质，促进肌肤更新',
  '使用温和的清洁产品'
];

const generateRandomRecommendations = (): string[] => {
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 recommendations
  const shuffled = [...recommendations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateProductScores = (): { [key: string]: number } => {
  return {
    'product_1': Math.floor(Math.random() * 30) + 70,
    'product_2': Math.floor(Math.random() * 30) + 70,
    'product_3': Math.floor(Math.random() * 30) + 70,
  };
};

const generateWeeklyTrend = (): number[] => {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 70);
};

export const mockSkinAnalysisAPI = {
  analyzeSkin: async (imageUri: string): Promise<SkinAnalysis> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random skin metrics
    return {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      metrics: {
        hydration: Math.floor(Math.random() * 100),
        oiliness: Math.floor(Math.random() * 100),
        sensitivity: Math.floor(Math.random() * 100),
        poreSize: Math.floor(Math.random() * 100),
        wrinkles: Math.floor(Math.random() * 100),
        darkSpots: Math.floor(Math.random() * 100),
      },
      recommendations: generateRandomRecommendations(),
      timestamp: new Date().toISOString(),
    };
  },
  
  generateWeeklyReport: async (): Promise<Partial<WeeklyReport>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random weekly trends
    return {
      improvements: ['hydration', 'sensitivity'],
      concerns: ['oiliness'],
      productEffectiveness: generateProductScores(),
      weeklyTrend: generateWeeklyTrend(),
    };
  },

  mockLogin: async (provider: string): Promise<{ success: boolean; user: any }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      user: {
        id: 'mock_user_123',
        name: 'Belle User',
        email: 'user@belle.com',
        avatar: 'https://via.placeholder.com/150',
      }
    };
  },

  searchProduct: async (query: string): Promise<any[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockProducts = [
      { id: '1', name: 'SK-II 神仙水', brand: 'SK-II', category: '精华' },
      { id: '2', name: '兰蔻小黑瓶', brand: 'Lancôme', category: '精华' },
      { id: '3', name: '雅诗兰黛小棕瓶', brand: 'Estée Lauder', category: '精华' },
      { id: '4', name: '资生堂红腰子', brand: 'Shiseido', category: '精华' },
      { id: '5', name: '科颜氏高保湿霜', brand: "Kiehl's", category: '面霜' },
    ];
    
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
    );
  }
};