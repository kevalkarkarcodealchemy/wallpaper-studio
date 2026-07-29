import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface Props {
  uri: string | null;
}

export const WallpaperPreview: React.FC<Props> = ({ uri }) => {
  return (
    <View style={styles.container}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <SymbolView name="photo" size={48} tintColor="#3f3f46" />
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 480, // slightly taller for a better preview
    borderRadius: 24, // softer corners
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // subtle glass background
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  placeholderText: {
    color: '#71717a',
    fontSize: 16,
    fontWeight: '500',
  },
});
