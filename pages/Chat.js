import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import {Avatar, Icon} from '@rneui/themed';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';

const Chat = ({route, navigation}) => {
  const {
    groupId,
    groupName,
    groupImage,
    groupDescription,
    groupAdmin,
    userEmail,
    username,
  } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [error, setError] = useState('');
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activityVisible, setActivityVisible] = useState(false);
  const [showButtons,setShowButtons]=useState(false);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [uploadTask, setUploadTask] = useState(null);

  const SERVER_IP = process.env.SERVER_IP;
  const SOCKET_SERVER_IP = process.env.SOCKET_SERVER_IP;
  const socket = useMemo(() => io(`${SOCKET_SERVER_IP}`), []);

  const flatListRef = useRef(null);

  const saveMessageToStorage = async msgData => {
    try {
      const existingMessages = await AsyncStorage.getItem(
        `group_${groupId}_messages`,
      );
      let messagesToStore = [];
      if (existingMessages) {
        messagesToStore = JSON.parse(existingMessages);
      }
      messagesToStore.push(msgData);
      await AsyncStorage.setItem(
        `group_${groupId}_messages`,
        JSON.stringify(messagesToStore),
      );
      console.log('Saved by: ', userEmail);
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  // const clearMessageStorage = async groupId => {
  //   Alert.alert(
  //     'Confirm Delete',
  //     'Are you sure you want to clear all messages?',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: async () => {
  //           try {
  //             await AsyncStorage.removeItem(`group_${groupId}_messages`);
  //             console.log(`Storage cleared for group: ${groupId}`);
  //           } catch (error) {
  //             console.error('Failed to clear storage:', error);
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: false },
  //   );
  // };

  const clearMessageStorage = async groupId => {
    try {
      await AsyncStorage.removeItem(`group_${groupId}_messages`);
      console.log(`Storage cleared for group: ${groupId}`);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };
  

  const leaveGroup = async () => {
    Alert.alert(
      'Confirm Leave',
      'Are you sure you want to leave this group?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.post(`${SERVER_IP}/leave-group`, {
                groupId,
                userEmail,
              });
              const data = response.data;
              if (data.success) {
                clearMessageStorage(groupId);
                console.log('Left group:', groupId);
                navigation.goBack();
              } else {
                console.error(data.message);
              }
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const fetchPreviousMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(
        `group_${groupId}_messages`,
      );
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]);
      }
      scrollToBottom();
    } catch (error) {
      console.error(error);
      setError('Failed to fetch messages. Please try again later.');
    }
  };

  useEffect(() => {
    fetchPreviousMessages();

    socket.emit('joinGroup', {groupId, userEmail});
    socket.on('newMessage', data => {
      if (data.userEmail != userEmail) {
        setMessages(prevMessages => [...prevMessages, data]);
        scrollToBottom();
        saveMessageToStorage(data);
      }
      console.log('Received by: ', userEmail, ':', data);
    });

    return () => {
      socket.emit('leaveGroup', {groupId, userEmail});
      socket.off();
    };
  }, [groupId, userEmail, clearMessageStorage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

  const fetchGroupMembers = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/group-members`, {
        params: {groupId},
      });
      const data = response.data;
      if (data.success) {
        setMembers(data.members);
        setModalVisible(true);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch group members. Please try again later.');
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const currentTime = new Date();
      const msgData = {
        groupId,
        userEmail,
        username,
        message,
        timestamp: currentTime.toISOString(),
      };
      setMessages(prevMessages => [...prevMessages, msgData]);
      saveMessageToStorage(msgData);
      scrollToBottom();
      socket.emit('message', msgData);
      setMessage('');
    }
  };

  
  const uploadImage = async file => {
    const {uri} = file;
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(
      `Groups/media/group_${groupId}/${fileName}`,
    );
    const task = storageRef.putFile(uri);
    setUploadTask(task);
    setUploading(true);
    setActivityVisible(true);

    task.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setTransferred(progress);
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      setActivityVisible(false);
      setTransferred(0);
      setUploadTask(null);
      return url;
    } catch (error) {
      console.error('File upload error:', error);
      setUploading(false);
      setActivityVisible(false);
      setTransferred(0);
      setUploadTask(null);
      return null;
    }
  };

  const uploadFile = async file => {
    const uri = file;
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(
      `Groups/media/group_${groupId}/${fileName}`,
    );
    const task = storageRef.putFile(uri);
    setUploadTask(task);
    setUploading(true);
    setActivityVisible(true);

    task.on('state_changed', snapshot => {
      const progress =
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setTransferred(progress);
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setUploading(false);
      setActivityVisible(false);
      setTransferred(0);
      setUploadTask(null);
      return url;
    } catch (error) {
      console.error('File upload error:', error);
      setUploading(false);
      setTransferred(0);
      setUploadTask(null);
      return null;
    }
  };

  const selectMedia = async () => {
    const result = await launchImageLibrary({mediaType: 'mixed'});

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.error) {
      console.error('ImagePicker Error: ', result.error);
    } else {
      const {assets} = result;
      if (assets && assets.length > 0) {
        const file = assets[0];
        const url = await uploadImage(file);
        if (url) {
          const currentTime = new Date();
          const msgData = {
            groupId,
            userEmail,
            username,
            message: file.fileName,
            url: url,
            timestamp: currentTime.toISOString(),
            fileType: file.type,
          };
          setMessages(prevMessages => [...prevMessages, msgData]);
          saveMessageToStorage(msgData);
          scrollToBottom();
          socket.emit('message', msgData);
          console.log(msgData);
        }
      }
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      console.log(result);

      if (result) {
        const file = result.fileCopyUri;
        const url = await uploadFile(file);
        if (url) {
          const currentTime = new Date();
          const msgData = {
            groupId,
            userEmail,
            username,
            message: result.name,
            url: url,
            timestamp: currentTime.toISOString(),
            fileType: result.type,
          };
          setMessages(prevMessages => [...prevMessages, msgData]);
          saveMessageToStorage(msgData);
          scrollToBottom();
          socket.emit('message', msgData);
          console.log(msgData);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd();
    }
  };

  const renderMessageItem = ({item}) => (
    <View
      style={[
        styles.messageItem,
        item.userEmail === userEmail ? styles.myMessage : styles.otherMessage,
      ]}>
      <View style={styles.messageContent}>
        <Text
          style={[
            item.userEmail === userEmail
              ? styles.myMessageUsername
              : styles.otherMessageUsername,
          ]}>
          {item.username}
        </Text>
        <Text
          style={[
            item.userEmail === userEmail
              ? styles.myMessageTime
              : styles.otherMessageTime,
          ]}>
          {moment(item.timestamp).format('h:mm A')}
        </Text>
      </View>
      {item.url ? (
        <TouchableOpacity
          style={styles.attachment}
          onPress={() => Linking.openURL(item.url)}>
          {item.fileType && item.fileType.includes('image') ? (
            <Icon name="file" size={20} type="font-awesome" color="grey" />
          ) : (
            <Icon
              name="file-pdf-box"
              size={20}
              type="material-community"
              color="red"
            />
          )}
          <Text style={styles.messageText}>{item.message}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.messageText}>{item.message}</Text>
      )}
    </View>
  );

  const renderDateSeparator = date => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>
        {moment(date).format('MMMM D, YYYY')}
      </Text>
    </View>
  );

  const groupedMessages = messages.reduce((groups, message) => {
    const date = moment(message.timestamp).startOf('day').format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const flatMessages = Object.keys(groupedMessages).flatMap(date => [
    {type: 'date', date},
    ...groupedMessages[date],
  ]);

  const renderItem = ({item}) =>
    item.type === 'date'
      ? renderDateSeparator(item.date)
      : renderMessageItem({item});

  return (
    <ImageBackground
      source={require('../assets/images/chat_background.jpg')}
      style={styles.container}>
      <View style={styles.header}>
        <Avatar
          rounded
          source={{uri: groupImage}}
          size={40}
          containerStyle={styles.avatar}
        />
        <TouchableOpacity onPress={fetchGroupMembers}>
          <Text style={styles.headerTitle}>{groupName}</Text>
          <Text style={styles.headerID}>{groupId}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowButtons(!showButtons)} style={styles.menuButton}>
          <Icon
            name="dots-three-vertical"
            type="entypo"
            size={15}
            color="white"
          />
        </TouchableOpacity>
      </View>
      {showButtons &&
        (
          <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              clearMessageStorage(groupId);
            }}>
            <Text style={styles.buttonText}>Clear the Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={leaveGroup}>
            <Text style={[styles.buttonText,styles.leaveButton]}>Leave Group</Text>
          </TouchableOpacity>
        </View>
        )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        ref={flatListRef}
        data={flatMessages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.messageList}
        onLayout={scrollToBottom}
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputCnts}>
          <TouchableOpacity onPress={selectMedia} style={styles.cameraButton}>
            <Icon name="camera" type="material" color="grey" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message"
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={pickFile} style={styles.attachmentButton}>
            <Icon name="attachment" type="material" color="grey" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" type="feather" color="#2196F3FF" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalDescriptionText}>Description</Text>
            <Text style={styles.modalDescription}>{groupDescription}</Text>
            <Text style={styles.modalMembers}>Members</Text>
            <ScrollView>
              {members.map((member, index) => (
                <View key={index} style={styles.memberItem}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  {member.email == groupAdmin ? (
                    <Text style={styles.admin}>( admin )</Text>
                  ) : (
                    <></>
                  )}
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={activityVisible}
        onRequestClose={() => setActivityVisible(false)}>
        <TouchableOpacity
          onPress={() => setActivityVisible(false)}
          style={styles.modalBackground}>
          <View style={styles.modalView}>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{transferred}% Uploaded</Text>
              <ActivityIndicator size="large" color="#2196F3" />
              {uploadTask && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    uploadTask.cancel();
                    setActivityVisible(false);
                    setUploadTask(null);
                  }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setActivityVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    // backgroundColor: '#151515',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  avatar: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    marginLeft: 10,
  },
  headerID: {
    fontSize: 12,
    color: '#2196F3FF',
    marginLeft: 10,
  },
  menuButton: {
    position: 'absolute',
    right: 5,
    padding: 10,
    borderRadius: 20,
  },
  actionButtons: {
    position: 'absolute',
    top: 50,
    right: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
    zIndex:20
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex:20
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Raleway-Medium',
  },
  leaveButton: {
    color: '#f44336',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageItem: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#2196F3FF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#1f1f1f',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 2,
  },
  attachment: {
    backgroundColor: '#151515',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    // margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  myMessageUsername: {
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Raleway-Bold',
    fontSize: 10,
  },
  myMessageTime: {
    color: '#fff',
    fontSize: 9,
    textAlign: 'right',
    marginLeft: 10,
    fontFamily: 'Raleway-Medium',
    // marginTop:10
  },
  otherMessageUsername: {
    color: '#DCE8FF',
    marginBottom: 5,
    fontFamily: 'Raleway-Bold',
    fontSize: 10,
  },
  otherMessageTime: {
    color: '#C80036',
    fontSize: 9,
    textAlign: 'right',
    marginLeft: 10,
    fontFamily: 'Raleway-Medium',
    // marginTop:10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,

    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    // backgroundColor: '#fff',
  },
  inputCnts: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#1e1e1e',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    justifyContent: 'center',
    color: '#fff',
  },
  cameraButton: {
    padding: 10,
    borderRadius: 25,
  },
  attachmentButton: {
    padding: 10,
    borderRadius: 25,
  },
  sendButton: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 25,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateSeparatorText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
  },
  modalBackground: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    // flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: '50%',
    marginHorizontal: '10%',
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalDescriptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  modalMembers: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  admin: {
    color: '#2196F3FF',
  },
  memberItem: {
    marginBottom: 10,
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    color: '#fff',
  },
  memberEmail: {
    fontSize: 14,
    color: '#888',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Chat;
