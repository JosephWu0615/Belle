import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserStore } from '../store/userStore';
import { MainTabNavigator } from './MainTabNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { DailySkinRecordFlow } from '../screens/records/DailySkinRecordFlow';
import { MedicalBeautyRecordFlow } from '../screens/records/MedicalBeautyRecordFlow';
import { ProductRecordFlow } from '../screens/records/ProductRecordFlow';
import { PhotoCaptureScreen } from '../screens/camera/PhotoCaptureScreen';
import { ProductScreen } from '../screens/main/ProductScreen';
import { TreatmentScreen } from '../screens/main/TreatmentScreen';
import { HistoryScreen } from '../screens/main/HistoryScreen';
import { AIIngredientSearchScreen } from '../screens/main/AIIngredientSearchScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { isOnboarded, isLoading, loadUserData } = useUserStore();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="DailySkinRecord" 
              component={DailySkinRecordFlow}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="MedicalBeautyRecord" 
              component={MedicalBeautyRecordFlow}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="ProductRecord" 
              component={ProductRecordFlow}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="PhotoCapture" 
              component={PhotoCaptureScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="Product" 
              component={ProductScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Treatment" 
              component={TreatmentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="History" 
              component={HistoryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="AIIngredientSearch" 
              component={AIIngredientSearchScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};