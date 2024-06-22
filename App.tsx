import React,{useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

import Splash from './pages/Splash';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TabNavigator from './components/TabNavigator';


import { AuthProvider } from './AuthContext';
import Home from './pages/Home';
import OnboardingPage from './pages/Onboarding';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from './pages/OtpVerification';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CancellationRefundPolicy from './pages/CancellationRefundPolicy';
import PremiumPlans from './pages/PremiumPlans';
import { SocketProvider } from './SocketContext';
import Chat from './pages/Chat';
import CreateGroup from './pages/CreateGroup';
import JoinGroup from './pages/JoinGroup';
import ChatScreen from './pages/ChatScreen';
const Stack = createStackNavigator();



const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.WEB_CLIENT_ID,
    });
  }, []);
  return (
    <SocketProvider>
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Onboarding" component={OnboardingPage}/>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="OTPVerification" component={OTPVerification}/>
          <Stack.Screen name="ResetPassword" component={ResetPassword}/>
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Tab" component={TabNavigator} />
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
          <Stack.Screen name="JoinGroup" component={JoinGroup} />
          <Stack.Screen name="PremiumPlans" component={PremiumPlans}/>
          <Stack.Screen name="TermsCondition" component={TermsConditions}/>
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}/>
          <Stack.Screen name="Premium" component={CancellationRefundPolicy}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
    </SocketProvider>
  )
};

export default App;
