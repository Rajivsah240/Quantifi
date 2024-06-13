import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

// Static imports for images
const images = {
  '1': require('../assets/images/startWorkout.png'),
  '2': require('../assets/images/logSleep.png'),
  '3': require('../assets/images/viewProgress.png'),
  '4': require('../assets/images/insights.png'),
  '5': require('../assets/images/viewProgress.png'),
};

const data = [
  { id: '1', title: 'Start Workout' },
  { id: '2', title: 'Log Sleep' },
  { id: '3', title: 'View Progress' },
  { id: '4', title: 'Advance Insights' },
  { id: '5', title: 'Stats' },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.5;
const ITEM_SPACING = (width - ITEM_WIDTH) / 20;

const CarouselItems = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity style={{ marginHorizontal: ITEM_SPACING / 2 }} >
        <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
          <ImageBackground source={images[item.id]} style={styles.imageBackground} imageStyle={styles.imageStyle}>
            <Text style={styles.cardText}>{item.title}</Text>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const onScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    const centeredOffsetX = index * ITEM_WIDTH - ITEM_SPACING / 2;
    flatListRef.current.scrollToOffset({ offset: centeredOffsetX, animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ready to Begin?</Text>
        <Text style={styles.subHeaderText}>Start Tracking Your Progress</Text>
      </View>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="normal"
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={onScrollEnd}
      />
    </View>
  );
};

export default CarouselItems;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  header: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'Raleway-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  subHeaderText: {
    fontFamily: 'Raleway-Light',
    fontSize: 12,
    color: 'black',
  },
  card: {
    width: ITEM_WIDTH,
    height: 200,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ITEM_SPACING ,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    // height:'100%',
    justifyContent: 'center',
  },
  
  imageStyle: {
    borderRadius: 10,
    resizeMode:'cover',
    opacity: 0.5,
    // width:'100%'
  },
  cardText: {
    fontSize: 20,
    color: '#fff',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Raleway-Medium',
  },
});
