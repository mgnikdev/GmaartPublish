import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './Source/Navigation/StackNavigation';
import Home from './Source/Components/drawerComponent';
import 'react-native-gesture-handler';
import DrawerNavigation from './Source/Navigation/DrawerNavigation';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerComponent from './Source/Components/drawerComponent';
const Drawer = createDrawerNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        {/* <StackNavigation /> */}
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
          }}
          // initialRouteName="Home"
          drawerContent={props => <DrawerComponent {...props} />}
          drawerStyle={{width: '100%'}}>
          <Drawer.Screen
            name="StackNavigation"
            component={StackNavigation}
            options={{
              swipeEnabled: false,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
      // <Home />
    );
  }
}
