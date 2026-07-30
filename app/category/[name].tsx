import { useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCloudinary } from '../../src/hooks/useCloudinary';
import { WallpaperCard } from '../../src/components/WallpaperCard';
import { useWallpaperStore } from '../../src/store/useWallpaperStore';

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const insets = useSafeAreaInsets();
  
  const { images, loading, error, getImages, loadMore, loadingMore } = useCloudinary();
  console.log("🚀 ~ CategoryScreen ~ images:", images)
  const favorites = useWallpaperStore((state) => state.favorites);
  const toggleFavorite = useWallpaperStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (name) {
      getImages(name);
    }
  }, [name, getImages]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <WallpaperCard
      item={{ id: item.id, uri: item.secure_url }}
      index={index}
      isFavorite={favorites.includes(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
      onPress={() => {
        router.push({ pathname: '/custom', params: { uri: item.secure_url } });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: name || 'Category',
          headerShown: true,
          headerStyle: { backgroundColor: '#09090b' },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }} 
      />
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
