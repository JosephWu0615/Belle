import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { mockSkinAnalysisAPI } from '../../api/mockApi';
import { useUserStore } from '../../store/userStore';

export const SocialLoginScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useUserStore();

  const handleSocialLogin = async (provider: string) => {
    try {
      const result = await mockSkinAnalysisAPI.mockLogin(provider);
      if (result.success) {
        setUser(result.user);
        navigation.navigate('AICameraGuide' as never);
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again later');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Your Personal Skin Profile</Text>
        <Text style={styles.subtitle}>
          Sign in with your social account to start your skincare journey
        </Text>
        
        <View style={styles.loginOptions}>
          <TouchableOpacity
            style={[styles.loginButton, styles.appleButton]}
            onPress={() => handleSocialLogin('apple')}
          >
            <Icon name="phone-iphone" size={24} color="#fff" />
            <Text style={[styles.loginButtonText, styles.appleButtonText]}>
              Sign in with Apple
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.loginButton, styles.wechatButton]}
            onPress={() => handleSocialLogin('wechat')}
          >
            <Icon name="chat" size={24} color="#fff" />
            <Text style={[styles.loginButtonText, styles.wechatButtonText]}>
              Sign in with WeChat
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.loginButton, styles.googleButton]}
            onPress={() => handleSocialLogin('google')}
          >
            <Icon name="mail" size={24} color="#4285F4" />
            <Text style={[styles.loginButtonText, styles.googleButtonText]}>
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.alternativeLogin}>
          <Text style={styles.alternativeLoginText}>
            Sign in with Phone/Email
          </Text>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 50,
  },
  loginOptions: {
    marginBottom: 30,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  wechatButton: {
    backgroundColor: '#07C160',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  appleButtonText: {
    color: '#fff',
  },
  wechatButtonText: {
    color: '#fff',
  },
  googleButtonText: {
    color: '#3c4043',
  },
  alternativeLogin: {
    alignItems: 'center',
  },
  alternativeLoginText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
});