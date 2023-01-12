import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';

import Mcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import ProfileContainer from './ProfileContainer';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePic: '',
      position: 1,
      interval: null,
      data: [
        {iconName: '', name: 'Order History', nextScreen: 'OrderHistoryStack'},
        {iconName: '', name: 'Cart', nextScreen: 'MyListStack'},
        // {iconName: '', name: 'Wish List', nextScreen: ''},
        // {iconName: '', name: 'Payment Methods', nextScreen: ''},
        {iconName: '', name: 'Delivery Address', nextScreen: 'DeliveryAdress'},
        // {iconName: '', name: 'Customer Service', nextScreen: ''},
        // {iconName: '', name: 'Help', nextScreen: ''},
        // {iconName: '', name: 'Rating', nextScreen: ''},
        {iconName: '', name: 'Sign Out', nextScreen: 'Welcome'},
      ],
      name: '',
      email: '',
      phno: '',
      loading: false,
    };
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
          name: response.result.response[0].name,
          email: response.result.response[0].email,
          phno: response.result.response[0].phone,
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

  renderItem = ({item}) => (
    <ProfileContainer item={item} navigation={this.props.navigation} />
  );

  renderSeparator = () => (
    <View
      style={{
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'gray',
        height: 0.5,
      }}
    />
  );
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        {this.state.loading && (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color="#000"
              style={{alignSelf: 'center'}}
            />
          </View>
        )}
        <StatusBar backgroundColor={color.Primary} />

        <View
          style={{
            height: Platform.OS == 'ios' ? 80 : 50,
            marginTop: Platform.OS == 'ios' ? -50 : 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color.Primary,
          }}>
          <Mcon
            style={{
              position: 'absolute',
              left: 10,
              top: Platform.OS == 'ios' ? 40 : 10,
              overflow: 'hidden',
            }}
            name="menu"
            size={30}
            color="white"
            onPress={() =>
              this.props.navigation.dispatch(DrawerActions.openDrawer())
            }
          />
          {/* <Mcon
            style={{
              position: 'absolute',
              left: 10,
              top: Platform.OS == 'ios' ? 40 : 10,
              overflow: 'hidden',
            }}
            name="keyboard-backspace"
            size={30}
            color="white"
            onPress={() => this.props.navigation.goBack()}
          /> */}
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '700',
              marginTop: Platform.OS == 'ios' ? 35 : 0,
            }}>
            Profile
          </Text>
        </View>

        <View style={{backgroundColor: '#e0e0e0', flexDirection: 'row'}}>
          <View
            style={[
              {
                margin: 20,
                borderRadius: 60 / 2,
                width: 60,
                height: 60,
                backgroundColor: 'white',
                marginRight: 15,
                alignItems: 'center',
                justifyContent: 'center',
              },
              styles.shadow,
            ]}>
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
                  width: 60,
                  height: 60,
                  alignSelf: 'center',
                  borderRadius: 60 / 2,
                }}
                source={{
                  uri: this.state.profilePic,
                }}
                // resizeMode={'contain'}
              />
            )}
          </View>
          <View style={{marginTop: 20, marginBottom: 20}}>
            <Text style={{color: 'black', fontWeight: '800'}}>
              {this.state.name}
            </Text>
            <Text style={{color: 'gray', fontWeight: '600'}}>
              {this.state.email}
            </Text>

            <Text style={{color: 'gray', fontWeight: '600'}}>
              {this.state.phno}
            </Text>
          </View>
          {/* <Text
            style={{
              color: color.Primary,
              fontWeight: '500',
              position: 'absolute',
              bottom: 20,
              right: 20,
            }}>
            Edit
          </Text> */}
        </View>
        <ScrollView>
          <FlatList
            style={{backgroundColor: 'white', marginBottom: 35}}
            data={this.state.data}
            renderItem={this.renderItem}
            //   keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
          />
          {/* <Text style={{textAlign: 'center', color: 'gray', fontWeight: '500'}}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </Text> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  activityLoader: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 1000,
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
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  input: {
    height: 40,
    width: '80%',
    padding: 10,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    alignItems: 'center',
  },
});
