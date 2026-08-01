import { useState } from 'react';
import { StyleSheet, View, FlatList, ListRenderItemInfo, StatusBar, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WallpaperCard } from '../../src/components/WallpaperCard';
import { useWallpaperStore, Wallpaper } from '../../src/store/useWallpaperStore';
import { useCloudinary } from '../../src/hooks/useCloudinary';
import { useEffect } from 'react';
import { FeaturedCarousel } from '../../src/components/FeaturedCarousel';
import { CategoryList } from '../../src/components/CategoryList';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const wallpapers = useWallpaperStore((state) => state.wallpapers);
  const favorites = useWallpaperStore((state) => state.favorites);
  const toggleFavorite = useWallpaperStore((state) => state.toggleFavorite);
  const setWallpapers = useWallpaperStore((state) => state.setWallpapers);

  const { images, loading, getImages } = useCloudinary();

  useEffect(() => {
    getImages('Mix');
  }, [getImages]);

  useEffect(() => {
    if (images.length > 0) {
      setWallpapers(
        images.map((img) => ({
          id: img.id,
          uri: img.secure_url,
        }))
      );
    }
  }, [images, setWallpapers]);

  const renderItem = ({ item, index }: ListRenderItemInfo<Wallpaper>) => (
    <WallpaperCard
      item={item}
      index={index}
      isFavorite={favorites.some((fav) => fav.id === item.id)}
      onToggleFavorite={() => toggleFavorite(item)}
      onPress={() => {
        router.push({ pathname: '/custom', params: { uri: item.uri } });
      }}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallpapers</Text>
        <TouchableOpacity 
          style={styles.customButton}
          onPress={() => router.push('/custom')}
        >
          <Text style={styles.customButtonText}>Custom Setup</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wallpapers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        ListHeaderComponent={
          <>
            <FeaturedCarousel />
            <CategoryList />
          </>
        }
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b', // match root background
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  customButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  customButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

