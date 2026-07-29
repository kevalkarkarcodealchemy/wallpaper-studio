import { Platform } from 'react-native';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import { SetWallpaperResult, WallpaperTarget } from './types';

export const setWallpaper = (
  uri: string,
  target: WallpaperTarget
): Promise<SetWallpaperResult> => {
  return new Promise((resolve) => {
    let nativeType = TYPE.HOME;
    if (target === 'lock') nativeType = TYPE.LOCK;
    if (target === 'both') nativeType = TYPE.BOTH;

    // Lock screen wallpaper requires API 24+
    if (target !== 'home' && Platform.Version < 24) {
      return resolve({
        success: false,
        message: 'Lock screen wallpaper is only supported on Android 7.0 and above.',
      });
    }

    try {
      ManageWallpaper.setWallpaper(
        { uri },
        (res: any) => {
          if (res.status === 'success') {
            resolve({ success: true, message: 'Wallpaper updated successfully!', uri: res.url });
          } else {
            resolve({ success: false, message: res.msg || 'Failed to set wallpaper.' });
          }
        },
        nativeType
      );
    } catch (error) {
      resolve({ success: false, message: 'An unexpected error occurred.' });
    }
  });
};
