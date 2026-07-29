import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SymbolView } from 'expo-symbols';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// We map route names to Symbol names
const getIconName = (routeName: string): any => {
  switch (routeName) {
    case 'index':
      return 'house.fill';
    case 'favorite':
      return 'heart.fill';
    case 'setting':
      return 'gearshape.fill';
    default:
      return 'circle';
  }
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Animated.View style={[styles.iconContainer, { opacity: isFocused ? 1 : 0.5 }]}>
                {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                  <SymbolView
                    name={getIconName(route.name)}
                    tintColor={isFocused ? '#ffffff' : '#a1a1aa'}
                    size={24}
                    fallback={
                      // Fallback just in case
                      <Text style={{ color: isFocused ? '#ffffff' : '#a1a1aa', fontSize: 24 }}>
                        {route.name === 'index' ? '🏠' : route.name === 'favorite' ? '❤️' : '⚙️'}
                      </Text>
                    }
                  />
                ) : (
                  <Text style={{ color: isFocused ? '#ffffff' : '#a1a1aa', fontSize: 24 }}>
                    {route.name === 'index' ? '🏠' : route.name === 'favorite' ? '❤️' : '⚙️'}
                  </Text>
                )}
                {isFocused && (
                  <Animated.View style={styles.activeDot} />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    width: width * 0.85,
    height: 64,
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    // Android Shadow
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
});
