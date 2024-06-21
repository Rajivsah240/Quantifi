import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import UpiPayment from 'react-native-upi-payment';

const PremiumPlans = ({ navigation }) => {
  const plans = [
    { id: 'basic', name: 'Basic Plan', price: 5 },
    { id: 'standard', name: 'Standard Plan', price: 10 },
    { id: 'premium', name: 'Premium Plan', price: 20 },
  ];

  const handlePayment = (plan) => {
    const successResponse = (response) => {
      console.log(response);
      Alert.alert(
        'Payment Successful',
        `Your payment was successful.\n\nTransaction ID: ${response.message}\n\nThank you for purchasing the ${plan.name}.`,
        [{ text: 'OK'}]
      );
    };

    const failureResponse = (response) => {
      console.log(response);
      Alert.alert(
        'Payment Failed',
        `Your payment could not be processed.\n\nError: ${response.message}\n\nPlease try again.`,
        [{ text: 'OK' }]
      );
    };

    UpiPayment.initializePayment(
      {
        vpa: '9612598712@pz',
        payeeName: 'Rajiv Kumar Sah',
        bankName:'State Bank of India',
        amount: (plan.price).toString(),
        transactionRef: `quantifi_${plan.id}_${new Date().getTime()}`,
        description: `Purchase ${plan.name}`,
      },
      successResponse,
      failureResponse
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Choose a Premium Plan</Text>
      {plans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={styles.planButton}
          onPress={() => handlePayment(plan)}
        >
          <Text style={styles.planText}>{plan.name} - ₹{plan.price}/month</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  planButton: {
    backgroundColor: '#ffd700',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  planText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PremiumPlans;
