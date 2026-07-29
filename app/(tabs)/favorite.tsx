import { StyleSheet, Text, View } from 'react-native';

export default function FavoriteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#f4f4f5',
    fontSize: 18,
    fontWeight: '600',
  },
});
