import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';


const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const {SERVER_IP} = process.env.SERVER_IP;
  const handlePasswordResetRequest = async () => {
    if (!email) {
      Alert.alert('Please enter your email address');
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_IP}/checkEmail`,
        {email},
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        Alert.alert('Password Reset', 'OTP Sent Successfully.');
        setTimeout(() => {
          navigation.navigate('OTPVerification',{email});
        }, 5000);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while requesting password reset.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handlePasswordResetRequest}>
        <Text style={styles.resetButtonText}>Send OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
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
  resetButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ForgotPassword;
