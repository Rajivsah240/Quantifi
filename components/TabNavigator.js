import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, Image,Alert,BackHandler} from 'react-native';

import Home from '../pages/Home';
import {Icon} from '@rneui/base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  useFocusEffect(
    React.useCallback(()=>{
      const onBackPress=()=>{
        Alert.alert(
          'Exit App',
          'Do you want to exit?',
          [
            {text:'No',style:'cancel'},
            {text:'Yes',onPress:()=>BackHandler.exitApp()}
          ],
          {cancelable:false}
        )
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress',onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress',onBackPress);
    },[])
  )
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
            <Icon
              name="watch"
              type="feather"
              size={20}
              color={focused ? 'red' : 'grey'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              size={20}
              color={focused ? 'brown' : 'grey'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.homeIconContainer}>
              <Image
                source={require('../assets/icons/home.png')}
                style={styles.homeIcon}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="activity"
              type="feather"
              size={20}
              color={focused ? 'green' : 'grey'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name="account-star-outline"
              size={20}
              color={focused ? 'orange' : 'grey'}
            />
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
    // bottom:50,
    color:'#000',
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
  },
  homeIconContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 12,
    borderTopWidth: 0.2,
    borderLeftWidth:0.2,
    borderRightWidth:0.2,
    borderColor: '#2196F3FF',
  },
  homeIcon: {
    width: 25,
    height: 25,
  },
});

export default TabNavigator;
