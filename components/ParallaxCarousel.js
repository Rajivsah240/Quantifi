import React from 'react';
import {View, Text, Dimensions, StyleSheet, Platform} from 'react-native';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

const {width: screenWidth} = Dimensions.get('window');

const images = {
  1: require('../assets/images/startWorkout.png'),
  2: require('../assets/images/logSleep.png'),
  3: require('../assets/images/viewProgress.png'),
  4: require('../assets/images/insights.png'),
  5: require('../assets/images/viewProgress.png'),
};

const data = [
  {id: '1', title: 'Start Workout'},
  {id: '2', title: 'Log Sleep'},
  {id: '3', title: 'View Progress'},
  {id: '4', title: 'Advance Insights'},
  {id: '5', title: 'Stats'},
];

const ParallaxCarousel = () => {
  const renderItem = ({item}, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={images[item.id]}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.6}
          {...parallaxProps}
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ready to Begin?</Text>
        <Text style={styles.subHeaderText}>Start Tracking Your Progress</Text>
      </View>
      <Carousel
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 150}
        data={data}
        renderItem={renderItem}
        hasParallaxImages={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  item: {
    width: screenWidth - 200,
    height: screenWidth - 150,
    marginVertical: 10,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}),
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 17,
    marginTop: 10,
    textAlign: 'center',
    color: 'black',
  },
});

export default ParallaxCarousel;
