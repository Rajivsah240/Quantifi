import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar } from '@rneui/themed';
import { userContext } from '../AuthContext';
import SideMenu from './SideMenu';

const { width } = Dimensions.get('window');

const Header = ({navigation}) => {
  const { user } = userContext();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome {user ? user.name : ''}</Text>
        <Text style={styles.descriptionText}>
          This is a great step you have taken in the right path
        </Text>
      </View>
      <TouchableOpacity onPress={toggleMenu}>
        {user && user.profile_pic ? (
          <Avatar
            rounded
            size={50}
            source={{ uri: user.profile_pic }}
          />
          
        ) : (
          <Avatar
            rounded
            size={50}
            source={require('../assets/images/profile.png')}
          />
        )}
      </TouchableOpacity>
      {isMenuVisible && <SideMenu navigation={navigation} user={user} toggleMenu={toggleMenu} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 20,
  },
  welcomeText: {
    fontFamily: 'Raleway-Bold',
    fontSize: 25,
    marginBottom: 8,
    color: 'black',
  },
  descriptionText: {
    fontFamily: 'Raleway-Light',
    fontSize: 13,
    color: 'black',
    marginRight: 30,
  },
});

export default Header;
