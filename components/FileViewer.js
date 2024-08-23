import React, { useEffect } from 'react';
import {View, Text, Linking, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Pdf from 'react-native-pdf';

const FileViewer = ({route}) => {
  const {url} = route.params;
  console.log(url);

  const openPDF = () => {
    Linking.openURL(url);
  };

  useEffect(()=>{
    openPDF();
  },[])

  // return (
  //   <View style={styles.container}>
  //     {url.includes('.pdf') ? (
  //       <TouchableOpacity onPress={openPDF} style={styles.button}>
  //         <Text style={styles.buttonText}>Open PDF</Text>
  //       </TouchableOpacity>
  //     ) : (
  //       <Image source={{uri: url}} style={styles.image} resizeMode="contain" />
  //     )}
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FileViewer;
