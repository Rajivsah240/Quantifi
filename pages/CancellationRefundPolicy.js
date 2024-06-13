import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Divider from '../components/Divider';

const CancellationRefundPolicy = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.appName}>Quantifi</Text>
        </View>
        <Divider/>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancellation/Refund Policy</Text>
          <Text style={styles.paragraph}>
            Welcome to Quantifi, a fitness application provided by Quantifi. This Cancellation/Refund Policy outlines the terms and conditions for cancellations and refunds for the services provided through the Quantifi mobile application ("App").
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Subscription Cancellations</Text>
          <Text style={styles.paragraph}>
            You may cancel your subscription to Quantifi at any time. Upon cancellation, you will continue to have access to the premium features of the App until the end of your current billing period. After the billing period ends, your subscription will not be renewed, and you will lose access to the premium features.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Refund Eligibility</Text>
          <Text style={styles.paragraph}>
            Refunds may be issued under the following circumstances:
          </Text>
          <Text style={styles.listItem}>- If you experience technical issues that prevent you from using the App's core features, and our support team is unable to resolve the issue within a reasonable time frame.</Text>
          <Text style={styles.listItem}>- If you were charged for a subscription that you did not authorize or if there was a billing error.</Text>
          <Text style={styles.paragraph}>
            Refund requests must be made within 30 days of the original purchase date. We reserve the right to deny refund requests that do not meet these criteria.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How to Request a Refund</Text>
          <Text style={styles.paragraph}>
            To request a refund, please contact our customer support team at <Text style={{color:'red'}}>quantifi_1@outlook.com.</Text>. Provide the following information in your request:
          </Text>
          <Text style={styles.listItem}>- Your full name and email address associated with your Quantifi account.</Text>
          <Text style={styles.listItem}>- The reason for the refund request.</Text>
          <Text style={styles.listItem}>- Any relevant transaction details (e.g., date of purchase, amount charged).</Text>
          <Text style={styles.paragraph}>
            Our support team will review your request and respond within 5-7 business days.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We reserve the right to update or modify this Cancellation/Refund Policy at any time. Changes will be effective immediately upon posting the updated policy on this page. We encourage you to review this policy periodically for any updates.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions or concerns about this Cancellation/Refund Policy, please contact us at <Text style={{color:'red'}}>quantifi_1@outlook.com.</Text>.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default CancellationRefundPolicy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      scrollView: {
        flexGrow: 1,
        paddingBottom: 30,
      },
      header: {
        marginBottom: 20,
        alignItems: 'center',
      },
      appName: {
        fontSize: 24,
        fontFamily: 'JosefinSans-Bold',
        color: '#2196F3FF',
      },
      section: {
        marginVertical: 20,
      },
      sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'grey',
      },
      paragraph: {
        fontSize: 12,
        lineHeight: 24,
        color: 'black',
      },
      listItem: {
        fontSize: 11,
        lineHeight: 24,
        marginLeft: 10,
        color: 'black',
      },
});
