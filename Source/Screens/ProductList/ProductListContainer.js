import {
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {baseApiUrl, POST} from '../../Helper/ApiManger/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {baseApiUrl} from '../../Helper/ApiManger/Apis';
const windowWidth = Dimensions.get('window').width;

export default class ProductListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productQty: 1,
      isPress: false,
      loading: false,
      defaultValue: false,
    };
  }

  incrementProduct() {
    this.props.data(this.props.item, this.props.item.quantity + 1);
  }
  decrementProduct() {
    this.props.item.quantity < 1
      ? this.DeleteOrder()
      : this.props.data(this.props.item, this.props.item.quantity - 1);
  }

  async CreateOrder() {
    console.log('createOrder');
    this.props.isLoading(true);

    this.setState({loading: true});
    var patnerId = await AsyncStorage.getItem('patnerId');
    var userId = await AsyncStorage.getItem('userId');
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        partner_id: JSON.parse(patnerId),
        user_id: JSON.parse(userId),
        order_line: [
          {
            product_id: this.props.item.id,
            name: this.props.item.product_name,
            product_uom_qty: 1,
            // price_unit: this.props.item.sales_price,
          },
        ],
      },
    });
    POST('create/order', raw)
      .then(async response => {
        this.props.isLoading(false);

        this.props.updateState();
        this.props.updateOrder_id(response.result.response[0].order_id);
        this.setState({
          loading: false,
          isPress: true,
        });
        await AsyncStorage.setItem(
          'orderId',
          JSON.stringify(response.result.response[0].order_id),
        );

        console.log('order Response ', response);
      })
      .catch(err => {
        this.props.isLoading(false);

        this.setState({loading: false});
        console.log('Erroorr', err);
      });
  }

  async EditOrder() {
    var orderId = await AsyncStorage.getItem('orderId');
    this.props.isLoading(true);

    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mode: 'create',
        order_id: parseInt(orderId),
        order_line: [
          {
            product_id: this.props.item.id,
            name: this.props.item.product_name,
            product_uom_qty: 1,
            // price_unit: this.props.item.sales_price,
          },
        ],
      },
    });
    console.log('order rawraw ', JSON.parse(raw));

    POST('edit/order', raw)
      .then(async response => {
        this.props.isLoading(false);

        this.setState({
          loading: false,
          isPress: true,
        });
        // await AsyncStorage.setItem(
        //   'productId',
        //   JSON.stringify(this.state.productIdArray),
        // );
        // this.props.isPress(true);
        console.log('order mode create Response ', response);
      })
      .catch(err => {
        this.props.isLoading(false);

        this.setState({loading: false});
        console.log('Erroorr', err);
      });
  }

  async EditOrderedit(lineId, quantity) {
    this.props.isLoading(true);

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mode: 'edit',
        line_id: parseInt(lineId),
        order_line: [
          {
            product_id: this.props.item.product_id,
            name: this.props.item.product_name,
            product_uom_qty: quantity + 1,
            // price_unit: 50,
          },
        ],
      },
    });
    console.log('EditOrderedit order rawraw ', JSON.parse(raw));

    POST('edit/order', raw)
      .then(response => {
        this.props.isLoading(false);
        this.props.display();
        this.setState({
          isPress: true,
        });
        console.log('edit order Response ', response);
      })
      .catch(err => {
        this.props.isLoading(false);

        console.log('Erroorr', err);
      });
  }

  conditionss() {
    let filtered = this.props.cartData.filter(val => {
      const itemData = val.product_id.toString();
      const textData = this.props.item.id.toString();
      return itemData.includes(textData);
    });

    console.log('filterrrdd', this.props.cartData, filtered.length);

    if (this.state.loading == false) {
      if (
        this.props.editMode ||
        this.props.editModeHori ||
        this.props.cartData.length != 0
      ) {
        if (filtered.length != 0) {
          let newMarkers = [];
          newMarkers = this.props.cartData.map(el => {
            if (el.product_id === this.props.item.id) {
              console.log('el.line_id', el.product_id, el.line_id);
              this.EditOrderedit(el.line_id, el.quantity);
            }
          });
        } else {
          this.EditOrder();
        }
      } else {
        this.CreateOrder();
      }
    }
  }

  render() {
    const item = this.props.item;

    return (
      <View style={{flexDirection: 'row'}}>
        <Image
          style={styles.productImg}
          source={{
            uri: `data:image/png;base64,${item.image}`,
            // uri: 'https://image.freepik.com/free-vector/summer-sale-template-with-different-fruits_23-2147797447.jpg',
          }}
          resizeMode={'contain'}
        />
        {/* <View style={styles.discountContainer}>
          <Text style={styles.discountText}>15%</Text>
          <Text style={styles.offText}>off</Text>
        </View> */}
        <View style={{margin: 20, marginLeft: 0}}>
          <Text
            style={styles.productName}
            numberOfLines={3}
            // ellipsizeMode={'tail'}
          >
            {item.product_name}
          </Text>
          <Text style={styles.rupeesText}>{item.attribute}</Text>
          {item.default_price.toFixed(0) != item.sales_price.toFixed(0) && (
            <Text
              style={[
                styles.rupeesText,
                {
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                },
              ]}>
              ₹ {item.default_price.toFixed(0)}
            </Text>
          )}
          <Text style={[styles.rupeesText, {color: color.Primary}]}>
            ₹ {item.sales_price.toFixed(0)}
          </Text>
        </View>
        {this.state.isPress ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.addContainer,
              {
                backgroundColor: this.state.isPress
                  ? 'rgba(0,0,0,0.3)'
                  : color.Primary,
              },
            ]}>
            <Text style={styles.addText}>ADDED</Text>
            <Icon
              name="plus"
              size={28}
              color={'white'}
              style={{marginLeft: 15}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={this.state.isPress ? 0.9 : 0.8}
            style={[
              styles.addContainer,
              {
                backgroundColor: this.state.isPress
                  ? 'rgba(0,0,0,0.3)'
                  : color.Primary,
              },
            ]}
            onPress={() => {
              this.conditionss();
            }}>
            <Text style={styles.addText}>ADD</Text>
            <Icon
              name="plus"
              size={28}
              color={'white'}
              style={{marginLeft: 15}}
            />
          </TouchableOpacity>
        )}
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1000,
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
  addText: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    zIndex: 11111111,
  },
  addContainer: {
    // backgroundColor: color.Primary,
    position: 'absolute',
    bottom: 20,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
  },
  rupeesText: {
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
    width: 260,
  },
  offText: {
    textAlign: 'right',
    marginTop: -3,
    marginRight: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  discountText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  discountContainer: {
    position: 'absolute',
    backgroundColor: color.Primary,
    left: 12,
    height: 35,
    width: 38,
    top: 10,
    overflow: 'hidden',
    borderRadius: 5,
  },
  productImg: {
    height: 100,
    width: windowWidth / 5,
    alignSelf: 'center',
    margin: 20,
    marginLeft: 25,
    overflow: 'hidden',
  },
  filterText: {
    alignSelf: 'center',
    color: 'black',
    textAlign: 'center',
    fontWeight: '500',
    margin: 5,
    marginRight: 10,
  },
  filterContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    width: 90,
    alignSelf: 'flex-end',
    borderRadius: 6,
    marginRight: 15,
    margin: 5,
  },
});
