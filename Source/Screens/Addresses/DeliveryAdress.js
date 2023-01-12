import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {Component} from 'react';
import SavedAddressContainer from './SavedAddressContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class DeliveryAdress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      addressArray: [],
    };
    console.log('Delivery Porps', this.props);
  }
  updateData(val) {
    console.log('updateData', val);
  }
  componentDidMount() {
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.addressList();
    });
  }
  async addressList() {
    this.setState({loading: true});
    var patnerId = await AsyncStorage.getItem('patnerId');

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: JSON.parse(patnerId),
      },
    });
    console.log('raw', raw);

    POST('user/addresses', raw)
      .then(response => {
        this.setState({addressArray: response.result.response[0]});
        console.log('addresses list Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  renderItem = ({item}) => (
    <SavedAddressContainer
      item={item}
      navigation={this.props.navigation}
      updateData={data => this.addressList(data)}
    />
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
  renderEmpty = () => (
    <Text
      style={{
        fontSize: 18,
        fontWeight: '600',
        color: 'gray',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
      }}>
      You have no Addresses
    </Text>
  );
  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <View style={styles.headerContainer}>
          <Icon
            style={styles.backBtn}
            name="keyboard-backspace"
            size={30}
            color="white"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.headerText}>Delivery Address</Text>
        </View>
        <FlatList
          style={{backgroundColor: 'white'}}
          data={this.state.addressArray}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.renderSeparator}
        />
        {/* {this.state.addressArray.length == 0 && ( */}
        {/* <TouchableOpacity
          style={styles.addAddress}
          onPress={() => this.props.navigation.navigate('AddAddress')}>
          <Ionicons
            name="add"
            size={28}
            color={color.Primary}
            style={{alignSelf: 'center', marginLeft: 10, marginRight: 5}}
          />
          <Text
            style={{
              color: 'gray',
              fontWeight: '500',
              fontSize: 18,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            Add Address
          </Text>
        </TouchableOpacity> */}
        {/* )} */}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  addAddress: {
    height: 50,
    width: '93%',
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  backBtn: {
    position: 'absolute',
    left: 10,
    overflow: 'hidden',
    top: Platform.OS == 'ios' ? 45 : 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: Platform.OS == 'ios' ? 35 : 0,
  },
  headerContainer: {
    height: Platform.OS == 'ios' ? 85 : 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Primary,
    marginTop: Platform.OS == 'ios' ? -55 : 0,
  },
});
