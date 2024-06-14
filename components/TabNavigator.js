import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, StyleSheet, Image} from 'react-native';

import Home from '../pages/Home';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveBackgroundColor: '#fff',
        tabBarItemStyle: {
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        },
        shifting: true,

      })}>
      <Tab.Screen
        name="Fitband"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon name='watch' type='feather' size={focused?30:20} color={focused?'red':'grey'}/>
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/icons/fitness.png')}
              style={{width: focused?40:20, height: focused?40:20}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/icons/home.png')}
              style={{width: focused?40:20, height: focused?40:20}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Timer"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/icons/time.png')}
              style={{width: focused?40:20, height: focused?40:20}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon name='activity' type='feather' size={focused?30:20} color={focused?'green':'grey'}/>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 50,
    position: 'absolute',
    backgroundColor: '#fff',
    // elevation: 2,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  },
});

export default TabNavigator;
