import React, {useState, useEffect, useContext} from 'react';
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
import {Icon} from '@rneui/themed';
import Divider from '../components/Divider';
import { useFocusEffect } from '@react-navigation/native';


const ChatScreen = ({navigation}) => {
  const SERVER_IP = process.env.SERVER_IP;
  const {user} = userContext();
  const userEmail = user.email;
  const username = user.name;
  const [userGroups, setUserGroups] = useState([]);
  const [error, setError] = useState('');
  const [showButtons, setShowButtons] = useState(false);

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(
        `${SERVER_IP}/user-groups`,
        {
          params: {email: userEmail},
        },
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );
      const data = response.data;
      if (data.success) {
        setUserGroups(data.groups);
        console.log(data.groups);
        setError('');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch groups. Please try again later.');
    }
  };

  useEffect(() => {
     fetchUserGroups();
  }, [userEmail]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserGroups();
    }, [])
  )

  const renderGroupItem = ({item}) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() =>
        navigation.navigate('Chat', {groupId: item.id, userEmail,username, groupName:item.name})
      }>
      <Text style={styles.groupName}>{item.name}</Text>
      <Icon name="chevron-right" type="material-community" color="#007bff" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={userGroups}
        keyExtractor={item => item.id}
        renderItem={renderGroupItem}
        ListEmptyComponent={
          <Text style={styles.emptyGroup}>
            You are not part of any groups yet. Click Below the + button to
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
            onPress={() => navigation.navigate('CreateGroup', {userEmail})}>
            <Text style={styles.buttonText}>Create a Group</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('JoinGroup', {userEmail})}>
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
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(206, 255, 237, 0.5)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: '#000',
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
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  groupButton: {
    fontSize: 16,
    color: '#007bff',
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    
  },
  toggleButton: {
    backgroundColor: 'rgba(206, 255, 237,0.9)',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    // alignItems: 'center',
    // elevation: 3,    
  },
  actionButtons: {
    position: 'absolute',
    bottom: 100,
    right: 5,
    alignItems: 'center',
    justifyContent:'space-evenly',
    borderWidth: 0.2,
    borderRadius: 10,
    borderColor: '#007bff',
    // padding:20
  },
  actionButton: {
    // backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderRadius: 10,
    // margin: 10,
    // borderWidth:.2
    // width:'100%'
  },
  buttonText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Raleway-Medium',
  },
});

export default ChatScreen;
