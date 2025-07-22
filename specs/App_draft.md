# Belle App iOS Implementation Plan

## Overview
Build a beauty/skincare tracking iOS app with AI-powered skin analysis, following the detailed wireframe specification. The app will use mocked API responses with random number generation for skin analysis results.

## 1. Project Setup & Dependencies

### Core Dependencies to Install:
- **Navigation**: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`
- **Camera**: `react-native-vision-camera`
- **Storage**: `@react-native-async-storage/async-storage`
- **Calendar**: `react-native-calendars`
- **Image Handling**: `react-native-fast-image`, `react-native-image-picker`
- **UI Components**: `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`
- **Icons**: `react-native-vector-icons`
- **Forms**: `react-hook-form`
- **State Management**: `zustand` or Context API
- **Date Handling**: `date-fns`

## 2. Project Structure

```
src/
├── api/
│   ├── mockApi.ts (Mock skin analysis API)
│   └── types.ts
├── components/
│   ├── global/
│   │   ├── BottomTabBar.tsx
│   │   ├── NavigationBar.tsx
│   │   └── FloatingActionButton.tsx
│   ├── camera/
│   │   └── AICamera.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Toast.tsx
├── screens/
│   ├── onboarding/
│   │   ├── WelcomeScreen.tsx
│   │   ├── SocialLoginScreen.tsx
│   │   ├── AICameraGuideScreen.tsx
│   │   ├── AddCoreProductsScreen.tsx
│   │   ├── SetPrimaryGoalScreen.tsx
│   │   └── OnboardingCompleteScreen.tsx
│   ├── main/
│   │   ├── DashboardScreen.tsx
│   │   ├── AIInsightsScreen.tsx
│   │   ├── CompareScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── records/
│       ├── DailySkinRecordFlow.tsx
│       ├── MedicalBeautyRecordFlow.tsx
│       └── ProductRecordFlow.tsx
├── navigation/
│   ├── AppNavigator.tsx
│   ├── OnboardingNavigator.tsx
│   └── MainTabNavigator.tsx
├── store/
│   ├── userStore.ts
│   ├── recordStore.ts
│   └── productStore.ts
├── utils/
│   ├── mockDataGenerator.ts
│   └── dateHelpers.ts
└── types/
    └── index.ts
