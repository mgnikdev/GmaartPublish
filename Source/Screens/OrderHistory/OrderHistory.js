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
  Alert,
} from 'react-native';
import Mcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';

import {POST} from '../../Helper/ApiManger/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import Header from '../../Components/Header.js';
import {color} from '../../Helper/Global';
import OrderHistoryContainer from './OrderHistoryContainer';
import RazorpayCheckout from 'react-native-razorpay';

const windowWidth = Dimensions.get('window').width;

export default class OrderHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ordersData: [],
      loading: false,
      total: '',
      paymentSuccess: false,
      stageShow: true,
      name: '',
      email: '',
      phno: '',
      addressArray: [],
    };
    console.log('iiiddd', this.props.route.params.id);
  }
  componentDidMount() {
    if (this.props.route.params != undefined) {
      this.setState({
        ordersData: this.props.route.params.item,
        total: this.props.route.params.total.toFixed(0),
        stage: this.props.route.params.stage,
      });
      if (this.props.route.params.stage == 'draft') {
        this.setState({stageShow: false});
      }
      if (this.props.route.params.stage == 'sent') {
        this.setState({stageShow: false});
      }
    }
    this.profileData();
    this.addressList();
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
        console.log(
          'addresses Response ',
          response,
          this.state.addressArray[0],
        );
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  cancelOrder = () => {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        order_id: this.props.route.params.id,
      },
    });
    console.log('cancel/saleorder', raw);

    POST('cancel/saleorder', raw)
      .then(async response => {
        console.log('cancel/saleorder', response);
        if (response.result.status == 409) {
          alert(response.result.message);
          this.setState({loading: false});
        } else {
          this.setState({loading: false, ordersData: []});
          this.props.navigation.pop();
        }
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  };
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
          phno: response.result.response[0].mobile,
          loading: false,
        });
        console.log('profile Response ', response.result.response[0]);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  _onPressButton() {
    var amount = this.state.total + 0;
    var amt1 = amount * 10;
    console.log('aaammmoun', amt1);
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_live_sTDM9CcMJmvbtJ',
      amount: amt1,
      name: 'RJK Marketing',

      prefill: {
        email: this.state.email,
        contact: this.state.phno,
        name: this.state.name,
      },
      theme: {color: '#F37254'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        this.submitRazorKey(data.razorpay_payment_id);
        console.log(`Success: ${data.razorpay_payment_id}`);
      })
      .catch(error => {
        // handle failure
        console.log(`Error: ${error.code} | ${error.description}`);
      });
  }
  async submitRazorKey(payment_ref) {
    this.setState({loading: true});
    var orderId = await AsyncStorage.getItem('orderId');
    console.log('oooorrrderId', orderId);
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        order_id: this.props.route.params.id,
        payment_ref: payment_ref,
      },
    });
    POST('order/paymentref', raw)
      .then(response => {
        console.log('payment_ref Response ', response);
        if (response.result.status == 409) {
          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );
        } else if (response.result.status == 200) {
          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );

          this.setState({paymentSuccess: true});
          this.clearCart();
          this.props.navigation.replace('SalesOrderHistory');
        } else {
          Toast.showWithGravity(
            'something went wrong',
            Toast.SHORT,
            Toast.BOTTOM,
          );
        }
      })
      .catch(err => {
        this.setState({loading: false});

        console.log(' payment_ref Erroorr', err);
      });
  }
  async clearCart() {
    this.setState({loading: true});
    var orderId = await AsyncStorage.getItem('orderId');

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        order_id: this.props.route.params.id,
      },
    });
    console.log('empty/cart', raw);

    POST('empty/cart', raw)
      .then(async response => {
        console.log('empty/cart', response);
        this.setState({loading: false});
        var orderId = await AsyncStorage.removeItem('orderId');
        // this.props.navigation.pop();
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
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
    POST('customer/saleorder', raw)
      .then(response => {
        this.setState({
          ordersData: response.result.response[0].products,
          loading: false,
        });
        console.log('orders Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  renderItem = ({item}) => (
    <OrderHistoryContainer item={item} navigation={this.props.navigation} />
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
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.loading && (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color="#000"
              style={{alignSelf: 'center'}}
            />
          </View>
        )}
        <View
          style={{
            height: Platform.OS == 'ios' ? 80 : 50,
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
            G maart
          </Text>
        </View>
        {/* <Header
          navigation={this.props.navigation}
          data={data => {
            console.log('search data from category', data);
            this.searchText(data);
          }}
        /> */}
        {this.state.stageShow == false || this.state.paymentSuccess == false ? (
          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: color.Primary,
              height: 40,
              width: 150,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 10,
              top: 60,
              overflow: 'hidden',
            }}
            onPress={() => {
              Alert.alert('', 'Are you sure you want to Cancel this Order?', [
                {
                  text: 'NO',
                  style: 'cancel',
                },
                {text: 'YES', onPress: () => this.cancelOrder()},
              ]);
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: '600',
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        ) : null}

        <FlatList
          style={{
            backgroundColor: 'white',
            marginTop: this.state.stageShow == false ? 50 : 0,
          }}
          data={this.state.ordersData}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListEmptyComponent={this.renderEmpty}
        />
        <View
          style={{
            backgroundColor: '#303030',
            width: windowWidth,
            paddingBottom: 20,
            paddingTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{margin: 10}}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
              Total : ₹ {this.state.total}
            </Text>
          </View>
          {this.state.stageShow == false ? (
            <TouchableOpacity
              style={{
                marginRight: 20,
                borderRadius: 5,
                backgroundColor: color.Primary,
                height: 40,
                alignItems: 'center',
                textAlign: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                (this.state.addressArray[0].street == false &&
                  this.state.addressArray[0].street2 == false) ||
                (this.state.addressArray[0].street == '' &&
                  this.state.addressArray[0].street2 == '')
                  ? Toast.showWithGravity(
                      'Update Delivery Address',
                      Toast.SHORT,
                      Toast.BOTTOM,
                    )
                  : this._onPressButton();
                // this.submitRazorKey();
                // this.props.navigation.navigate('Payment');
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600',
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                MAKE PAYMENT
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
