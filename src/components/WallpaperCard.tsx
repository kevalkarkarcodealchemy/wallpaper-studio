import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface WallpaperCardProps {
  item: {
    id: string;
    uri: string;
  };
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  index: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export function WallpaperCard({ item, isFavorite, onPress, onToggleFavorite, index }: WallpaperCardProps) {
  const heartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isFavorite ? 1.2 : 1) }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        // Add margin to create gap between items
        { marginLeft: index % 3 !== 0 ? 8 : 0 },
      ]}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      {/* Heart Icon Button overlay */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onToggleFavorite}
        style={styles.heartButtonContainer}
      >
        <Animated.View style={[styles.heartIconWrap, heartStyle]}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#ef4444' : '#ffffff'}
          />
        </Animated.View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#18181b', // placeholder color while image loads
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButtonContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark glassmorphic background
    alignItems: 'center',
    justifyContent: 'center',
    // Slight border for glass effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  heartIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
