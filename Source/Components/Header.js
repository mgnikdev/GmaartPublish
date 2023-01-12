import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import React, {Component} from 'react';
import {color} from '../Helper/Global';
import Icon from 'react-native-vector-icons/Ionicons';
import Mcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {POST} from '../Helper/ApiManger/Apis';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      productData: [],
      profilePic: '',
    };
    console.log('props of header', this.props);
  }
  componentDidMount() {
    this.profileData();
  }
  async profileData() {
    this.setState({loading: true});

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
          profilePic: `data:image/png;base64,${response.result.response[0].image}`,
          loading: false,
        });
        console.log('profile Response ', response.result.response[0]);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  searchText = e => {
    console.log('searchaatext', e);

    this.props.data(e);
  };
  render() {
    return (
      <View
        style={{
          height:
            this.props.screenName == 'Home' ||
            this.props.screenName == 'ProductList' ||
            this.props.screenName == 'AllProductList'
              ? 80
              : 150,
          backgroundColor: color.Primary,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: Platform.OS == 'ios' ? -50 : -30,
            backgroundColor: color.Primary,
          }}>
          {this.props.screenName == 'ProductList' ? (
            <Mcon
              name="keyboard-backspace"
              size={30}
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
              style={{alignSelf: 'center', marginLeft: 10, marginTop: 45}}
            />
          ) : (
            <Mcon
              name="menu"
              size={30}
              color="#fff"
              onPress={() =>
                this.props.navigation.dispatch(DrawerActions.openDrawer())
              }
              style={{
                alignSelf: 'center',
                marginLeft: 10,
                marginTop: Platform.OS == 'ios' ? 55 : 45,
              }}
            />
          )}

          <View
            style={{
              flexDirection: 'row',
              marginTop: Platform.OS == 'ios' ? 55 : 45,
            }}>
            <Fcon
              name="box-open"
              size={20}
              color="#fff"
              onPress={() =>
                this.props.navigation.reset({
                  index: 0,
                  routes: [{name: 'AllProductList'}],
                })
              }
              style={{alignSelf: 'center'}}
            />

            <Mcon
              name="cart"
              size={25}
              color="#fff"
              onPress={() => this.props.navigation.navigate('MyListStack')}
              style={{alignSelf: 'center', marginLeft: 8, marginRight: 8}}
            />
            <TouchableOpacity
              style={[styles.profileContainer, styles.shadow]}
              onPress={() => this.props.navigation.navigate('Profile')}>
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
            </TouchableOpacity>
          </View>
        </View>
        {this.props.screenName == 'Home' ||
        this.props.screenName == 'ProductList' ||
        this.props.screenName == 'AllProductList' ? null : (
          <View style={styles.searchBar}>
            <Icon
              name="ios-search"
              size={25}
              color="#000"
              style={{alignSelf: 'center', marginLeft: 10}}
            />
            <TextInput
              style={styles.input}
              onChangeText={text => {
                this.setState({search: text}), this.searchText(text);
              }}
              value={this.state.search}
              placeholder="Search"
              placeholderTextColor="gray"
            />
            {/* <Mcon
            name="qrcode"
            size={30}
            color="#000"
            style={{alignSelf: 'center', marginRight: 10}}
          /> */}
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  searchBar: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginTop: Platform.OS == 'ios' ? 25 : 20,
    marginLeft: 15,
    marginRight: 15,
  },
  input: {
    height: 40,
    width: '90%',
    padding: 10,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    alignItems: 'center',
    color: 'black',
  },
});
