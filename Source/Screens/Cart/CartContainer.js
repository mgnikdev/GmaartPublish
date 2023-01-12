import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
const windowWidth = Dimensions.get('window').width;

export default class CartContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      product_name: '',
      productQty: 0,
    };
  }

  incrementProduct() {
    this.props.data(this.props.item, this.props.item.quantity + 1);
    // this.setState({productQty: this.state.productQty + 1}, () => {
    //   this.props.data(this.props.item, this.state.productQty);
    // });
  }
  decrementProduct() {
    this.props.item.quantity <= 1
      ? this.DeleteOrder()
      : this.props.data(this.props.item, this.props.item.quantity - 1);

    // this.setState(
    //   {
    //     productQty: this.state.productQty <= 1 ? 1 : this.state.productQty - 1,
    //   },
    //   () => {
    //     this.state.productQty < 1
    //       ? this.DeleteOrder()
    //       : this.props.data(this.props.item, this.state.productQty);
    //   },
    // );
  }
  async DeleteOrder() {
    console.log('DeleteOrder', this.props.item.line_id);

    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        mode: 'delete',
        line_id: this.props.item.line_id,
      },
    });
    console.log('DeleteOrder rawraw ', JSON.parse(raw));

    POST('edit/order', raw)
      .then(response => {
        this.setState({loading: false});

        this.props.displayCall();

        console.log('DeleteOrder Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  render() {
    const item = this.props.item;
    const price = item.sales_price * item.quantity;
    // console.log('cartContaineeer', item);
    return (
      <View style={{flexDirection: 'row'}}>
        {/* <TouchableOpacity style={{}} onPress={() => this.DeleteOrder()}> */}
        {item.quantity > 1 && (
          <Icon
            name="delete"
            size={20}
            color={color.Primary}
            style={{position: 'absolute', top: 10, right: 10}}
            onPress={() => this.DeleteOrder()}
          />
        )}
        {/* </TouchableOpacity> */}
        <Image
          style={styles.childProductImg}
          source={{
            uri: `data:image/png;base64,${item.image}`,
          }}
          resizeMode={'contain'}

          // source={require('../../Helper/Assets/banner2.jpeg')}
        />
        {/* <View style={styles.textContainer}>
          <Text style={styles.discount}>15%</Text>
          <Text style={styles.offText}>off</Text>
        </View> */}
        <View style={{margin: 20, marginLeft: 0}}>
          <Text
            style={styles.productName}
            // numberOfLines={1}
            // ellipsizeMode={'tail'}
          >
            {item.product_name}{' '}
            {/* <Text style={{color: 'gray'}}>100 g - Pouch</Text> */}
          </Text>
          <Text style={styles.rupeesText}>{item.attribute}</Text>

          <Text style={styles.rupeeText}>₹ {price.toFixed(0)}</Text>
        </View>
        <View style={styles.incrementContainer}>
          <TouchableOpacity
            onPress={() =>
              this.props.loading == false && this.decrementProduct()
            }
            style={{backgroundColor: color.Primary, borderRadius: 5}}>
            {item.quantity <= 1 ? (
              <Icon
                name="delete"
                size={20}
                color={'white'}
                style={{padding: 3, marginLeft: 3, marginRight: 3, padding: 5}}
              />
            ) : (
              <Icon
                name="minus"
                size={25}
                color={'white'}
                style={{padding: 3, marginLeft: 3, marginRight: 3}}
              />
            )}
          </TouchableOpacity>
          <View
            style={{
              borderRadius: 5,
              padding: 3,
              paddingLeft: 15,
              paddingRight: 15,
            }}>
            <Text style={{fontSize: 18, fontWeight: '800', color: 'gray'}}>
              {item.quantity}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              this.props.loading == false && this.incrementProduct()
            }
            style={{backgroundColor: color.Primary, borderRadius: 5}}>
            <Icon
              name="plus"
              size={25}
              color={'white'}
              style={{padding: 3, marginLeft: 3, marginRight: 3}}
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
    marginRight: 20,
    borderRadius: 5,
    backgroundColor: color.Primary,
    height: 40,
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
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
    width: 240,
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
