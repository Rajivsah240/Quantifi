import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Button} from '@rneui/themed';
import Animated, {SlideInLeft, SlideOutLeft} from 'react-native-reanimated';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const {width, height} = Dimensions.get('window');

import {userContext} from '../AuthContext';

const SideMenu = ({navigation, user, toggleMenu}) => {
  const {logout,signInMethod} = userContext();

  const handleLogout = async () => {
    if (signInMethod === 'google') {
      await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
    }
    // await GoogleSignin.signOut();
    logout();
    navigation.navigate('Splash');
    toggleMenu();
  };
  return (
    <Animated.View
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={styles.menuContainer}>
      <View style={styles.menuHeader}>
        {user && <Avatar
          rounded
          size={80}
          source={{uri: user.profile_pic}}
          containerStyle={styles.avatar}
        />}
        <Text style={styles.userName}>{user ? user.name : 'Guest'}</Text>
      </View>
      <Button
        title="Logout"
        buttonStyle={styles.logoutButton}
        onPress={handleLogout}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.75,
    height: height,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 2,
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  logoutButton: {
    backgroundColor: '#ff5c5c',
  },
});

export default SideMenu;
