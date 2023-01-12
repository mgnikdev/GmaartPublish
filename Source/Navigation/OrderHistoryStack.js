import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import OrderHistory from '../Screens/OrderHistory/OrderHistory';
import SalesOrderHistory from '../Screens/OrderHistory/SalesOrderHistory';

const Stack = createStackNavigator();

function OrderHistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SalesOrderHistory" component={SalesOrderHistory} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
    </Stack.Navigator>
  );
}

export default OrderHistoryStack;
