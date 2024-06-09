import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Divider = () => {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
    </View>
  );
};

export default Divider;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    width: '90%',
    backgroundColor: '#CCCCCC',
    marginVertical: 5,
  },
});
