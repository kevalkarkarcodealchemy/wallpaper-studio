import { ExpoConfig, ConfigContext } from 'expo/config';
import { ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withCustomConfigChanges: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainActivity = androidManifest.manifest.application?.[0]?.activity?.find(
      (activity: any) => activity.$['android:name'] === '.MainActivity'
    );
    if (mainActivity) {
      let configChanges = mainActivity.$['android:configChanges'] || '';
      // Inject necessary configuration change flags for Android 12+ dynamic theming
      const flagsToAdd = ['uiMode', 'colorMode', 'assetsPaths'];
      flagsToAdd.forEach((flag) => {
        if (!configChanges.includes(flag)) {
          configChanges += (configChanges ? '|' : '') + flag;
        }
      });
      mainActivity.$['android:configChanges'] = configChanges;
    }
    return config;
  });
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const baseConfig: ExpoConfig = {
    ...config,
    name: 'Wallpaper Studio',
    slug: 'wallpaper-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    plugins: [
      ...(config.plugins || []),
      [
        'expo-image-picker',
        {
          photosPermission: 'The app needs to access your photos to set wallpapers.',
        },
      ],
    ],
    android: {
      ...config.android,
      package: 'com.yourname.wallpaperapp',
      permissions: [
        'android.permission.SET_WALLPAPER',
        'android.permission.READ_MEDIA_IMAGES',
        'android.permission.READ_EXTERNAL_STORAGE',
      ],
    },
    ios: {
      ...config.ios,
      bundleIdentifier: 'com.yourname.wallpaperapp',
      infoPlist: {
        ...config.ios?.infoPlist,
        NSPhotoLibraryAddUsageDescription: 'This app needs access to save wallpapers to your photo library.',
      },
    },
  };

  return withCustomConfigChanges(baseConfig);
};
