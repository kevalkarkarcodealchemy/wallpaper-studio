import * as ImagePicker from 'expo-image-picker';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WallpaperActionButton } from '../src/components/WallpaperActionButton';
import { WallpaperPreview } from '../src/components/WallpaperPreview';
import { useWallpaper } from '../src/hooks/useWallpaper';

export default function CustomWallpaperScreen() {
  const params = useLocalSearchParams<{ uri?: string }>();
  const [selectedUri, setSelectedUri] = useState<string | null>(params.uri || null);
  const [inputUrl, setInputUrl] = useState('');
  const { isProcessing, applyWallpaper } = useWallpaper();
  const insets = useSafeAreaInsets();

  const pickImage = async () => {
    if (isProcessing) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedUri(result.assets[0].uri);
    }
  };

  const isAndroidOlderThan24 = Platform.OS === 'android' && Platform.Version < 24;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Custom Wallpaper',
          headerShown: true,
          headerStyle: { backgroundColor: '#09090b' },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }} 
      />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}>
        <WallpaperPreview uri={selectedUri} />

        <View style={styles.card}>
          <WallpaperActionButton
            title="Choose from Gallery"
            onPress={pickImage}
            variant="secondary"
            disabled={isProcessing}
            iconName="photo.on.rectangle"
          />

          <View style={styles.divider} />
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.urlInput}
              placeholder="Enter direct image URL..."
              placeholderTextColor="#71717a"
              value={inputUrl}
              onChangeText={setInputUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <WallpaperActionButton
              title="Load URL"
              onPress={() => {
                if (inputUrl) {
                  setSelectedUri(inputUrl);
                }
              }}
              variant="secondary"
              disabled={!inputUrl || isProcessing}
              iconName="link"
            />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Apply Wallpaper</Text>
          
          {Platform.OS === 'android' ? (
            <View style={styles.card}>
              <WallpaperActionButton
                title="Set Home Screen"
                onPress={() => selectedUri && applyWallpaper(selectedUri, 'home', () => router.back())}
                disabled={!selectedUri}
                isLoading={isProcessing}
                iconName="house.fill"
              />
              <WallpaperActionButton
                title={isAndroidOlderThan24 ? 'Lock Screen (Unsupported)' : 'Set Lock Screen'}
                onPress={() => selectedUri && applyWallpaper(selectedUri, 'lock', () => router.back())}
                disabled={!selectedUri || isAndroidOlderThan24}
                isLoading={isProcessing}
                iconName="lock.fill"
              />
              <WallpaperActionButton
                title="Set Both Screens"
                onPress={() => selectedUri && applyWallpaper(selectedUri, 'both', () => router.back())}
                disabled={!selectedUri}
                isLoading={isProcessing}
                iconName="iphone"
              />
            </View>
          ) : (
            <View style={styles.card}>
              <WallpaperActionButton
                title="Save to Photos"
                onPress={() => selectedUri && applyWallpaper(selectedUri, 'home', () => router.back())}
                disabled={!selectedUri}
                isLoading={isProcessing}
                iconName="square.and.arrow.down"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  actionsContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#a1a1aa',
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 8,
    letterSpacing: 1.2,
  },
  inputContainer: {
    gap: 12,
  },
  urlInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: '#f4f4f5',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 16,
  },
});
