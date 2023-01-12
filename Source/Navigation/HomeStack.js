import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import Payment from '../Screens/Payment';
import Cart from '../Screens/Cart/Cart';
import AddressStack from './AddressStack';
import ProfileStack from './ProfileStack';
import MyListStack from './MyListStack';
import CategoryListStack from './CategoryListStack';
import BrandStack from './BrandStack';
import Home from '../Screens/Home';
import ProductList from '../Screens/ProductList/ProductList';
import AllProductList from '../Screens/AllProductList/AllProductList';
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="MyListStack" component={MyListStack} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="AllProductList" component={AllProductList} />
      <Stack.Screen name="CategoryListStack" component={CategoryListStack} />

      <Stack.Screen name="BrandStack" component={BrandStack} />
    </Stack.Navigator>
  );
}

export default HomeStack;
