import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {Icon} from '@rneui/themed';

const JoinGroup = ({navigation, route}) => {
  const SERVER_IP = process.env.SERVER_IP;
  const {userEmail} = route.params;
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleJoinGroup = async () => {
    setLoading(true);
    setIsError(false);
    setModalMessage('');
    setModalVisible(true);

    try {
      const response = await axios.post(
        `${SERVER_IP}/join-group`,
        {
          groupId,
          userEmail,
        },

        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );
      const data = response.data;
      if (data.success) {
        setModalMessage('Successfully joined the group!');
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('ChatScreen');
        }, 5000);
      } else {
        setIsError(true);
        setModalMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setModalMessage('Failed to join group. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Join Group</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Group ID</Text>
        <TextInput
          style={styles.input}
          value={groupId}
          onChangeText={setGroupId}
          placeholder="Enter group ID"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
          <Text style={styles.buttonText}>Join Group</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrapper}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Joining group...</Text>
              </>
            ) : (
              <>
                <Text style={isError ? styles.errorText : styles.successText}>
                  {modalMessage}
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(206, 255, 237, 0.5)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginLeft: 10,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Raleway-Medium',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 5,
    color: 'black',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  successText: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
  },
});

export default JoinGroup;
