import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {userContext} from '../AuthContext';
import {Icon, Avatar} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({navigation}) => {
  const SERVER_IP = process.env.SERVER_IP;
  const {user} = userContext();
  const userEmail = user.email;
  const username = user.name;
  const [userGroups, setUserGroups] = useState([]);
  const [error, setError] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [latestMessages, setLatestMessages] = useState({});

  const fetchUserGroups = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/user-groups`, {
        params: {email: userEmail},
        validateStatus: status => status < 500,
      });
      const data = response.data;
      if (data.success) {
        setUserGroups(data.groups);
        setError('');
      } else {
        console.log(data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch groups. Please try again later.');
    }
  }, [SERVER_IP]);

  const fetchLatestMessagesForGroups = useCallback(async groups => {
    const messages = {};
    for (const group of groups) {
      messages[group.id] = await getLatestMessageFromStorage(group.id);
    }
    setLatestMessages(messages);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserGroups();
    }, [fetchUserGroups]),
  );

  useEffect(() => {
    if (userGroups.length > 0) {
      fetchLatestMessagesForGroups(userGroups);
    }
  }, [userGroups, fetchLatestMessagesForGroups]);

  const getLatestMessageFromStorage = async groupId => {
    try {
      const messages = await AsyncStorage.getItem(`group_${groupId}_messages`);
      if (messages) {
        const parsedMessages = JSON.parse(messages);
        const latestMessage = parsedMessages[parsedMessages.length - 1];
        if (latestMessage) {
          return {
            sender: latestMessage.username,
            message: latestMessage.message,
          };
        } else {
          return {sender: 'System', message: 'No messages yet'};
        }
      } else {
        return {sender: 'System', message: 'No messages yet'};
      }
    } catch (error) {
      console.error('Error fetching messages from AsyncStorage:', error);
      return {sender: 'System', message: 'No messages yet'};
    }
  };

  const renderGroupItem = ({item}) => {
    const latestMsg = latestMessages[item.id] || {
      sender: 'System',
      message: 'Loading...',
    };
    return (
      <View style={styles.itemContainer}>
        <Avatar
          rounded
          source={{uri: item.profile}}
          size={50}
          containerStyle={styles.avatar}
        />
        <TouchableOpacity
          style={styles.groupItem}
          onPress={() =>
            navigation.navigate('Chat', {
              groupId: item.id,
              userEmail,
              username,
              groupName: item.name,
              groupImage: item.profile,
              groupDescription: item.description,
              groupAdmin: item.admin,
            })
          }>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.latestMessageStyle}>
              {latestMsg.sender}: {latestMsg.message.slice(0, 30)}
              {latestMsg.message.length > 30 ? '...' : ''}
            </Text>
          </View>
          <Icon
            name="chevron-right"
            type="material-community"
            color="#007bff"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const memoizedGroups = useMemo(() => userGroups, [userGroups]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Q</Text>
        <Text style={styles.headerTitle}>Chat</Text>
        <TouchableOpacity onPress={() => {}} style={styles.menuButton}>
          <Icon
            name="dots-three-vertical"
            type="entypo"
            size={15}
            color="white"
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={memoizedGroups}
        keyExtractor={item => item.id}
        renderItem={renderGroupItem}
        ListEmptyComponent={
          <Text style={styles.emptyGroup}>
            You are not part of any groups yet. Click the + button below to
            create or join a group.
          </Text>
        }
        contentContainerStyle={styles.groupList}
      />
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowButtons(!showButtons)}>
          <Icon name="plus" type="material-community" color="#000" />
        </TouchableOpacity>
      </View>
      {showButtons && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate('CreateGroup', {userEmail});
              setShowButtons(!showButtons);
            }}>
            <Text style={styles.buttonText}>Create a Group</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate('JoinGroup', {userEmail});
              setShowButtons(!showButtons);
            }}>
            <Text style={styles.buttonText}>Join a Group</Text>
          </TouchableOpacity>
        </View>
      )}
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
  logo: {
    fontSize: 40,
    color: '#2196F3FF',
    fontFamily: 'JosefinSans-Bold',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway-Medium',
    color: '#fff',
  },
  menuButton: {
    position: 'absolute',
    right: 5,
    padding: 10,
    borderColor: 'grey',
    borderRadius: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  emptyGroup: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 16,
  },
  groupList: {
    flexGrow: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  avatar: {
    marginRight: 10,
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9f9f9',
  },
  groupInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  latestMessageStyle: {
    fontSize: 10,
    color: '#fff',
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  toggleButton: {
    backgroundColor: '#2196F3FF',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 100,
    right: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    backgroundColor: '#1e1e1e',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Raleway-Medium',
  },
});

export default ChatScreen;
