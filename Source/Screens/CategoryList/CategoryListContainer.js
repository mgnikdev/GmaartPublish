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
const windowWidth = Dimensions.get('window').width;
export default class CategoryListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPress: false,
      loading: false,
    };
  }
  selectCategory(id) {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        // public_categ_id: parseInt(this.state.categorySelectedId),
        public_categ_id: id,
      },
    });
    console.log('raw  ', raw);

    POST('filter/category', raw)
      .then(response => {
        this.props.navigation.navigate('ProductList', {
          item: response.result.response,
          screenName: 'CategoryGrid',
          id: id,
        });
        // this.next(response.result.response);
        console.log('selectCategory Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  next(item) {
    this.props.navigation.navigate('ProductList', {
      item: item,
      screenName: 'CategoryGrid',
    });
  }

  render() {
    const item = this.props.item;

    return (
      <TouchableOpacity
        style={{
          marginLeft: 8,
          marginRight: 8,
          borderWidth: 1,
          borderRadius: 10,
          marginTop: 8,
        }}
        onPress={() => {
          this.selectCategory(item.id);
        }}>
        <Image
          style={{
            height: 60,
            width: windowWidth / 3.5,
            alignSelf: 'center',
            marginTop: 8,
            // marginLeft: 5,
            // marginRight: 5,
          }}
          source={
            item.image
              ? {
                  uri: `data:image/png;base64,${item.image}`,
                }
              : require('../../Helper/Assets/Gmaart.png')
          }
          resizeMode={'contain'}
        />
        <Text
          style={{
            marginTop: 5,
            width: 90,
            // marginLeft: 10,
            color: 'black',
            fontWeight: '500',
            textAlign: 'center',
            alignSelf: 'center',
            marginBottom: 13,
          }}>
          {item.name}
        </Text>
        {/* </ImageBackground> */}
      </TouchableOpacity>
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
