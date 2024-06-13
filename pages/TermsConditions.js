import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Divider from '../components/Divider';

const TermsConditions = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.appName}>Quantifi</Text>
        </View>
        <Divider/>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms and Conditions of Use</Text>
          <Text style={styles.paragraph}>
            Welcome to Quantifi, a fitness application provided by Quantifi. 
            These Terms and Conditions govern your use
            of the Quantifi mobile application ("App") and any associated services
            provided through the App.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using the App, you agree to be bound by these Terms
            and Conditions, our Privacy Policy, and all applicable laws and
            regulations. If you do not agree with any of these terms, you are
            prohibited from using or accessing this App.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            Quantifi is a comprehensive fitness application designed to track and
            display exercise data captured by the Quantifi device ("Device"). The
            App integrates with the Device to provide real-time exercise
            detection, detailed exercise analytics, and a suite of features
            commonly found in smartwatches, including but not limited to:
          </Text>
          <Text style={styles.listItem}>- Real-time heart rate monitoring.</Text>
          <Text style={styles.listItem}>- GPS tracking of exercise routes.</Text>
          <Text style={styles.listItem}>- Calorie expenditure estimation.</Text>
          <Text style={styles.listItem}>- Sleep monitoring.</Text>
          <Text style={styles.listItem}>- Step counting and distance tracking.</Text>
          <Text style={styles.listItem}>- Workout planning and progress tracking.</Text>
          <Text style={styles.paragraph}>
            The App provides users with personalized insights and recommendations
            based on the exercise data collected by the Device.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.paragraph}>
            By using Quantifi and the Device, you agree to the following
            responsibilities:
          </Text>
          <Text style={styles.listItem}>- Account Security: You are responsible for maintaining the confidentiality of any account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</Text>
          <Text style={styles.listItem}>- Prohibited Activities: You agree not to engage in any unauthorized use, reproduction, distribution, or modification of Quantifi or the Device. This includes reverse engineering, decompiling, or disassembling the App or the Device.</Text>
          <Text style={styles.listItem}>- Compliance: You agree to use Quantifi and the Device in compliance with all applicable laws, regulations, and third-party terms of service.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Privacy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Our Privacy Policy explains how we
            collect, use, and disclose information about you when you use Quantifi.
            By using Quantifi, you consent to our collection, use, and disclosure
            of your information as described in our Privacy Policy.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content and materials available on Quantifi, including but not
            limited to text, graphics, logos, button icons, images, audio clips,
            data compilations, and software, are the property of Quantifi
            or its licensors and are protected by intellectual property
            laws. You agree not to use, reproduce, modify, distribute, display,
            perform, or create derivative works from any of the content or
            materials available on Quantifi without our prior written consent.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            Disclaimer of Warranties: Quantifi and the Device are provided "as-is"
            and "as available" without any warranty of any kind, either express or
            implied. We do not warrant that Quantifi or the Device will be
            uninterrupted or error-free, that defects will be corrected, or that
            Quantifi or the Device are free of viruses or other harmful components.
          </Text>
          <Text style={styles.paragraph}>
            Limitation of Liability: In no event shall Quantifi, its
            directors, officers, employees, affiliates, agents, contractors,
            interns, suppliers, service providers, or licensors be liable for any
            direct, indirect, incidental, special, consequential, or punitive
            damages arising from your use of Quantifi or the Device or any content
            or materials available through Quantifi, including but not limited to
            any errors or omissions in any content or materials, or any loss or
            damage of any kind incurred as a result of the use of Quantifi or the
            Device or any content or materials posted, transmitted, or otherwise
            made available via Quantifi, even if advised of their possibility.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Modifications to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms and Conditions at any time.
            Changes will be effective immediately upon posting. Your continued use
            of Quantifi after changes are posted constitutes your acceptance of
            the updated Terms and Conditions.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms and Conditions are governed by and construed in accordance
            with the laws of India, without regard to its conflict
            of law provisions.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Severability</Text>
          <Text style={styles.paragraph}>
            If any provision of these Terms and Conditions is found to be
            unlawful, void, or unenforceable, such provision shall nonetheless be
            enforceable to the fullest extent permitted by applicable law, and the
            unenforceable portion shall be deemed to be severed from these Terms
            and Conditions. Such determination shall not affect the validity and
            enforceability of any other remaining provisions.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions or concerns about these Terms and Conditions,
            please contact us at <Text style={{color:'red'}}>quantifi_1@outlook.com.</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default TermsConditions;

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
    fontFamily:'JosefinSans-Bold',
    color: '#2196F3FF',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'grey'
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 24,
    color:'black'
  },
  listItem: {
    fontSize: 11,
    lineHeight: 24,
    marginLeft: 10,
    color:'black'
  },
});
