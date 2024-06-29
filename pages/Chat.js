import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  ImageBackground,
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import { Avatar, Icon } from '@rneui/themed';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const Chat = ({ route, navigation }) => {
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

  const SERVER_IP = process.env.SERVER_IP;
  const SOCKET_SERVER_IP = process.env.SOCKET_SERVER_IP;
  const socket = useMemo(() => io(`${SOCKET_SERVER_IP}`), []);

  const flatListRef = useRef(null);

  useEffect(() => {
    fetchPreviousMessages();
    
    socket.emit('joinGroup', { groupId, userEmail });
    socket.on('newMessage', data => {
      setMessages(prevMessages => [...prevMessages, data]);
      scrollToBottom();
    });
    scrollToBottom();

    return () => {
      socket.emit('leaveGroup', { groupId, userEmail });
      socket.off();
    };
  }, [groupId, userEmail]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/messages`, {
        params: { groupId },
      });
      const data = response.data;
      if (data.success) {
        setMessages(data.messages);
        scrollToBottom();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch messages. Please try again later.');
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/group-members`, {
        params: { groupId },
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

  const sendMessage = () => {
    if (message.trim()) {
      const currentTime = new Date();
      const msgData = {
        groupId,
        userEmail,
        username,
        message,
        timestamp: currentTime.toISOString(),
      };
      socket.emit('message', msgData);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd();
    }
  };
  

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageItem,
        item.userEmail === userEmail ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <View style={styles.messageContent}>
        <Text
          style={[
            item.userEmail === userEmail
              ? styles.myMessageUsername
              : styles.otherMessageUsername,
          ]}
        >
          {item.username}
        </Text>
        <Text
          style={[
            item.userEmail === userEmail
              ? styles.myMessageTime
              : styles.otherMessageTime,
          ]}
        >
          {moment(item.timestamp).format('h:mm A')}
        </Text>
      </View>
      <Text style={styles.messageText}>{item.message}</Text>
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
    const date = moment(message.timestamp)
      .startOf('day')
      .format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const flatMessages = Object.keys(groupedMessages).flatMap(date => [
    { type: 'date', date },
    ...groupedMessages[date],
  ]);

  const renderItem = ({ item }) =>
    item.type === 'date'
      ? renderDateSeparator(item.date)
      : renderMessageItem({ item });

  return (
    <ImageBackground
      source={require('../assets/images/chat_background.jpg')}
      style={styles.container}
    >
      <View style={styles.header}>
        <Avatar
          rounded
          source={{ uri: groupImage }}
          size={40}
          containerStyle={styles.avatar}
        />
        <TouchableOpacity onPress={fetchGroupMembers}>
          <Text style={styles.headerTitle}>{groupName}</Text>
          <Text style={styles.headerID}>{groupId}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.menuButton}>
          <Icon
            name="dots-three-vertical"
            type="entypo"
            size={15}
            color="white"
          />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        ref={flatListRef}
        data={flatMessages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={styles.messageList}
        onLayout={scrollToBottom} // Ensures scroll to bottom on first load
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputCnts}>
          <TouchableOpacity onPress={() => {}} style={styles.cameraButton}>
            <Icon name="camera" type="material" color="grey" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message"
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => {}} style={styles.attachmentButton}>
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
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.modalBackground}
        >
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
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode:'cover'
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
    fontSize: 16,
    color: '#fff',
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
    marginRight:10,
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
});

export default Chat;
