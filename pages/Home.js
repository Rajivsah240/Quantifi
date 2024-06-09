import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import HealthMetrics from '../components/HealthMetrics'
import CarouselItems from '../components/CarouselItems'
import Divider from '../components/Divider'

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation}/>
      <Divider/>
      <HealthMetrics/>
      <CarouselItems/>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  }
})