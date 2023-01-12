import {
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Mcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {POST} from '../../Helper/ApiManger/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import Header from '../../Components/Header.js';
import {color} from '../../Helper/Global';
import SalesOrderHistoryContainer from './SalesOrderHistoryContainer';
const windowWidth = Dimensions.get('window').width;

export default class SalesOrderHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ordersData: [],
      loading: false,
      tempData: [],
      screenName: '',
    };
  }
  componentDidMount() {
    if (this.props.route.params != undefined) {
      var params = this.props.route.params;
      this.setState({
        screenName: params.screenName,
      });
    }
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.userOrder();
    });
    // this.userOrder();
  }
  async userOrder() {
    this.setState({loading: true});
    var patnerId = await AsyncStorage.getItem('patnerId');
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: JSON.parse(patnerId),
        // partner_id: 7,
      },
    });
    console.log('userOrder raw', raw);
    POST('customer/saleorder', raw)
      .then(response => {
        // let filtered = response.result.response.filter(item => {
        //   const itemData = item.state;
        //   const textData = 'sale';
        //   return itemData.includes(textData);
        // });
        this.setState({
          ordersData: response.result.response,
          loading: false,
        });
        console.log('orders  Response from slaes order page ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  renderItem = ({item}) => (
    <SalesOrderHistoryContainer
      item={item}
      navigation={this.props.navigation}
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
        marginTop: 20,
        fontWeight: '600',
        color: 'gray',
        alignItems: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      You have no Order Data
    </Text>
  );
  searchText = e => {
    let text = e.toLowerCase();
    let trucks = this.state.ordersData;
    let filteredName = trucks.filter(item => {
      return item.name.toLowerCase().match(text);
    });
    if (!text || text === '') {
      this.setState({
        tempData: this.state.ordersData,
      });
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      // set no data flag to true so as to render flatlist conditionally
      this.setState({
        noData: true,
      });
    } else if (Array.isArray(filteredName)) {
      this.setState({
        noData: false,
        tempData: filteredName,
      });
    }
  };
  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.loading && (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color="#000"
              style={{alignSelf: 'center'}}
            />
          </View>
        )}
        {this.state.screenName == 'Account' ? (
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              height: Platform.OS == 'ios' ? 80 : 50,

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
              name="keyboard-backspace"
              size={30}
              color="white"
              onPress={() => this.props.navigation.goBack()}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: '700',
                marginTop: Platform.OS == 'ios' ? 35 : 0,
              }}>
              Order History
            </Text>
          </View>
        ) : (
          <Header
            navigation={this.props.navigation}
            data={data => {
              console.log('search data from SalesOrderHistory', data);
              this.searchText(data);
            }}
          />
        )}

        <FlatList
          style={{backgroundColor: 'white'}}
          data={
            this.state.tempData.length != 0
              ? this.state.tempData
              : this.state.ordersData
          }
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          // ItemSeparatorComponent={this.renderSeparator}
          ListEmptyComponent={this.renderEmpty}
        />
      </View>
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
});
