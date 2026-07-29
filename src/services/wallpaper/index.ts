import { Platform } from 'react-native';
import { setWallpaper as setAndroid } from './wallpaper.android';
import { setWallpaper as setIos } from './wallpaper.ios';

export const setWallpaper = Platform.OS === 'android' ? setAndroid : setIos;
export * from './types';
