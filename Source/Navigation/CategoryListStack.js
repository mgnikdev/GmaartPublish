import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import ProductList from '../Screens/ProductList/ProductList';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryList from '../Screens/CategoryList/CategoryList';

const Stack = createStackNavigator();
const patnerID = AsyncStorage.getItem('patnerId');
function CategoryListStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CategoryList" component={CategoryList} />

      <Stack.Screen name="ProductList" component={ProductList} />
    </Stack.Navigator>
  );
}
export default CategoryListStack;
