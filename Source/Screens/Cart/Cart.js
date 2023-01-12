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
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import Header from '../../Components/Header.js';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
import CartContainer from './CartContainer';
import Toast from 'react-native-simple-toast';
import Mcon from 'react-native-vector-icons/MaterialCommunityIcons';

const windowWidth = Dimensions.get('window').width;

export default class Cart extends Component {
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
      loading: false,
      productQty: 1,
      total: 0,
      tempData: [],
      name: false,
    };
    console.log('Cart props', this.props);
  }
  componentDidMount() {
    const {navigation} = this.props;
    if (this.props.route.params != undefined) {
      if (this.props.route.params.screenName == 'Account')
        this.setState({name: true});
    }
    this.focusListener = navigation.addListener('focus', () => {
      this.displayOrder();
    });
    this.displayOrder();
  }
  // componentWillMount() {
  //   const {navigation} = this.props;

  //   this.focusListener = navigation.addListener('focus', () => {
  //     this.displayOrder();
  //   });
  // }

  async cancelOrder() {
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
        this.props.navigation.replace('MyDrawer');
        // this.props.navigation.pop();
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  async displayOrder(item) {
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
        console.log('displayresponse', response);
        let datas = response.result.response.filter((e, i) => i !== 0);
        var total = 0;
        var mul;
        var additions = datas.map((e, i) => {
          mul = e.quantity * e.sales_price;
          total = total + mul;
          // console.log('ggggg', total);
        });
        this.setState({loading: false, cartData: datas, total: total});
        console.log('rrrrqrwe', 'cart', this.state.cartData);
        if (item == 'container' && this.state.cartData.length == 0) {
          this.props.navigation.replace('MyDrawer');
        }
        // console.log('addition Response ', additions, mul, this.state.total);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  async EditOrder(line_id, product_id, product_name, qty) {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mode: 'edit',
        line_id: line_id,
        order_line: [
          {
            product_id: product_id,
            name: product_name,
            product_uom_qty: qty,
            // price_unit: 50,
          },
        ],
      },
    });
    console.log('edit order rawraw ', JSON.parse(raw));

    POST('edit/order', raw)
      .then(response => {
        this.setState({loading: false});
        this.displayOrder();
        console.log('edit order Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  renderItem = ({item}) => (
    <CartContainer
      item={item}
      data={(val, val1) => {
        this.EditOrder(val.line_id, val.product_id, val.product_name, val1);
        console.log('dta value', val, val1);
      }}
      displayCall={() => this.displayOrder('container')}
      loading={this.state.loading}
    />
  );

  headerComponent = () => (
    <View
      style={{
        marginBottom: 8,
        flexDirection: 'row-reverse',
      }}>
      <TouchableOpacity
        style={[
          {
            marginTop: 0,
            borderRadius: 5,
            backgroundColor: color.Primary,
            height: 40,
            alignItems: 'center',
            textAlign: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginRight: 15,
            marginBottom: Platform.OS == 'ios' ? 20 : 0,
          },
        ]}
        onPress={() => {
          Alert.alert('', 'Are you sure, you want to clear your cart?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => this.cancelOrder()},
          ]);
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            alignSelf: 'center',
            textAlign: 'center',
            marginLeft: 15,
            marginRight: 15,
          }}>
          Clear Cart
        </Text>
      </TouchableOpacity>
    </View>
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
      }}>
      You have no Order Data
    </Text>
  );
  searchText = e => {
    let text = e.toLowerCase();
    let trucks = this.state.cartData;
    let filteredName = trucks.filter(item => {
      return item.product_name.toLowerCase().match(text);
    });
    if (!text || text === '') {
      this.setState({
        tempData: this.state.cartData,
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
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />

        {this.state.name ? (
          <View
            style={{
              height: Platform.OS == 'ios' ? 85 : 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: color.Primary,
              marginTop: Platform.OS == 'ios' ? -55 : 0,
            }}>
            <Mcon
              style={{
                position: 'absolute',
                left: 10,
                top: Platform.OS == 'ios' ? 45 : 10,
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
              Cart
            </Text>
          </View>
        ) : (
          <Header
            navigation={this.props.navigation}
            data={data => {
              console.log('search data from home', data);
              this.searchText(data);
            }}
          />
        )}
        {this.state.loading && (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color={color.Primary}
              style={{alignSelf: 'center'}}
            />
          </View>
        )}
        {/* <View style={styles.tagContainer}>
          <Icon
            name="google-maps"
            size={28}
            color={color.Primary}
            style={{alignSelf: 'center', marginLeft: 10}}
          />
          <Text style={styles.tagText}>
            Deliver to <Text style={{color: 'black'}}>360060</Text>
          </Text>
        </View> */}

        <FlatList
          style={{marginBottom: 90}}
          // onRefresh={this.displayOrder()}
          data={
            this.state.tempData.length != 0
              ? this.state.tempData
              : this.state.cartData
          }
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListEmptyComponent={this.renderEmpty}
          ListHeaderComponent={this.headerComponent}
        />

        {/* {this.state.ordersData.length != 0 && ( */}
        <View style={styles.footerContainer}>
          <View style={{margin: 10}}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
              Total : ₹ {this.state.total.toFixed(0)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() =>
              this.state.cartData.length == 0
                ? Toast.showWithGravity(
                    'Add Product First',
                    Toast.SHORT,
                    Toast.BOTTOM,
                  )
                : this.props.navigation.push('TotalBill')
            }>
            <Text style={styles.checkoutText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
        {/* )} */}
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
  checkoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  checkoutBtn: {
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: color.Primary,
    height: 40,
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: Platform.OS == 'ios' ? 20 : 0,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#303030',
    width: windowWidth,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagText: {
    textAlign: 'center',
    alignSelf: 'center',
    color: '#606060',
    fontSize: 18,
    fontWeight: '600',
  },
  tagContainer: {
    backgroundColor: '#c8c8c8',
    height: 40,
    flexDirection: 'row',
  },
  incrementContainer: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
  rupeeText: {
    marginRight: 4,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
    color: 'black',
  },
  productName: {
    marginRight: 4,
    fontSize: 17,
    fontWeight: '700',
    color: 'black',
  },
  offText: {
    textAlign: 'right',
    marginTop: -3,
    marginRight: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  discount: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  textContainer: {
    position: 'absolute',
    backgroundColor: color.Primary,
    left: 12,
    height: 35,
    width: 38,
    top: 10,
    overflow: 'hidden',
    borderRadius: 5,
  },
  childProductImg: {
    height: 100,
    width: windowWidth / 5,
    alignSelf: 'center',
    margin: 20,
    marginLeft: 25,
    overflow: 'hidden',
  },
});
