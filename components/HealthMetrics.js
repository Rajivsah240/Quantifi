import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthMetrics = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Metrics</Text>
      <View style={styles.metricsContainer}>
        <MetricBox
          title='Heart Beat'
          value='--'
          unit='bpm'
          status='NORMAL'
          color='rgba(251, 206, 255, 0.5)'
        />
        <MetricBox
          title='Weight'
          value='--'
          unit='kg'
          status='IDEAL'
          color='rgba(206, 255, 237, 0.5)'
        />
      </View>
      <View style={styles.metricsContainer}>
        <MetricBox
          title='Sleep'
          value='--'
          unit='h/day'
          status='ENOUGH'
          color='rgba(248, 255, 206, 0.5)'
        />
        <MetricBox
          title='Blood Pressure'
          value='--'
          unit='mg/Hg'
          status='CRITICAL'
          color='rgba(242, 255, 157, 0.5)'
        />
      </View>
    </View>
  );
};

const MetricBox = ({ title, value, unit, status, color }) => {
  return (
    <View style={[styles.metricBox, { backgroundColor: color }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>
      <Text style={[styles.metricStatus, { color: getStatusColor(status) }]}>{status}</Text>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'NORMAL':
    case 'IDEAL':
      return 'green';
    case 'WARNING':
      return 'yellow';
    case 'CRITICAL':
      return 'red';
    default:
      return 'grey';
  }
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  title: {
    fontFamily: 'Raleway-Medium',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color:'black'
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  metricBox: {
    width: 150,
    height: 100,
    borderRadius: 16,
    padding: 10,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black'
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    color:'grey'
  },
  metricUnit: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 5,
  },
  metricStatus: {
    fontSize: 12,
  },
});

export default HealthMetrics;
