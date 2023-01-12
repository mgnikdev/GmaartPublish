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
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/Ionicons';

import React, {Component} from 'react';
import Header from '../../Components/Header.js';
import {color} from '../../Helper/Global';
import {POST} from '../../Helper/ApiManger/Apis';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import AllProductListContainer from './AllProductListContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';

export default class AllProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allproductData: [],
      isLoading: false,
      productQty: 1,
      position: 1,

      productData: [],
      loading: false,
      editMode: false,
      order_id: 0,
      cartData: [],
      selected: false,
      brandSelected: {},
      tempData: [],
      offset: 0,
      pageCount: 0,
      createApicl: false,
      searchData: '',
      searchTimer: null,
    };
    console.log('categoryList props', this.props);
  }

  updateState = async () => {
    var orderId = await AsyncStorage.getItem('orderId');
    console.log('All ttttorderId', orderId);

    this.setState(
      {
        editMode: true,
        createApicl: false,
      },
      () => {
        console.log('tttt', this.state.editMode, orderId);
      },
    );
  };

  onSelect(val, val2) {
    console.log('onSSslll', val.selectedArrBrand, val.selected);
    this.setState({
      selected: val.selected,
      productData: val.selectedArrBrand,
      brandSelected: val.brandSelected,
      screenName: val.selectedArrBrand.length == 0 ? '' : 'Filter',

      categorySelected: val.categorySelected,
    });
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.countPage();

    this.focusListener = navigation.addListener('focus', async () => {
      var orderId = await AsyncStorage.getItem('orderId');
      this.displayOrder();

      if (this.props.route.params != undefined) {
        this.setState({
          productData: this.props.route.params.item,
          editMode: orderId == null || orderId == undefined ? false : true,
        });
      } else {
        this.setState({
          editMode: orderId == null || orderId == undefined ? false : true,
          searchData: '',
          searchTimer: null,
        });
        console.log('else category');
        this.state.selected == false || this.state.productData.length == 0
          ? this.productList(this.state.offset)
          : '';
        this.displayOrder();
      }
    });
  }

  async displayOrder() {
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
        if (response.result.response[0].order_id == false) {
          this.setState({createApicl: true});
        }
        this.setState({cartData: datas});

        console.log('displayorder Response ', response);
      })
      .catch(err => {
        this.setState({});

        console.log('Erroorr', err);
      });
  }

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
      No Products Available
    </Text>
  );

  countPage() {
    this.setState({loading: true});
    var raw = JSON.stringify({
      jsonrpc: 2.0,
      params: {},
    });

    POST('count/page', raw)
      .then(response => {
        console.log('count/page Response ', response.result.response[0]);
        this.setState({
          pageCount: response.result.response[0].page * 10,
          loading: false,
        });
        console.log('pageCount', this.state.pageCount);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  productList(offset, horizontalList) {
    if (horizontalList) {
      this.setState({loadingHorizontal: true});
    } else {
      this.setState({loading: true});
    }
    var raw = JSON.stringify({
      jsonrpc: 2.0,
      params: {
        offset: offset,
      },
    });

    POST('products/offset', raw)
      // POST('products', raw)
      .then(response => {
        console.log('products Response ', response.result.response);

        this.setState({
          productData: [...this.state.productData, ...response.result.response],
          loading: false,
        });
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  renderItem = ({item}) => (
    <AllProductListContainer
      item={item}
      navigation={this.props.navigation}
      updateState={data => this.updateState(data)}
      updateOrder_id={data => {
        this.setState({order_id: data});
        console.log('order_id', data);
      }}
      display={() => {
        this.displayOrder();
      }}
      order_id={this.state.order_id}
      editMode={this.state.editMode}
      cartData={this.state.cartData}
      isLoading={data => {
        this.setState({isLoading: data});
        console.log('isLoading', data);
      }}
      createApicl={this.state.createApicl}
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

  renderFooter = () => (
    //Footer View with Load More button
    <View style={styles.footer}>
      {this.state.loading && this.state.offset > 0 ? (
        <ActivityIndicator
          color={color.Primary}
          size="large"
          style={{marginLeft: 8, alignSelf: 'center'}}
        />
      ) : null}
    </View>
  );
  searchText = e => {
    if (e == '') {
      this.setState({tempData: [], loading: false});
    }
    if (e != '') {
      // this.setState({
      //   tempData: this.state.productData,
      // });

      this.setState({loading: true});
      var raw = JSON.stringify({
        jsonrpc: '2.0',
        params: {
          name: e,
        },
      });
      console.log('search raw ', raw);

      POST('search/products', raw)
        .then(response => {
          this.setState({
            loading: false,
            tempData: response.result.response,
          });

          console.log('search Response ', response);
        })
        .catch(err => {
          this.setState({loading: false});

          console.log('Erroorr', err);
        });
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />
        {this.state.loading &&
        this.state.offset == 0 &&
        this.state.productData.length != 0 ? (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color={color.Primary}
              style={{alignSelf: 'center'}}
            />
          </View>
        ) : (
          <></>
        )}
        <Header
          navigation={this.props.navigation}
          screenName={'AllProductList'}

          // data={data => {
          //   console.log('search data from category', data);
          //   this.searchText(data);
          // }}
        />
        <View style={{backgroundColor: color.Primary}}>
          <View style={styles.searchBar}>
            <Mcon
              name="ios-search"
              size={25}
              color="#000"
              style={{alignSelf: 'center', marginLeft: 10}}
            />
            <TextInput
              style={styles.input}
              onChangeText={text => {
                if (this.state.searchTimer) {
                  clearTimeout(this.state.searchTimer);
                }
                this.setState({
                  loading: true,
                  searchData: text,
                  searchTimer: setTimeout(() => {
                    this.searchText(text);
                  }, 1000),
                });
              }}
              value={this.state.searchData}
              placeholder="Search"
              placeholderTextColor="gray"
            />
          </View>
        </View>

        {this.state.isLoading && (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color={color.Primary}
              style={{alignSelf: 'center'}}
            />
          </View>
        )}
        <View
          style={{
            backgroundColor: '#c8c8c8',
            height: 40,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push('Filter', {
                onSelect: this.onSelect.bind(this),
                brandSelected: this.state.brandSelected,
                screenName: '',
              });
            }}
            style={styles.filterContainer}>
            <Mcon
              name="options"
              size={20}
              color={'black'}
              style={{margin: 5, marginLeft: 10}}
            />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, height: windowHeight / 2}}>
          <FlatList
            style={{marginTop: 8}}
            ListEmptyComponent={this.renderEmpty}
            data={
              this.state.searchData == ''
                ? this.state.productData
                : this.state.tempData
            }
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            onEndReached={() => {
              if (this.state.searchData == '') {
                if (this.state.screenName != 'Filter') {
                  this.state.offset <= this.state.pageCount &&
                    this.setState({offset: this.state.offset + 10}, () => {
                      console.log('offsttt', this.state.offset);
                      this.productList(this.state.offset);
                    });
                }
              }
            }}
            onEndReachedThreshold={0.9}
            ListFooterComponent={this.renderFooter}
            maxToRenderPerBatch={10}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginTop: Platform.OS == 'ios' ? 25 : 10,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '90%',
    padding: 10,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    alignItems: 'center',
    color: 'black',
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
    height: 100,
    width: 80,
    alignSelf: 'center',
    // marginLeft: 15,
    overflow: 'hidden',
  },

  rupeesContainer: {
    margin: 10,
    // marginLeft: 25,
    alignItems: 'center',
    justifyContent: 'center',
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
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerHori: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
