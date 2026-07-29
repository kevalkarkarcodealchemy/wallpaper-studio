import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { setWallpaper, WallpaperTarget } from '../services/wallpaper';

export function useWallpaper() {
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  const applyWallpaper = async (uri: string, target: WallpaperTarget, onSuccess?: () => void) => {
    if (isProcessingRef.current) return;
    if (!uri) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const result = await setWallpaper(uri, target);
      if (result.success) {
        Alert.alert('Success', result.message, [
          { text: 'OK', onPress: onSuccess }
        ]);
      } else {
        Alert.alert('Action Failed', result.message);
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong while setting the wallpaper.');
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  return { isProcessing, applyWallpaper };
}
