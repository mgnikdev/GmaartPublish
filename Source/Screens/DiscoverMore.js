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
import Header from '../Components/Header.js';
import {color} from '../Helper/Global';
import {SliderBox} from 'react-native-image-slider-box';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class DiscoverMore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 1,
      interval: null,
      discoverData: [
        {value: 'oil'},
        {value: 'Sugar'},
        {value: 'Biscuit'},
        {value: 'Mustered oil'},
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
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          url: 'https://st2.depositphotos.com/3382541/8314/v/950/depositphotos_83141768-stock-illustration-fruit-shop-salesman-sale-process.jpg',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          url: 'https://image.freepik.com/free-vector/summer-sale-template-with-different-fruits_23-2147797447.jpg',
        },
      ],
    };
  }
  renderItemDiscover = ({item}) => (
    <View
      style={{
        backgroundColor: '#E0E0E0',
        margin: 6,
        height: 30,
        borderRadius: 5,
      }}>
      <Text style={{margin: 6}}>{item.value}</Text>
    </View>
  );
  renderItem = ({item}) => (
    <View style={{marginTop: 15}}>
      <Image style={styles.productImg} source={{uri: item.url}} />
      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>15%</Text>
        <Text style={styles.offText}>off</Text>
      </View>
      <View style={styles.rupeesContainer}>
        <Text style={styles.rupeesText}>₹ 0</Text>
        <Text style={styles.productName}>Amul Butter</Text>
        <Text style={{color: 'gray'}}>100 g - Pouch</Text>
        <View style={styles.addContainer}>
          <Text style={styles.addText}>ADD</Text>
          <Icon
            name="plus"
            size={20}
            color={'white'}
            style={{marginLeft: 15}}
          />
        </View>
      </View>
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

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />
        <Header
          navigation={this.props.navigation}
          data={data => {
            console.log('Discover data from header', data);
          }}
        />

        <View style={{backgroundColor: 'white'}}>
          <Text style={styles.discoverText}>Discover More</Text>
          <FlatList
            horizontal
            style={{backgroundColor: 'white', marginTop: 8}}
            data={this.state.discoverData}
            renderItem={this.renderItemDiscover}
            //   keyExtractor={item => item.id}
          />
        </View>
        <View style={{backgroundColor: 'white', marginTop: 8, flex: 1}}>
          <Text style={styles.recommendedText}>Recommended products</Text>
          <FlatList
            horizontal
            style={{backgroundColor: 'white', marginTop: 8}}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  recommendedText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    margin: 15,
    marginBottom: 0,
  },
  discoverText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    margin: 15,
    marginBottom: 0,
  },
  addText: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 22,
  },
  addContainer: {
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
  productName: {
    marginRight: 4,
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    marginTop: 10,
  },
  rupeesText: {
    marginRight: 4,
    fontSize: 17,
    fontWeight: '700',
    color: 'black',
  },
  rupeesContainer: {
    margin: 10,
    marginLeft: 25,
    alignItems: 'center',
    justifyContent: 'center',
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
    top: -10,
    overflow: 'hidden',
    borderRadius: 5,
  },
  productImg: {
    height: 100,
    width: windowWidth / 5,
    alignSelf: 'center',
    marginLeft: 15,
    overflow: 'hidden',
  },
});