```

## 3. Mock API Implementation

### Skin Analysis Mock Service:
```typescript
// api/mockApi.ts
export const mockSkinAnalysisAPI = {
  analyzeSkin: async (imageUri: string) => {
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
  
  generateWeeklyReport: async () => {
    // Generate random weekly trends
    return {
      improvements: ['hydration', 'sensitivity'],
      concerns: ['oiliness'],
      productEffectiveness: generateProductScores(),
      weeklyTrend: generateWeeklyTrend(),
    };
  }
};
```

## 4. Core Features Implementation

### Phase 1: Foundation (Week 1-2)
1. Set up navigation structure (Tab + Stack navigators)
2. Implement global components (TabBar, NavBar, FAB)
3. Create basic screen layouts
4. Set up local storage with AsyncStorage
5. Implement theme system for consistent styling

### Phase 2: Onboarding Flow (Week 2-3)
1. Welcome Screen with brand visuals
2. Social Login Screen (mock authentication)
3. AI Camera Guide with:
   - Face outline overlay
   - Light detection feedback
   - Auto-capture countdown
4. Product addition with barcode scanning mock
5. Goal setting screen
6. Completion screen with animations

### Phase 3: Core Recording Features (Week 3-4)
1. **Dashboard with Calendar**:
   - Monthly calendar view
   - Color-coded record indicators (🔵 skin, 🔴 medical, 🟡 product)
   - FAB with animated expansion
   - Empty state handling

2. **Daily Skin Record**:
   - Camera integration with guide
   - Product selection from library
   - Progressive disclosure for details
   - Save with toast notification

3. **Medical Beauty Record**:
   - Form with all required fields
   - Star rating component
   - Multi-image upload
   - Price input with formatting

4. **Product Record**:
   - Product selection screen
   - Tag cloud for feelings
   - Text input for notes
   - Photo association

### Phase 4: AI Features & Analysis (Week 4-5)
1. **AI Insights Screen**:
   - Report list with cards
   - Report detail pages with visualizations
   - Empty state for new users

2. **Photo Comparison**:
   - Date pickers
   - Side-by-side view
   - Swipe/slider comparison
   - Pinch-to-zoom

3. **Mock Analysis Results**:
   - Random metric generation
   - Trend visualization
   - Personalized recommendations

### Phase 5: Profile & Settings (Week 5)
1. Profile screen with user info
2. Achievement system
3. Product library management
4. Settings screens
5. Help & feedback

## 5. Technical Implementation Details

### State Management:
- Use Zustand for global state (user, products, records)
- Local component state for forms
- AsyncStorage for persistence

### Data Models:
```typescript
interface SkinRecord {
  id: string;
  date: Date;
  photo: string;
  products: string[];
  analysis?: SkinAnalysis;
  type: 'daily';
}

interface MedicalRecord {
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

interface ProductRecord {
  id: string;
  date: Date;
  productId: string;
  feelings: string[];
  notes: string;
  photos: string[];
  type: 'product';
}
```

### Camera Implementation:
- Use react-native-vision-camera
- Implement face detection for guide overlay
- Light level detection for feedback
- Auto-capture with countdown

### Calendar Integration:
- Custom calendar component with record indicators
- Date-based record filtering
- Monthly view navigation

## 6. UI/UX Considerations

### Design System:
- Consistent color palette (primary, secondary, accent)
- Typography scale
- Spacing system (4, 8, 16, 24, 32)
- Component library with consistent styling

### Animations:
- FAB expansion animation
- Screen transitions
- Loading states
- Success animations

### Accessibility:
- Proper labels for screen readers
- Touch target sizes (minimum 44x44)
- Color contrast compliance
- Font scaling support

## 7. Testing Strategy

### Unit Tests:
- Mock data generators
- Utility functions
- Store actions

### Component Tests:
- Screen rendering
- User interactions
- Navigation flows

### E2E Tests:
- Complete user flows
- Camera functionality
- Data persistence

## 8. Performance Optimizations

- Image compression and caching
- Lazy loading for reports
- Optimized list rendering
- Background task handling

## 9. Future Considerations

- Real API integration preparation
- Push notifications for reminders
- Data export functionality
- Multi-language support
- Android adaptation

## 10. Wireframe Specification Details

### Bottom Tab Navigation:
- **仪表盘/日历 (Dashboard/Calendar)**: Default home screen
- **AI洞察 (AI Insights)**: Reports and analysis center
- **对比 (Compare)**: Photo comparison tool
- **我的 (Profile)**: Personal profile, product library, and settings

### Floating Action Button (FAB):
- Located at bottom-right of Dashboard screen
- Expands to show three options:
  - 记录皮肤 (Record Skin)
  - 记录医美 (Record Medical Beauty)
  - 记录产品 (Record Product)

### Onboarding Flow Screens:
1. **Welcome Screen**: Logo, slogan "Belle - Your Beauty AI Bestie", CTA "开始我的自信之旅"
2. **Social Login**: Options for Apple/WeChat/Google login
3. **AI Camera Guide**: Full-screen camera with face outline guide and lighting feedback
4. **Add Core Products**: Barcode scanning and manual product entry
5. **Set Primary Goal**: Single-select list of skin concerns
6. **Onboarding Complete**: Congratulations with "您的第一份专属皮肤洞察报告将在 3天 后解锁"

### Record Type Indicators:
- 🔵 Blue dot: Daily skin records
- 🔴 Red dot: Medical beauty records
- 🟡 Yellow dot: Product feedback records

This plan provides a comprehensive roadmap for building the Belle App with all features specified in the wireframe document, using mocked API responses for skin analysis as requested.