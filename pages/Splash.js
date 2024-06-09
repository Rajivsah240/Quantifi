import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {userContext} from '../AuthContext';
import { Image } from '@rneui/base';
const Splash = ({navigation}) => {
  const {user} = userContext();

  useFocusEffect(
    React.useCallback(() => {
      const timeout = setTimeout(() => {
        navigation.navigate(user ? 'Tab' : 'Onboarding');
      }, 7000);

      console.log(user);

      return () => clearTimeout(timeout);
    }, [navigation, user]),
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.logo}>Q</Text> */}
      <Image style={styles.logo} source={require("../assets/icons/appIcon.jpg")}/>
      <Text style={styles.text}>Quantifi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-100
  },
  // logo: {
  //   fontSize: 250,
  //   color: 'white',
  //   fontFamily: 'JosefinSans-ExtraLight',
  //   textShadowColor: '#115184',
  //   textShadowOffset: {width: 1, height: 1},
  //   textShadowRadius: 50,
  // },
  logo:{
    width:450,
    height:450,
  },
  text: {
    fontSize: 30,
    color: '#7cc0d8',
    fontFamily: 'JosefinSans-ExtraLight',
  },
});

export default Splash;
