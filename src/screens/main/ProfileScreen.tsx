import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserStore } from '../../store/userStore';
import { usePhotoStore } from '../../store/photoStore';
import { TestDataGenerator } from '../../utils/TestDataGenerator';

export const ProfileScreen = () => {
  const { user, logout } = useUserStore();
  const { addPhoto } = usePhotoStore();

  const generateTestData = async () => {
    Alert.alert(
      'Generate Test Data',
      'What type of test data would you like to generate?',
      [
        {
          text: '7-Day Progress Data',
          onPress: async () => {
            const photos = TestDataGenerator.generateProgressionPhotos(7);
            for (const photo of photos) {
              await addPhoto(photo);
            }
            Alert.alert('Success', 'Generated 7 days of progress data');
          }
        },
        {
          text: 'Random 30-Day Data',
          onPress: async () => {
            const photos = TestDataGenerator.generateMultiplePhotos(30);
            for (const photo of photos) {
              await addPhoto(photo);
            }
            Alert.alert('Success', 'Generated 30 days of random data');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'emoji-events', title: 'My Achievements', onPress: () => {} },
    { icon: 'shopping-bag', title: 'My Products', onPress: () => {} },
    { icon: 'science', title: 'Generate Test Data', onPress: generateTestData },
    { icon: 'settings', title: 'Settings', onPress: () => {} },
    { icon: 'help-outline', title: 'Help & Feedback', onPress: () => {} },
    { icon: 'logout', title: 'Logout', onPress: handleLogout, isDestructive: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || 'B'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Belle User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@belle.com'}</Text>
        </View>
        
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Icon name={item.icon} size={24} color={item.isDestructive ? '#e74c3c' : '#FF6B6B'} />
              <Text style={[styles.menuItemText, item.isDestructive && { color: '#e74c3c' }]}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color="#95a5a6" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  menuList: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 15,
  },
});