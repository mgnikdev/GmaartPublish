import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
import Verification from '../Screens/ForgotPassword/Verification';
import RecoveryPassword from '../Screens/ForgotPassword/RecoveryPassword';

const Stack = createStackNavigator();

function ForgotPasswordStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="RecoveryPassword" component={RecoveryPassword} />
    </Stack.Navigator>
  );
}

export default ForgotPasswordStack;
