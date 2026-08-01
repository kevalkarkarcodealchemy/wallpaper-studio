import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon, HeartIcon, SettingIcon, BackgroundIcon, Background1Icon, Background2Icon } from './TabIcons';

const { width } = Dimensions.get('window');

const getIcon = (routeName: string, isFocused: boolean) => {
  const color = isFocused ? '#ffffff' : '#ABB7C2';
  switch (routeName) {
    case 'index':
      return <HomeIcon color={color} />;
    case 'favorite':
      return <HeartIcon color={color} />;
    case 'setting':
      return <SettingIcon color={color} />;
    default:
      return <HomeIcon color={color} />;
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
              activeOpacity={0.8}
            >
              {isFocused && (
                <Animated.View style={styles.activeBackground}>
                  <View style={styles.glowContainer}>
                    <BackgroundIcon style={styles.bgIcon1} />
                    <Background1Icon style={styles.bgIcon2} />
                    <Background2Icon style={styles.bgIcon3} />
                  </View>
                </Animated.View>
              )}
              <View style={styles.iconContainer}>
                <Animated.View style={{ zIndex: 2 }}>
                  {getIcon(route.name, isFocused)}
                </Animated.View>
              </View>
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
    height: 70,
    backgroundColor: '#0F0F16', // Dark background as in the image
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    // Android Shadow
    elevation: 10,
    overflow: 'hidden', // to ensure glow doesn't break the pill shape if intended, wait, the design shows it spilling over slightly or contained. Looking at the image, it's contained inside the pill shape. Let's keep overflow hidden.
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
  },
  activeBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  glowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgIcon1: {
    position: 'absolute',
    transform: [{ translateY: -12 },{translateX: 2}],
  },
  bgIcon2: {
    position: 'absolute',
      transform: [ { translateY: -15 }, {translateX: -12 }],
  },
  bgIcon3: {
    position: 'absolute',
    opacity: 0.8,
    transform: [{ translateY:3 }, {translateX: -10}],
  },
}); 
