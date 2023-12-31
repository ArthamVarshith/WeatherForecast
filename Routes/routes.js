import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Home from '../Screens/Home'
import Welcome from '../Screens/Welcome';
import Forecast from '../Screens/Forecast';
import Search from '../Screens/Search';

const routes = () => {

  const Stack = createStackNavigator();

  return (
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
        <Stack.Screen name='Search' component={Search} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        <Stack.Screen name='Forecast' component={Forecast} options={{headerShown: false}}/>
      </Stack.Navigator>
  )
}

export default routes

const styles = StyleSheet.create({})