import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TabNavigator from './components/TabNavigator';


import { AuthProvider } from './AuthContext';
import Home from './pages/Home';
import OnboardingPage from './pages/Onboarding';
const Stack = createStackNavigator();


const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Onboarding" component={OnboardingPage}/>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Tab" component={TabNavigator} />
          <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
};

export default App;
