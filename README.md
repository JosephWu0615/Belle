# Belle - Your Beauty AI Bestie

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.80.1-blue.svg" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-5.0.4-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Platform-iOS-lightgrey.svg" alt="Platform">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

Belle is a comprehensive skincare tracking mobile application that helps users monitor their skin health, track skincare routines, and receive AI-powered insights for better skin care decisions.

## Features

### 📸 Smart Skin Analysis
- AI-powered skin condition analysis with detailed metrics
- Face detection with guided photo capture
- Automatic lighting condition feedback
- Historical photo comparison with side-by-side views

### 📊 Comprehensive Tracking
- **Daily Skin Records**: Track your skin condition with photos and product usage
- **Medical Beauty Records**: Document professional treatments and procedures
- **Product Records**: Monitor product effectiveness and reactions
- **Calendar View**: Visual overview of all records with color-coded indicators

### 🤖 AI Insights
- Weekly and monthly skin health reports
- Personalized product recommendations
- Trend analysis and improvement tracking
- Skin score calculations across multiple metrics

### 🎯 Personalized Experience
- Goal setting for targeted skin improvements
- Achievement system to encourage consistent tracking
- Product library management
- Customizable reminders and notifications

## Tech Stack

### Frontend
- **React Native 0.80.1** - Cross-platform mobile framework
- **TypeScript 5.0.4** - Type-safe development
- **React Navigation 7** - Navigation solution with stack and tab navigators
- **Zustand 5.0.6** - Lightweight state management

### UI/UX
- **Custom Design System** - Consistent theming and components
- **React Native Reanimated 3** - Smooth animations
- **React Native Vector Icons** - Comprehensive icon library
- **React Native Linear Gradient** - Beautiful gradient effects

### Data & Storage
- **AsyncStorage** - Local data persistence
- **File System Storage** - Optimized photo management
- **Mock API Architecture** - Development-ready with simulated responses

### Development Tools
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Metro** - JavaScript bundler

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or Yarn
- Xcode (for iOS development)
- CocoaPods
- React Native development environment ([setup guide](https://reactnative.dev/docs/set-up-your-environment))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/belle-app.git
cd belle-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install iOS dependencies:
```bash
cd ios
pod install
cd ..
```

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Start Metro bundler:
```bash
npm start
# or
yarn start
```

6. Run the app:
```bash
# iOS
npm run ios
# or
yarn ios

# Android (coming soon)
npm run android
# or
yarn android
```

## Project Structure

```
src/
├── api/              # API services and mock implementations
├── components/       # Reusable UI components
│   ├── common/      # Basic UI elements
│   ├── navigation/  # Navigation components
│   └── camera/      # Camera-related components
├── navigation/       # Navigation configuration
├── screens/          # Application screens
│   ├── main/        # Main app screens
│   ├── onboarding/  # Onboarding flow
│   └── records/     # Record creation flows
├── services/         # Business logic and utilities
├── store/           # State management
├── theme/           # Design system and styling
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Development

### Code Style

This project uses ESLint and Prettier for code quality and formatting. Run linting with:

```bash
npm run lint
# or
yarn lint
```

### State Management

The app uses Zustand for state management with the following stores:
- `userStore` - User profile and preferences
- `productStore` - Product library management
- `photoStore` - Photo storage and management
- `recordStore` - All types of records
- `achievementStore` - User achievements and progress

### Mock API

Currently, the app uses mock APIs for development. All API responses are simulated with realistic data and delays. To switch to a real API in the future, update the services in `src/services/mockApi.ts`.

### Photo Storage

The app implements a three-tier photo storage system:
- **Original**: Full resolution photos
- **Compressed**: Optimized for viewing
- **Thumbnail**: Small previews for lists

Photos older than 6 months are automatically cleaned up to manage storage.

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Guidelines

- Use clear and descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

## Roadmap

### Current Status
- ✅ Core UI implementation
- ✅ Navigation structure
- ✅ Mock API integration
- ✅ Photo capture and storage
- ✅ Basic tracking features
- ✅ Achievement system

### Upcoming Features
- [ ] Real backend API integration
- [ ] Cloud photo backup
- [ ] Advanced AI skin analysis
- [ ] Social features and sharing
- [ ] Android platform support
- [ ] Multi-language support
- [ ] Data export functionality
- [ ] Apple Health integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Native community for the amazing framework
- All open-source contributors whose libraries power this app

---

<p align="center">Made with ❤️ for better skin care</p>