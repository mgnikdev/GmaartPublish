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

export default class ProductHorizontal extends Component {
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
      <View style={{marginLeft: 5}}>
        <Image
          style={styles.productImgHorizontal}
          source={{
            uri: `data:image/png;base64,${item.image}`,
          }}
          resizeMode={'contain'}
        />
        <View style={styles.rupeesContainer}>
          <Text style={styles.rupeesText}>{item.attribute}</Text>
          {item.default_price.toFixed(0) != item.sales_price.toFixed(0) ? (
            <Text
              style={[
                styles.rupeesTextHorizontal,
                {
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                },
              ]}>
              ₹ {item.default_price.toFixed(0)}
            </Text>
          ) : (
            <Text
              style={[
                styles.rupeesTextHorizontal,
                {
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                },
              ]}></Text>
          )}
          <Text style={[styles.rupeesTextHorizontal, {color: color.Primary}]}>
            ₹ {item.sales_price.toFixed(0)}
          </Text>
          <Text style={styles.productNameHorizontal}>{item.product_name}</Text>

          <TouchableOpacity
            style={[
              styles.addContainerHorizontal,
              {
                backgroundColor: this.state.isPress
                  ? 'rgba(0,0,0,0.3)'
                  : color.Primary,
              },
            ]}
            activeOpacity={this.state.isPress ? 0.9 : 0.8}
            onPress={() => {
              // this.props.editMode ||
              // this.props.editModeHori ||
              // this.props.cartData.length != 0
              //   ? this.EditOrder()
              //   : this.CreateOrder();

              this.conditionss();
            }}>
            <Text style={styles.addTextHorizontal}>
              {this.state.isPress ? `ADDED` : `ADD`}
            </Text>
            <Icon
              name="plus"
              size={20}
              color={'white'}
              // style={{marginLeft: 15}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rupeesText: {
    marginRight: 4,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
    color: 'black',
  },
  rupeesContainer: {
    margin: 10,
    // marginLeft: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTextHorizontal: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 22,
  },
  addContainerHorizontal: {
    backgroundColor: color.Primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    marginTop: 6,
  },
  productNameHorizontal: {
    marginRight: 4,
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    marginTop: 10,
    width: 120,
    height: 100,
    alignSelf: 'center',
    textAlign: 'center',
    margin: 5,
  },
  rupeesTextHorizontal: {
    marginRight: 4,
    fontSize: 17,
    fontWeight: '700',
    color: 'black',
    alignSelf: 'center',
    textAlign: 'center',
  },
  productImgHorizontal: {
    backgroundColor: 'white',
    height: 100,
    width: 100,
    alignSelf: 'center',
    // marginLeft: 15,
    overflow: 'hidden',
  },
});
