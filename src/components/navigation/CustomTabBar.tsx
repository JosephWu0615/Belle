import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const scaleAnim = new Animated.Value(1);

  const handleCenterPress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to photo capture
    navigation.navigate('PhotoCapture' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get icon name based on route
          const getIconName = () => {
            switch (route.name) {
              case 'Dashboard':
                return 'dashboard';
              case 'AIInsights':
                return 'analytics';
              case 'Compare':
                return 'compare';
              case 'Profile':
                return 'person';
              default:
                return 'circle';
            }
          };

          // Add space in the middle for center button
          const shouldAddSpace = index === 1; // Add space after second tab

          return (
            <React.Fragment key={route.key}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
              >
                <Icon
                  name={getIconName()}
                  size={24}
                  color={isFocused ? '#FF6B6B' : '#95a5a6'}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? '#FF6B6B' : '#95a5a6' },
                  ]}
                >
                  {label as string}
                </Text>
              </TouchableOpacity>
              {shouldAddSpace && <View style={styles.centerSpace} />}
            </React.Fragment>
          );
        })}
      </View>

      {/* Center Record Button */}
      <Animated.View
        style={[
          styles.centerButton,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.centerButtonTouchable}
          onPress={handleCenterPress}
          activeOpacity={0.8}
        >
          <Icon name="camera-alt" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  centerSpace: {
    width: 80, // Space for center button
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  centerButton: {
    position: 'absolute',
    bottom: 15,
    left: '50%',
    marginLeft: -35, // Half of button width (70/2)
  },
  centerButtonTouchable: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  centerButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
});