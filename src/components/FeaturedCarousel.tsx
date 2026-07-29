import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text, ViewToken, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

const FEATURED_ITEMS = [
  {
    id: 'f1',
    uri: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1600&q=80',
    title: 'CYBER',
    subtitle: 'Punk',
  },
  {
    id: 'f2',
    uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    title: 'NATURE',
    subtitle: 'Peaks',
  },
  {
    id: 'f3',
    uri: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80',
    title: 'SPEED',
    subtitle: 'Driven',
  },
];

export function FeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewRef = useRef((info: { viewableItems: ViewToken[] }) => {
    if (info.viewableItems.length > 0) {
      setActiveIndex(info.viewableItems[0].index || 0);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= FEATURED_ITEMS.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderItem = ({ item }: { item: typeof FEATURED_ITEMS[0] }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={styles.itemContainer}>
          <ImageBackground
            source={{ uri: item.uri }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            {/* Overlay gradient/darken to make text pop */}
            <View style={styles.overlay} />
            
            {/* Text */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={FEATURED_ITEMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        bounces={false}
        getItemLayout={getItemLayout}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {FEATURED_ITEMS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: -16, // Counteracts parent padding to allow full-bleed scroll
  },
  slideContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    width: width - 32, // Card width = full screen width minus horizontal padding (16*2)
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#18181b',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#ffffff',
    marginTop: -12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    // Add cursive-like fonts for iOS/Android if available
    fontFamily: undefined,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#ffffff',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
