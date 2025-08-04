import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { theme } from '../../theme';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {

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
                return 'menu-book';
              case 'AIInsights':
                return 'insights';
              case 'Compare':
                return 'compare-arrows';
              default:
                return 'circle';
            }
          };

          // Get tab label
          const getTabLabel = () => {
            switch (route.name) {
              case 'Dashboard':
                return 'Journal';
              case 'AIInsights':
                return 'Insights';
              case 'Compare':
                return 'Compare';
              default:
                return label as string;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
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
                color={isFocused ? theme.colors.skin.score : theme.colors.text.tertiary}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? theme.colors.skin.score : theme.colors.text.tertiary },
                ]}
              >
                {getTabLabel()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadows.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...theme.typography.styles.caption1,
    marginTop: theme.spacing.xs,
  },
});