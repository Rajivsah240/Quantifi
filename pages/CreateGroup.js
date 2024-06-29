import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const CreateGroup = ({navigation, route}) => {
  const SERVER_IP = process.env.SERVER_IP;
  const {userEmail} = route.params;
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [profilePic, setProfilePic] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

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

  const uploadImage = async () => {
    const {uri} = profilePic;
    if (!uri) {
      setModalVisible(true)
      setModalMessage('No image selected');
      return;
    }

    const filename = groupName+'_'+userEmail+'_'+uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(`GroupProfile/${filename}`).putFile(uploadUri);

    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });

    try {
      await task;
      const url = await storage().ref(`GroupProfile/${filename}`).getDownloadURL();
      setImageURL(url);
      const groupProfile = imageURL;
      if(groupProfile!=null)
        handleCreateGroup(groupName,groupDescription,groupProfile);
    } catch (e) {
      setModalVisible(true)
      setModalMessage('Image Upload Error', e.message);
    }
    setUploading(false);
    console.log(imageURL);
  };

  const handleCreateGroup = async (groupName,groupDescription,groupProfile) => {
    setLoading(true);
    setIsError(false);
    setModalMessage('');
    setModalVisible(true);

    const groupData = {
      userEmail,
      groupAdmin: userEmail,
      groupName,
      groupDescription,
      groupProfile,
    };

    console.log(groupData);
    

    try {
      const response = await axios.post(
        `${SERVER_IP}/create-group`,groupData,
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );
      const data = response.data;
      if (data.success) {
        setModalMessage('Group successfully created!');
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('ChatScreen');
        }, 2000);
      } else {
        setIsError(true);
        setModalMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setModalMessage('Failed to create group. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Group</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.profilePicMainContainer}>
          <TouchableOpacity
            onPress={selectProfilePic}
            style={styles.profilePicContainer}>
            {profilePic ? (
              <Image source={{uri: profilePic.uri}} style={styles.profilePic} />
            ) : (
              <Text style={styles.profilePicPlaceholder}>
                Select Group Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Enter group name"
          placeholderTextColor="#888"
        />
        <Text style={styles.label}>Group Description</Text>
        <TextInput
          style={styles.inputDescription}
          value={groupDescription}
          onChangeText={setGroupDescription}
          placeholder="Enter group Description"
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Create Group</Text>
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
                <Text style={styles.loadingText}>Creating group...</Text>
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
    backgroundColor: '#151515',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    marginLeft: 10,
  },
  profilePicMainContainer: {
    alignItems: 'center',
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
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#f9f9f9',
    fontFamily: 'Raleway-Medium',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 5,
    color: 'white',
  },
  inputDescription: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 5,
    color: 'white',
  },
  button: {
    backgroundColor: '#2196F3FF',
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
    backgroundColor: '#1e1e1e',
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
    backgroundColor: '#2196F3FF',
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

export default CreateGroup;
