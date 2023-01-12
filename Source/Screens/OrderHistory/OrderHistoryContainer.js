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
import Mcon from 'react-native-vector-icons/Ionicons';

import React, {Component} from 'react';
import {color} from '../../Helper/Global';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class OrderHistoryContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productQty: 1,
    };
  }
  incrementProduct() {
    this.setState({productQty: this.state.productQty + 1});
  }
  render() {
    const item = this.props.item;
    return (
      <View style={{flexDirection: 'row'}}>
        <Image
          style={styles.productImg}
          source={{
            uri: `data:image/png;base64,${item.image}`,
          }}
          resizeMode={'contain'}
        />
        {/* <View style={styles.discountContainer}>
          <Text style={styles.discountText}>15%</Text>
          <Text style={styles.offText}>off</Text>
        </View> */}
        <View style={{margin: 20, marginLeft: 0}}>
          <Text style={styles.productName}>{item.product_name}</Text>
          <Text style={styles.rupeesText}>{item.attribute}</Text>
          <Text
            style={{
              marginRight: 4,
              fontWeight: '400',
              marginTop: 5,
              color: 'red',
            }}>
            Qty : {item.qty}
          </Text>

          <Text style={[styles.rupeesText, {color: color.Primary}]}>
            ₹ {item.sales_price.toFixed(0) * item.qty}
          </Text>
          {/* <Text style={styles.rupeesText}>₹ {item.sales_price}</Text> */}
        </View>
        {/* <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addContainer}
          onPress={() => {
            // this.incrementProduct();
          }}>
          <Text style={styles.addText}>ADD</Text>
          <Icon
            name="plus"
            size={28}
            color={'white'}
            style={{marginLeft: 15}}
          />
        </TouchableOpacity> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addText: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  addContainer: {
    backgroundColor: color.Primary,
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
    width: 280,
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
