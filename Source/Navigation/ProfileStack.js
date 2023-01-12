import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import Profile from '../Screens/Profile/Profile';
import OrderHistory from '../Screens/OrderHistory/OrderHistory';
import DeliveryAdress from '../Screens/Addresses/DeliveryAdress';
import AddAddress from '../Screens/Addresses/AddAddress';
import OrderHistoryStack from './OrderHistoryStack';
const Stack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="OrderHistoryStack" component={OrderHistoryStack} />
      <Stack.Screen name="DeliveryAdress" component={DeliveryAdress} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
