import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme';

interface CardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  gradient?: string[];
  backgroundColor?: string;
  icon?: React.ReactNode;
  image?: ImageSourcePropType;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  variant?: 'gradient' | 'solid' | 'image';
  imageStyle?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  onPress,
  gradient,
  backgroundColor = theme.colors.background.primary,
  icon,
  image,
  style,
  titleStyle,
  subtitleStyle,
  size = 'medium',
  variant = 'solid',
  imageStyle,
}) => {
  const sizeStyles = {
    small: {
      padding: theme.spacing.md,
      minHeight: 100,
    },
    medium: {
      padding: theme.spacing.lg,
      minHeight: 140,
    },
    large: {
      padding: theme.spacing.xl,
      minHeight: 180,
    },
  };

  const content = (
    <>
      {image && variant === 'image' && (
        <Image source={image} style={[styles.backgroundImage, imageStyle]} />
      )}
      {variant === 'image' && (
        <View style={styles.textBackground} />
      )}
      <View style={[styles.content, variant === 'image' && styles.imageContent, sizeStyles[size]]}>
        <View style={[styles.textContainer, variant === 'image' && styles.imageTextContainer]}>
          <Text style={[styles.title, variant === 'image' && styles.imageTitle, titleStyle]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, variant === 'image' && styles.imageSubtitle, subtitleStyle]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {icon && variant !== 'image' && <View style={styles.iconContainer}>{icon}</View>}
    </>
  );

  const cardStyle = [
    styles.card,
    sizeStyles[size],
    { backgroundColor: variant === 'gradient' ? 'transparent' : backgroundColor },
    style,
  ];

  if (variant === 'gradient' && gradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={!onPress}
      >
        <LinearGradient
          colors={gradient}
          style={cardStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.card,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
  imageContent: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '60%', // Text area takes 60% of width
    zIndex: 2, // Ensure text appears above background
  },
  textContainer: {
    flex: 1,
  },
  imageTextContainer: {
    width: '100%',
    paddingRight: theme.spacing.md,
    zIndex: 3, // Ensure text is on top
  },
  title: {
    ...theme.typography.styles.title2,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: 24,
  },
  subtitle: {
    ...theme.typography.styles.subheadline,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  iconContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    zIndex: 0, // Behind everything else
  },
  textBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%', // Cover left 60% for text area, leave 40% for image
    bottom: 0,
    backgroundColor: 'rgba(91, 200, 248, 0.9)', // Blue background for text area
    zIndex: 1, // Above image but below text
  },
  imageTitle: {
    ...theme.typography.styles.title2,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.bold,
  },
  imageSubtitle: {
    ...theme.typography.styles.callout,
    color: theme.colors.text.inverse,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
});