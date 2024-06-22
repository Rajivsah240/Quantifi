import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

import {Icon} from '@rneui/themed';

const Chat = ({route, navigation}) => {
  const {groupId, groupName, userEmail, username} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const SERVER_IP = process.env.SERVER_IP;
  const socket = io(`${SERVER_IP}`);

  useEffect(() => {
    fetchPreviousMessages();
    socket.emit('joinGroup', {groupId, userEmail});

    socket.on('newMessage', data => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      socket.emit('leaveGroup', {groupId, userEmail});
      socket.off();
    };
  }, [groupId, userEmail]);

  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/messages`, {
        params: {groupId},
      });
      const data = response.data;
      if (data.success) {
        setMessages(data.messages);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch messages. Please try again later.');
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {groupId, userEmail, username, message};
      socket.emit('message', msgData);
      setMessage('');
    }
  };

  const renderMessageItem = ({item}) => (
    <View
      style={[
        styles.messageItem,
        item.userEmail === userEmail ? styles.myMessage : styles.otherMessage,
      ]}>
      <Text style={styles.messageUsername}>{item.username}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{groupName}</Text>
        <Text style={styles.headerID}>{groupId}</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessageItem}
        style={styles.messageList}
        // inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" type="material-community" color="#000" />
        </TouchableOpacity>
      </View>
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
    marginBottom:10
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: '#000',
    marginLeft: 10,
  },
  headerID: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
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
    backgroundColor: '#61a9ff',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#DCE8FF',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
  },
  messageUsername: {
    color: '#007bff',
    marginBottom: 5,
    fontFamily:'Raleway-Medium',
    fontSize:10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#fff',
    color: '#000',
  },
  sendButton: {
    backgroundColor: 'rgba(206, 255, 237, 0.5)',
    padding: 10,
    borderRadius: 25,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Chat;
