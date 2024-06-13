import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import Divider from '../components/Divider';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.appName}>Quantifi</Text>
        </View>
        <Divider/>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Welcome to Quantifi, a fitness application provided by Quantifi.
             Your privacy is important to us. This
            Privacy Policy explains how we collect, use, and disclose
            information about you when you use Quantifi.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you
            create or modify your account, use Quantifi, or contact customer
            support. This may include:
          </Text>
          <Text style={styles.listItem}>
            - Personal information (e.g., name, email address).
          </Text>
          <Text style={styles.listItem}>
            - Health and fitness data (e.g., exercise activity, heart rate).
          </Text>
          <Text style={styles.listItem}>
            - Device information (e.g., type, model, operating system).
          </Text>
          <Text style={styles.listItem}>
            - Usage information (e.g., app interactions, preferences).
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. How We Use Your Information
          </Text>
          <Text style={styles.paragraph}>
            We may use the information we collect for various purposes,
            including to:
          </Text>
          <Text style={styles.listItem}>
            - Provide and personalize our services.
          </Text>
          <Text style={styles.listItem}>
            - Improve and develop new features.
          </Text>
          <Text style={styles.listItem}>
            - Communicate with you, including for customer service purposes.
          </Text>
          <Text style={styles.listItem}>- Comply with legal obligations.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We may share your information in the following circumstances:
          </Text>
          <Text style={styles.listItem}>
            - With your consent or at your direction.
          </Text>
          <Text style={styles.listItem}>
            - With service providers who perform services on our behalf.
          </Text>
          <Text style={styles.listItem}>
            - In response to legal requests or to protect our rights.
          </Text>
          <Text style={styles.listItem}>
            - In connection with a merger, sale, or reorganization of our
            company.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Security</Text>
          <Text style={styles.paragraph}>
            We take reasonable measures to help protect your information from
            unauthorized access, alteration, or destruction. However, no method
            of transmission over the internet or electronic storage is
            completely secure, so we cannot guarantee absolute security.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Choices</Text>
          <Text style={styles.paragraph}>
            You may update, correct, or delete your account information at any
            time by contacting us. You may also disable certain features or
            permissions through your device settings.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            6. Changes to This Privacy Policy
          </Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes. Changes are effective when posted.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at <Text style={{color:'red'}}>quantifi_1@outlook.com.</Text>.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

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

export default PrivacyPolicy;
