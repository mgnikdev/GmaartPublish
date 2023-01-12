import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import {color} from '../Helper/Global';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {POST} from '../Helper/ApiManger/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class drawerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 1,
      interval: null,
      profilePic: '',
      name: '',
      email: '',
      phno: '',
      profilePic: '',
    };
  }
  componentDidMount() {
    this.profileData();
  }

  async profileData() {
    var patnerId = await AsyncStorage.getItem('patnerId');
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: JSON.parse(patnerId),
      },
    });
    POST('user/profile', raw)
      .then(response => {
        this.setState({
          name: response.result.response[0].name,
          email: response.result.response[0].email,
          phno: response.result.response[0].phone,
          profilePic: `data:image/png;base64,${response.result.response[0].image}`,
        });
        console.log('profile Response ', response.result.response[0]);
      })
      .catch(err => {
        console.log('Erroorr', err);
      });
  }
  async signOut() {
    await AsyncStorage.removeItem('orderId');
    await AsyncStorage.removeItem('patnerId');
    await AsyncStorage.removeItem('userId');

    this.props.navigation.replace('Welcome');
  }

  render() {
    return (
      <DrawerContentScrollView
        {...this.props}
        style={{flex: 1, marginTop: Platform.OS == 'ios' ? -55 : -10}}>
        <View style={styles.headerContainer}>
          <View style={[styles.profileContainer, styles.shadow]}>
            {this.state.profilePic == '' ? (
              <Icon
                name="person"
                size={25}
                color={color.Primary}
                style={{alignSelf: 'center'}}
              />
            ) : (
              <Image
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: 'center',
                  borderRadius: 50 / 2,
                }}
                source={{
                  uri: this.state.profilePic,
                }}
                // resizeMode={'contain'}
              />
            )}
          </View>
          <Text style={styles.helloText}>Hello, {this.state.name}</Text>
          <Icon
            name="close-outline"
            size={40}
            color={'white'}
            style={styles.closeMenu}
            onPress={() =>
              this.props.navigation.dispatch(DrawerActions.closeDrawer())
            }
          />
        </View>
        <ScrollView style={{marginBottom: 150}}>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.listText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() =>
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'AllProductList'}],
              })
            }>
            <Text style={styles.listText}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.props.navigation.navigate('CategoryListStack')}>
            <Text style={styles.listText}>Category</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.props.navigation.navigate('BrandStack')}>
            <Text style={styles.listText}>Brand</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.props.navigation.navigate('OrderHistoryStack')}>
            <Text style={styles.listText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.props.navigation.navigate('MyListStack')}>
            <Text style={styles.listText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.props.navigation.navigate('Profile')}>
            <Text style={styles.listText}>Account</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.listContainer}
            // onPress={() => this.props.navigation.navigate('Cart')}
          >
            <Text style={styles.listText}>Wallet</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={styles.listContainer}
            // onPress={() => this.props.navigation.navigate('Cart')}
          >
            <Text style={styles.listText}>Cashback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            // onPress={() => this.props.navigation.navigate('Cart')}
          >
            <Text style={styles.listText}>Gift Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            // onPress={() => this.props.navigation.navigate('Cart')}
          >
            <Text style={styles.listText}>Membership</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            // onPress={() => this.props.navigation.navigate('Cart')}
          >
            <Text style={styles.listText}>All offers</Text>
          </TouchableOpacity> */}
          {/* <Text style={styles.titleText}>Help & Settings</Text> */}
          {/* <TouchableOpacity
            style={styles.listContainer}
            // onPress={() => this.props.navigation.navigate('Cart')}
          >
            <Text style={styles.listText}>Guide</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={styles.listContainer}
            // onPress={() => this.props.navigation.navigate('Cart')}
          >
            <Text style={styles.listText}>Customer Service</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.listContainer}
            onPress={() =>
              Alert.alert('', 'Are You sure want to logout?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => this.signOut()},
              ])
            }>
            <Text style={styles.listText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </DrawerContentScrollView>
    );
  }
}
const styles = StyleSheet.create({
  titleText: {
    fontWeight: '500',
    color: 'black',
    fontSize: 18,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  listText: {
    padding: 15,
    color: 'gray',
    fontWeight: '500',
    fontSize: 18,
  },
  listContainer: {
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
  },
  closeMenu: {
    alignSelf: 'center',
    position: 'absolute',
    right: 10,
    bottom: 20,
  },
  helloText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingTop: Platform.OS == 'ios' ? 50 : 30,
    paddingBottom: 20,
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: color.Primary,
  },
  profileContainer: {
    borderRadius: 50 / 2,
    width: 50,
    height: 50,
    backgroundColor: 'white',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
});
