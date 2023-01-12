import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ProductList from '../Screens/ProductList/ProductList';

import BrandList from '../Screens/BrandList/BrandList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const patnerID = AsyncStorage.getItem('patnerId');
function BrandStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="BrandList" component={BrandList} />
      <Stack.Screen name="ProductList" component={ProductList} />
    </Stack.Navigator>
  );
}
export default BrandStack;
