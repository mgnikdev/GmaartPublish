import {
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';

import React, {Component} from 'react';
import Header from '../Components/Header.js';
import {color} from '../Helper/Global';
import {SliderBox} from 'react-native-image-slider-box';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';
import {POST} from '../Helper/ApiManger/Apis';
import RazorpayCheckout from 'react-native-razorpay';

export default class TotalBill extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 1,
      interval: null,
      images: [
        'https://www.homebethe.com/image/home_page/2020/october/Grocery-Banner.png',
        'https://cdn1.vectorstock.com/i/1000x1000/28/15/shopping-basket-with-grocery-products-sale-banner-vector-33852815.jpg', // Network image
        'https://media.istockphoto.com/vectors/grocery-shopping-promotional-sale-banner-vector-id1198467447',
        // require('./assets/images/girl.jpg'),          // Local image
      ],
      data: [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          url: 'https://st2.depositphotos.com/3382541/8314/v/950/depositphotos_83141768-stock-illustration-fruit-shop-salesman-sale-process.jpg',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          url: 'https://image.freepik.com/free-vector/summer-sale-template-with-different-fruits_23-2147797447.jpg',
        },
      ],
      cartData: [],
      total: 0,
      totalAmount: 0,
      paymentSuccess: false,
      addressArray: [],
      name: '',
      email: '',
      phno: '',
    };
    console.log('total bill props', this.props, this.props.route);
  }
  _onPressButton() {
    var amount = this.state.total.toFixed(0);
    var amt1 = amount * 100;
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
        // Toast.showWithGravity(
        //   `Error: ${error.description}`,
        //   Toast.SHORT,
        //   Toast.BOTTOM,
        // );
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
        order_id: parseInt(orderId),
        payment_ref: payment_ref,
      },
    });
    POST('order/paymentref', raw)
      .then(async response => {
        console.log('payment_ref Response ', response);
        if (response.result.status == 409) {
          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );
        } else if (response.result.status == 200) {
          await AsyncStorage.removeItem('orderId');

          Toast.showWithGravity(
            response.result.message,
            Toast.SHORT,
            Toast.BOTTOM,
          );
          this.setState({paymentSuccess: true});
          this.clearCart();
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
        order_id: parseInt(orderId),
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
  async displayOrder() {
    this.setState({loading: true});
    var orderId = await AsyncStorage.getItem('orderId');
    console.log('oooorrrderId', orderId);
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mode: 'display',
        order_id: parseInt(orderId),
      },
    });
    POST('edit/order', raw)
      .then(response => {
        let datas = response.result.response.filter((e, i) => i !== 0);
        var total = 0;
        var mul;
        var additions = datas.map((e, i) => {
          mul = e.quantity * e.sales_price;
          total = total + mul;
          console.log('ggggg', total);
        });
        var totalAmount = total + 0;
        this.setState({
          loading: false,
          cartData: datas,
          total: total,
          totalAmount: totalAmount.toFixed(0),
        });

        console.log('displayorder Response ', response, totalAmount.toFixed(2));
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  renderItem = ({item}) => {
    const price = item.sales_price * item.quantity;
    return (
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{
            height: 100,
            width: windowWidth / 5,
            alignSelf: 'center',
            margin: 20,
            marginLeft: 25,
            overflow: 'hidden',
          }}
          source={{
            uri: `data:image/png;base64,${item.image}`,
          }}
          resizeMode={'contain'}
          // source={{uri: item.url}}
        />

        <View style={{margin: 20, marginLeft: 0}}>
          <Text
            style={{
              marginRight: 4,
              fontSize: 17,
              fontWeight: '700',
              color: 'black',
              width: 250,
            }}>
            {item.product_name}
          </Text>
          <Text
            style={{
              marginRight: 4,
              fontSize: 17,
              fontWeight: '700',
              marginTop: 5,
              color: 'black',
            }}>
            {item.attribute}
          </Text>

          <Text
            style={{
              marginRight: 4,
              fontSize: 17,
              fontWeight: '700',
              marginTop: 5,
              color: 'black',
            }}>
            ₹ {price.toFixed(0)}
          </Text>
          <Text
            style={{
              marginRight: 4,
              fontWeight: '400',
              marginTop: 5,
              color: 'red',
            }}>
            Qty : {item.quantity}
          </Text>
        </View>
      </View>
    );
  };

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
  componentDidMount() {
    const {navigation} = this.props;

    this.displayOrder();
    this.focusListener = navigation.addListener('focus', () => {
      this.addressList();
    });
    this.profileData();
    this.addressList();
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
          phno: response.result.response[0].mobile,
        });
        console.log('profile Response ', response.result.response[0]);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
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
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />

        <View
          style={{
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color.Primary,
          }}>
          <Icon
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              overflow: 'hidden',
            }}
            name="keyboard-backspace"
            size={30}
            color="white"
            onPress={() => this.props.navigation.pop()}
          />
          <Text style={{color: 'white', fontSize: 20, fontWeight: '700'}}>
            G maart
          </Text>
        </View>
        <ScrollView style={{paddingBottom: 200}}>
          <View style={{backgroundColor: 'white'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: '500',
                margin: 15,
                marginBottom: 0,
              }}>
              {this.state.addressArray.length == 0 ? `` : `Delivery Address`}
            </Text>

            {this.state.addressArray.length == 0 ? null : (
              <View style={{borderRadius: 8, borderWidth: 1, margin: 10}}>
                {this.state.addressArray[0].name ? (
                  <Text style={{color: 'black', marginTop: 5, marginLeft: 10}}>
                    {this.state.addressArray[0].name}
                  </Text>
                ) : null}
                {this.state.addressArray[0].street != false ? (
                  <Text style={{color: 'black', marginLeft: 10}}>
                    {this.state.addressArray[0].street}
                  </Text>
                ) : null}
                {this.state.addressArray[0].street2 != false ? (
                  <Text style={{color: 'black', marginLeft: 10}}>
                    {this.state.addressArray[0].street2}
                  </Text>
                ) : null}
                {this.state.addressArray[0].city ? (
                  <Text
                    style={{color: 'black', marginLeft: 10, marginBottom: 10}}>
                    {this.state.addressArray[0].city},{' '}
                    {this.state.addressArray[0].zip
                      ? this.state.addressArray[0].zip
                      : null}
                    ,{' '}
                    {this.state.addressArray[0].state_id != '' &&
                      `${this.state.addressArray[0].state_id[1]}`}
                  </Text>
                ) : null}
                {(this.state.addressArray[0].street == false &&
                  this.state.addressArray[0].street2 == false) ||
                (this.state.addressArray[0].street == '' &&
                  this.state.addressArray[0].street2 == '') ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: color.Primary,
                      alignSelf: 'flex-end',
                      marginRight: 8,
                      marginBottom: 8,
                      borderRadius: 5,
                    }}
                    onPress={() =>
                      this.props.navigation.push('AddAddress', {
                        item: this.state.addressArray[0],
                        screenName: 'TotalBill',
                      })
                    }>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        padding: 8,
                        fontWeight: '500',
                      }}>
                      Add Address
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>

          <FlatList
            style={{backgroundColor: 'white', marginTop: 8}}
            data={this.state.cartData}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
          />

          <View
            style={{backgroundColor: 'white', marginTop: 10, marginBottom: 10}}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: '500',
                margin: 15,
                marginBottom: 0,
              }}>
              Payment Details
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                }}>
                MRP Total
              </Text>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                }}>
                ₹ {this.state.totalAmount}
              </Text>
            </View>
            <View
              style={{
                borderColor: 'gray',
                borderBottomWidth: 1,
                width: '93%',
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                }}>
                Delivery Charge
              </Text>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                }}>
                ₹ 0
              </Text>
            </View>

            <View
              style={{
                borderColor: 'gray',
                borderBottomWidth: 1,
                width: '93%',
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                }}>
                Total Amount
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                }}>
                ₹ {this.state.totalAmount}
              </Text>
            </View>

            <View
              style={{
                borderRadius: 5,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
                backgroundColor: color.Primary,
                margin: 10,
                marginTop: 0,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                  margin: 5,
                }}>
                Total Amount
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 0,
                  margin: 5,
                }}>
                ₹ {this.state.totalAmount}
              </Text>
            </View>
          </View>
        </ScrollView>
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
              Total : ₹ {this.state.totalAmount}
            </Text>
          </View>
          {this.state.paymentSuccess == false ? (
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
      </SafeAreaView>
    );
  }
}
