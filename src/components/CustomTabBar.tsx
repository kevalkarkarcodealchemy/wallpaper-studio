import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon, HeartIcon, SettingIcon } from './TabIcons';

const { width } = Dimensions.get('window');

const ACTIVE_COLOR = '#4F46E5';   // Indigo/Blue like in reference image
const INACTIVE_COLOR = '#9CA3AF'; // Grey for unselected

const getIcon = (routeName: string, isFocused: boolean) => {
  const color = isFocused ? '#ffffff' : INACTIVE_COLOR;
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

function TabItem({
  route,
  isFocused,
  onPress,
  accessibilityLabel,
}: {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isFocused ? ACTIVE_COLOR : 'transparent', {
      duration: 250,
    }),
    shadowColor: ACTIVE_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: withTiming(isFocused ? 0.5 : 0, { duration: 250 }),
    shadowRadius: 10,
    elevation: withTiming(isFocused ? 10 : 0, { duration: 250 }),
    transform: [
      {
        scale: withSpring(isFocused ? 1 : 0.9, {
          damping: 15,
          stiffness: 150,
        }),
      },
    ],
  }));

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.85}
    >
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        {getIcon(route.name, isFocused)}
      </Animated.View>
    </TouchableOpacity>
  );
}

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
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            />
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
    width: width * 0.75,
    height: 68,
    backgroundColor: '#fffffff2',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    // iOS Shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // Android Shadow
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
