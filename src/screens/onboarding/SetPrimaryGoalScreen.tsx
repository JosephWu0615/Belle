import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../store/userStore';

const goals = [
  'Acne & Breakouts',
  'Fine Lines & Aging',
  'Brightening & Dark Spots',
  'Large Pores',
  'Sensitivity & Redness',
  'Dryness & Dehydration',
  'Oiliness & Sebum',
  'Dark Circles',
];

export const SetPrimaryGoalScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUserStore();
  const [selectedGoal, setSelectedGoal] = useState('');

  const handleContinue = () => {
    if (selectedGoal && user) {
      setUser({ ...user, primaryGoal: selectedGoal });
    }
    navigation.navigate('OnboardingComplete' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Which skin concern matters most to you?</Text>
        <Text style={styles.subtitle}>Choose one primary goal for AI to focus on</Text>
        
        <ScrollView style={styles.goalsList}>
          {goals.map((goal, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.goalItem,
                selectedGoal === goal && styles.goalItemSelected,
              ]}
              onPress={() => setSelectedGoal(goal)}
            >
              <Text
                style={[
                  styles.goalItemText,
                  selectedGoal === goal && styles.goalItemTextSelected,
                ]}
              >
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity
          style={[styles.continueButton, !selectedGoal && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedGoal}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  goalsList: {
    flex: 1,
  },
  goalItem: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalItemSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFE5E5',
  },
  goalItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  goalItemTextSelected: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});