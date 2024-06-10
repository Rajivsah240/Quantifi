import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';



const OTPVerification = ({ navigation, route }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputs = useRef([]);
  const {SERVER_IP} = process.env.SERVER_IP;

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const focusNextInput = (index, value) => {
    if (value.length === 1 && index < 3) {
      inputs.current[index + 1].focus();
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    console.log(otpCode);
    if (otpCode.length < 4) {
      Alert.alert('Please fill all the fields');
      return;
    }
    try {
      const response = await axios.post(
        `${SERVER_IP}/verifyOTP`,
        { email: email, otp: otpCode },
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        Alert.alert('OTP Verified', 'Your OTP has been verified successfully.');
        setTimeout(() => {
          navigation.replace('ResetPassword', { email });
        }, 5000);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while verifying the OTP.');
    }
  };

  const handleResend = async () => {
    console.log('Resend code');
    try {
      const response = await axios.post(
        `${SERVER_IP}/checkEmail`,
        { email},
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your email.');
        startTimer();
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resending the OTP.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={Keyboard.dismiss} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            Please Check Your Email To See The Verification Code
          </Text>
          <Text style={styles.label}>OTP Code</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={value => focusNextInput(index, value)}
                value={digit}
                ref={el => (inputs.current[index] = el)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
          <View style={styles.resendContainer}>
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResendDisabled}
              style={[
                styles.resendButton,
                isResendDisabled && styles.resendButtonDisabled,
              ]}
            >
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
            <Text style={styles.timerText}>
              {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : ''}
            </Text>
          </View>
        </View>
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
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Raleway',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 10,
    color: '#000',
  },
  label: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    paddingTop: 100,
    paddingLeft: 30,
    alignSelf: 'flex-start',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#3498db',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    marginTop: 24,
    width: '90%',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Raleway',
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: '#3498db',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  resendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  resendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Raleway',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Raleway',
    color: '#000',
  },
});

export default OTPVerification;
