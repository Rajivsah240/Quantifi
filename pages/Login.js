import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';



import axios from 'axios';
import {userContext} from '../AuthContext';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';


const Login = ({navigation}) => {
  const SERVER_IP = process.env.SERVER_IP;
  
  const {login} = userContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  console.log(SERVER_IP);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.WEB_CLIENT_ID,
    });
  }, []);

  const handleSignIn = async () => {
    if (email && password) {
      try {
        if (!email || !password) {
          return Alert.alert('Please fill all the input fields');
        }
        setLoading(true);
        setModalVisible(true);
        setMessage('Loging In...');
        const response = await axios.post(`${SERVER_IP}/login`, {
          email,
          password,
        },{
          validateStatus: function(status){
            return status<500;
          }
        });

        if (response.data.success) {
          setMessage('Successfully Logged In!');
          const {name, profile_pic} = response.data.user;
          login({name, email, profile_pic},"local");
          setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('Tab');
          }, 2000);
        } else {
          Alert.alert('Login Failed', response.data.message);
          setModalVisible(false);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Login Failed', 'An error occurred during login.');
        setModalVisible(false);
        setLoading(false);
      }
    } else {
      Alert.alert('Please fill all the input fields');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn({
        scopes: ['profile', 'email'],
      });

      const existingUser = await axios.post(`${SERVER_IP}/checkUser`, {
        email: userInfo.user.email,
      },
      {
        validateStatus: function(status){
          return status<500;
        }
      });

      if (existingUser.data.exists) {
        setLoading(true);
        setModalVisible(true);
        setMessage('Signing in with Google...');

        const googleCredential = auth.GoogleAuthProvider.credential(
          userInfo.idToken,
        );
        await auth().signInWithCredential(googleCredential);

        const {givenName, email, photo} = userInfo.user;
        login({name: givenName, email, profile_pic: photo},"google");
        setMessage('Signing Successful with Google...');
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('Tab');
        }, 5000);
      } else {
        Alert.alert("User Account doesn't exist. Please sign up.");
        await GoogleSignin.revokeAccess();
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available or outdated');
      } else {
        console.error(error);
        Alert.alert('An error occurred during Google Sign-In');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        
          <Text style={styles.title}>Hello Again !</Text>
          <Text style={styles.subtitle}>
            Fill your details or continue with social media
          </Text>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!passwordVisibility}
            />
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => setPasswordVisibility(!passwordVisibility)}>
              <Text style={styles.visibilityText}>
                {passwordVisibility ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.recoveryButton} onPress={()=>{navigation.navigate("ForgotPassword")}}>
            <Text style={styles.recoveryText}>Forgot Password ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            style={styles.googleButton}>
            <Image
              source={require('../assets/images/Google_logo.png')}
              style={styles.googleImage}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>New User?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
          </View>
          <Modal transparent={true} animationType="slide" visible={loading}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalBackground}>
                <TouchableWithoutFeedback>
                  <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>{message}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  //   backButtonContainer: {
  //     width: '100%',
  //     alignItems: 'flex-start',
  //     marginTop: 20,
  //   },
  //   backButton: {
  //     width: 50,
  //     height: 50,
  //     backgroundColor: '#ffffff',
  //     borderRadius: 25,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   },
  //   backButtonText: {
  //     fontSize: 34,
  //     color: '#000',
  //   },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 40,
    marginVertical: 10,
    color: 'black',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 50,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
    color: 'black',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'black',
  },
  visibilityToggle: {
    padding: 10,
  },
  visibilityText: {
    fontSize: 14,
    color: '#007bff',
  },
  recoveryButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    // marginRight: 1,
  },
  recoveryText: {
    fontSize: 12,
    color: '#007bff',
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
  },
  googleImage: {
    width: 33,
    height: 33,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 14,
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: 12,
    color: 'black',
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#007bff',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
  },
});

export default Login;
