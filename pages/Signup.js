import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const Signup = ({navigation}) => {
  const serverIP = process.env.SERVER_IP;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const [profilePic, setProfilePic] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.WEB_CLIENT_ID,
    });
  }, []);

  const selectProfilePic = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        setProfilePic({uri: asset.uri});
      }
    });
  };

  const handleSignup = async (name, email, password, uri) => {
    if (!name || !email || !password || !uri) {
      Alert.alert('Please fill all the fields !!');
      return;
    }

    setLoading(true);
    setModalVisible(true);
    setMessage('Signing up...');

    const userData = {
      name: name,
      email: email,
      password: password,
      profilePic: uri,
    };

    try {
      const response = await axios.post(`${serverIP}/signup`, userData,{
        validateStatus: function(status){
          return status<500;
        }
      });

      if (response.data.success) {
        setMessage('Successfully signed up!');
        setTimeout(() => {
          setLoading(false);
          setModalVisible(false);
          navigation.navigate('Login');
        }, 2000);
      } else {
        Alert.alert('Signup Failed', response.data.message);
        setLoading(false);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Signup Failed', 'An error occurred during signup.');
      setLoading(false);
      setModalVisible(false);
    }
  };

  const uploadImage = async () => {
    const {uri} = profilePic;
    if (!uri) {
      Alert.alert('No image selected');
      return;
    }

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(filename).putFile(uploadUri);

    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });

    try {
      await task;
      const url = await storage().ref(filename).getDownloadURL();
      setImageURL(url);
      await handleSignup(name, email, password, url);
    } catch (e) {
      Alert.alert('Image Upload Error', e.message);
    }
    setUploading(false);
    console.log(imageURL);
  };

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      await auth().signInWithCredential(googleCredential);

      const userName = userInfo.user.name;
      const userEmail = userInfo.user.email;
      const userPhoto = userInfo.user.photo;

      setName(userName);
      setEmail(userEmail);
      setProfilePic({uri: userPhoto});
      setImageURL(userPhoto);
      setPassword('Signed In using Google');
      await GoogleSignin.revokeAccess();

      console.log(userName, userEmail, userPhoto);

      setTimeout(() => {
        handleSignup(userName, userEmail, 'Signed In using Google', userPhoto);
      }, 5000);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Account</Text>
      <Text style={styles.subtitle}>
        Fill your details or continue with social media
      </Text>

      <TouchableOpacity
        onPress={selectProfilePic}
        style={styles.profilePicContainer}>
        {profilePic ? (
          <Image source={{uri: profilePic.uri}} style={styles.profilePic} />
        ) : (
          <Text style={styles.profilePicPlaceholder}>
            Select Profile Picture
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.inputLabel}>Your Name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <Text style={styles.inputLabel}>Email Address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.inputLabel}>Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!passwordVisibility}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisibility(!passwordVisibility)}
          style={styles.visibilityToggle}>
          <Text style={styles.visibilityText}>
            {passwordVisibility ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => {}} style={styles.recoveryButton}>
        <Text style={styles.recoveryText}>Recovery Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={uploadImage} style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGoogleSignup}
        style={styles.googleButton}>
        <Image
          source={require('../assets/images/Google_logo.png')}
          style={styles.googleImage}
        />
        <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Existing User?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} animationType="slide" visible={modalVisible}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
    color: 'black',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 40,
    color: 'black',
  },
  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profilePicPlaceholder: {
    color: '#888',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
    color: 'black',
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
  },
  recoveryText: {
    fontSize: 12,
    color: '#007bff',
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
  },
  loginText: {
    fontSize: 12,
    color: 'black',
  },
  loginLink: {
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

export default Signup;
