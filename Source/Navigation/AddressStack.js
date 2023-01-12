import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import TotalBill from '../Screens/TotalBill';
import ChooseDeliverAddress from '../Screens/Addresses/ChooseDeliverAddress';
import AddAddress from '../Screens/Addresses/AddAddress';
import DeliveryAdress from '../Screens/Addresses/DeliveryAdress';
const Stack = createStackNavigator();

function AddressStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="TotalBill" component={TotalBill} />
      <Stack.Screen
        name="ChooseDeliverAddress"
        component={ChooseDeliverAddress}
      />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="DeliveryAdress" component={DeliveryAdress} />
    </Stack.Navigator>
  );
}

export default AddressStack;
