import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { SocialLoginScreen } from '../screens/onboarding/SocialLoginScreen';
import { AICameraGuideScreen } from '../screens/onboarding/AICameraGuideScreen';
import { AddCoreProductsScreen } from '../screens/onboarding/AddCoreProductsScreen';
import { SetPrimaryGoalScreen } from '../screens/onboarding/SetPrimaryGoalScreen';
import { OnboardingCompleteScreen } from '../screens/onboarding/OnboardingCompleteScreen';

const Stack = createStackNavigator();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SocialLogin" component={SocialLoginScreen} />
      <Stack.Screen name="AICameraGuide" component={AICameraGuideScreen} />
      <Stack.Screen name="AddCoreProducts" component={AddCoreProductsScreen} />
      <Stack.Screen name="SetPrimaryGoal" component={SetPrimaryGoalScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
  );
};