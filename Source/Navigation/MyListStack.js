import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import Payment from '../Screens/Payment';
import Cart from '../Screens/Cart/Cart';
import AddressStack from './AddressStack';
const Stack = createStackNavigator();

function MyListStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="AddressStack" component={AddressStack} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
}

export default MyListStack;
