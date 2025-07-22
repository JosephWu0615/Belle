import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { AIInsightsScreen } from '../screens/main/AIInsightsScreen';
import { CompareScreen } from '../screens/main/CompareScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { CustomTabBar } from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B6B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="AIInsights"
        component={AIInsightsScreen}
        options={{
          title: 'AI Insights',
          tabBarLabel: 'AI Insights',
        }}
      />
      <Tab.Screen
        name="Compare"
        component={CompareScreen}
        options={{
          title: 'Compare',
          tabBarLabel: 'Compare',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};