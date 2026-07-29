import { StyleSheet, View, FlatList, ListRenderItemInfo, StatusBar, Text } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WallpaperCard } from '../../src/components/WallpaperCard';
import { useWallpaperStore, Wallpaper } from '../../src/store/useWallpaperStore';

export default function FavoriteScreen() {
  const insets = useSafeAreaInsets();
  
  const wallpapers = useWallpaperStore((state) => state.wallpapers);
  const favorites = useWallpaperStore((state) => state.favorites);
  const toggleFavorite = useWallpaperStore((state) => state.toggleFavorite);

  // Filter wallpapers to only include favorites
  const favoriteWallpapers = wallpapers.filter((w) => favorites.includes(w.id));

  const renderItem = ({ item, index }: ListRenderItemInfo<Wallpaper>) => (
    <WallpaperCard
      item={item}
      index={index}
      isFavorite={true}
      onToggleFavorite={() => toggleFavorite(item.id)}
      onPress={() => {
        router.push({ pathname: '/custom', params: { uri: item.uri } });
      }}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {favoriteWallpapers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet.</Text>
          <Text style={styles.emptySubtext}>Tap the heart icon on any wallpaper to add it here.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteWallpapers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: -100, // adjust for visual centering
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#a1a1aa',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
