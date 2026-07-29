import * as MediaLibrary from 'expo-media-library';
import { WallpaperTarget, SetWallpaperResult } from './types';

export const setWallpaper = async (
  uri: string,
  _target: WallpaperTarget
): Promise<SetWallpaperResult> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return { success: false, message: 'Permission to access Photos is required.' };
    }
    
    // Remote URLs need to be downloaded first; local URIs can be saved directly.
    await MediaLibrary.saveToLibraryAsync(uri);
    return { 
      success: true, 
      message: 'Image saved to Photos! Please set it as wallpaper manually from your library.' 
    };
  } catch (error) {
    return { success: false, message: 'Failed to save image to Photos.' };
  }
};
