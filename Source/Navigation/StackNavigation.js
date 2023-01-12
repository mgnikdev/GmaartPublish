import React, {Component} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Splash from '../Screens/Splash';
import Welcome from '../Screens/AuthScreens/Welcome';
import Login from '../Screens/AuthScreens/Login';
import SignUp from '../Screens/AuthScreens/SignUp';
import Cart from '../Screens/Cart/Cart';

import Filter from '../Screens/Filter';
import ForgotPasswordStack from './ForgotPasswordStack';
import MyDrawer from './DrawerNavigation';
import Verification from '../Screens/ForgotPassword/Verification';
import ProductList from '../Screens/ProductList/ProductList';

import Payment from '../Screens/Payment';
import TotalBill from '../Screens/TotalBill';
import ChooseDeliverAddress from '../Screens/Addresses/ChooseDeliverAddress';
import AddAddress from '../Screens/Addresses/AddAddress';
import DeliveryAdress from '../Screens/Addresses/DeliveryAdress';
import AddressStack from './AddressStack';
import Home from '../Screens/Home';
import Profile from '../Screens/Profile/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryListStack from './CategoryListStack';
import BrandStack from './BrandStack';
import OrderHistory from '../Screens/OrderHistory/OrderHistory';
import SalesOrderHistory from '../Screens/OrderHistory/SalesOrderHistory';
import AllProductList from '../Screens/AllProductList/AllProductList';
import MyListStack from './MyListStack';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        // transitionSpec: 'open',
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="ForgotPasswordStack"
        component={ForgotPasswordStack}
      />

      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="TotalBill" component={TotalBill} />
      <Stack.Screen
        name="ChooseDeliverAddress"
        component={ChooseDeliverAddress}
      />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="DeliveryAdress" component={DeliveryAdress} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="MyDrawer" component={MyDrawer} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AllProductList" component={AllProductList} />
      <Stack.Screen name="SalesOrderHistory" component={SalesOrderHistory} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="CategoryListStack" component={CategoryListStack} />
      <Stack.Screen name="BrandStack" component={BrandStack} />
      <Stack.Screen name="MyListStack" component={MyListStack} />
    </Stack.Navigator>
  );
};
export default MyStack;
