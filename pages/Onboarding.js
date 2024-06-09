import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const OnboardingPage = ({navigation}) => {
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = pageNumber => {
    pagerRef.current.setPage(pageNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}>
        <View style={styles.page} key="1">
          <ImageBackground
            source={require('../assets/images/onboarding_5.png')}
            style={styles.imageBackground}>
            <View style={styles.blurOverlay}>
              <Text style={styles.title}>
                Welcome to{' '}
                <Text
                  style={{color: '#2196F3FF', fontFamily: 'JosefinSans-Bold'}}>
                  Quantifi
                </Text>
              </Text>
              <Text style={styles.description}>
                Your journey to a healthier, fitter you starts here. Track
                workouts, set goals, and stay motivated.
              </Text>
              <TouchableOpacity
                onPress={() => handlePageChange(1)}
                style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.page} key="2">
          <ImageBackground
            style={styles.imageBackground}
            source={require('../assets/images/onboarding_7_1.png')}>
            <View style={styles.blurOverlay}>
              <Text style={styles.title}>Track Your <Text style={{color:'#F2FF9D'}}>Progress</Text></Text>
              <Text style={styles.description}>
                Log your exercises, monitor your progress, and see real-time
                stats to keep you on track.
              </Text>
              <TouchableOpacity
                onPress={() => handlePageChange(2)}
                style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.page} key="3">
          <ImageBackground
            style={styles.imageBackground}
            source={require('../assets/images/onboarding_8.jpg')}>
            <View style={styles.blurOverlay}>
              <Text style={styles.title}>Stay <Text style={{color:'#F3636FFF'}}>Motivated</Text></Text>
              <Text style={styles.description}>
                Join a community of fitness enthusiasts, participate in
                challenges, and achieve your fitness goals together.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </PagerView>
      <View style={styles.indicatorContainer}>
        {[0, 1, 2].map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentPage === index
                ? styles.activeIndicator
                : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  image3: {
    height: '70%',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'Raleway-Black',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Convergence-Regular',
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff',
    padding: 20,
  },
  button: {
    width: '30%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#2196F3FF',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  //   indicatorContainer: {
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     marginBottom: 20,
  //   },
  //   indicator: {
  //     width: 10,
  //     height: 10,
  //     borderRadius: 5,
  //     backgroundColor: '#618bcf',
  //     marginHorizontal: 5,
  //   },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    marginHorizontal: 5,
  },
  activeIndicator: {
    width: 50,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3FF',
  },
  inactiveIndicator: {
    width: 20,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default OnboardingPage;
