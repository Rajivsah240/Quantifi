import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { userContext } from '../AuthContext';
import Divider from './Divider';

const { width, height } = Dimensions.get('window');

const SideMenu = ({ navigation, user, toggleMenu }) => {
  const { logout, signInMethod } = userContext();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    if (signInMethod === 'google') {
      await GoogleSignin.revokeAccess();
    }
    logout();
    navigation.navigate('Splash');
    toggleMenu();
  };

  const toggleMenuVisibility = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <Animated.View
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={styles.menuContainer}
    >
      <View style={styles.header}>
        <Text style={styles.companyName}>Quantifi</Text>
        <Icon name="search" type="feather" color="black" />
      </View>
      {/* <View style={styles.switchContainer}>
        <TouchableOpacity>
          <Text style={styles.switchTextActive}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.switchText}>Business</Text>
        </TouchableOpacity>
      </View> */}
      <Divider/>
      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="grid" type="feather" color="black" />
          <Text style={styles.menuItemText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="list" type="feather" color="black" />
          <Text style={styles.menuItemText}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="bar-chart-2" type="feather" color="black" />
          <Text style={styles.menuItemText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="heart" type="feather" color="black" />
          <Text style={styles.menuItemText}>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="users" type="feather" color="black" />
          <Text style={styles.menuItemText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" type="feather" color="black" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <Divider/>
      <View style={styles.notifications}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="bell" type="feather" color="black" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>24</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="message-square" type="feather" color="black" />
          <Text style={styles.menuItemText}>Chat</Text>
          <View style={styles.chatBadge}>
            <Text style={styles.chatText}>8</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <View style={styles.userContainer}>
          {user && (
            <Avatar
              rounded
              size={40}
              source={{ uri: user.profile_pic }}
              containerStyle={styles.avatar}
            />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user ? user.name : 'Guest'}</Text>
            <Text style={styles.userEmail}>{user ? user.email : ''}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleMenuVisibility} style={styles.menuButton}>
          <Icon name="dots-three-vertical" type="entypo" size={15} color="black" />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menuOptions}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutOption}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  companyName: {
    fontSize: 24,
    fontFamily:'JosefinSans-Bold',
    color: 'black',
    
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  switchText: {
    fontSize: 16,
    color: 'grey',
  },
  switchTextActive: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
  },
  menuItems: {
    // flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: 'black',
  },
  notifications: {
    marginBottom: 40,
  },
  notificationBadge: {
    backgroundColor: 'green',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 10,
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
  },
  chatBadge: {
    backgroundColor: 'orange',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 10,
  },
  chatText: {
    color: 'white',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    padding:3,
    borderWidth:0.2,
    borderColor:'grey',
    borderRadius:20,
    flexDirection:'row',
    alignItems:'center',
    // justifyContent:'center'
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
  },
  userInfo: {
    // flex: 1,
    // marginRight:40
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  userEmail: {
    fontSize: 11,
    color: 'grey',
  },
  menuButton: {
    position: 'absolute',
    // top: 10,
    right: 5,
    padding: 10,
    // borderWidth:0.2,
    borderColor:'grey',
    borderRadius:20
  },
  menuOptions: {
    position: 'absolute',
    top: -50,
    left:210,
    // right: 30,
    backgroundColor: 'white',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 3,
    borderRadius:10
  },
  logoutOption: {
    paddingVertical: 5,
  },
  logoutText: {
    color: 'black',
    fontSize: 12,
  },
});

export default SideMenu;
