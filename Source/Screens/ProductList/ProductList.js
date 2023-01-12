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
import ProductListContainer from './ProductListContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import ProductHorizontal from './ProductHorizontal';
export default class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productQty: 1,
      position: 1,
      interval: null,
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
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          url: 'https://st2.depositphotos.com/3382541/8314/v/950/depositphotos_83141768-stock-illustration-fruit-shop-salesman-sale-process.jpg',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          url: 'https://image.freepik.com/free-vector/summer-sale-template-with-different-fruits_23-2147797447.jpg',
        },
      ],
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
      horizontalList: false,
      horizontalData: [],
      ProductList: false,
      loadingHorizontal: false,
      editModeHori: false,
      isLoading: this.props.route.params != undefined ? true : false,
      screenName: '',
      flag: '',
    };
    console.log('ProductList props', this.props);
  }
  updateState = async () => {
    var orderId = await AsyncStorage.getItem('orderId');
    console.log('ttttorderId', orderId);

    this.setState(
      {
        // editMode: orderId == null || orderId == undefined ? false : true,
        editMode: true,
      },
      () => {
        console.log('editMode', this.state.editMode);
      },
    );
  };
  updateStateHori = async () => {
    var orderId = await AsyncStorage.getItem('orderId');
    console.log('ttttorderId', orderId);

    this.setState(
      {
        editModeHori: true,
      },
      () => {
        console.log('editModeHori', this.state.editMode);
      },
    );
  };
  onSelect(val, val2) {
    console.log('onSSslll ProductList', val.selectedArrBrand, val.selected);
    this.setState({
      selected: val.selected,
      productData: val.selectedArrBrand,
      brandSelected: val.brandSelected,
      screenName: val.screenName,
      flag: val.selectedArrBrand.length == 0 ? val.screenName : 'Filter',
      categorySelected: val.categorySelected,
    });
  }
  componentDidMount() {
    this.initialFunction();
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      this.displayOrder();
    });
  }

  async initialFunction() {
    this.countPage();

    var orderId = await AsyncStorage.getItem('orderId');
    if (this.props.route.params != undefined) {
      this.setState({
        productData: this.props.route.params.item,
        editMode: orderId == null || orderId == undefined ? false : true,
        isLoading: false,
      });

      if (this.props.route.params.screenName) {
        if (this.props.route.params.screenName == 'Home') {
          this.setState({horizontalList: true});
          this.productList(this.state.offset, true);
        } else {
          this.setState({
            screenName: this.props.route.params.screenName,
            id: this.props.route.params.id,
          });
        }
      }
    } else {
      console.log('else category');
      this.setState({
        editMode: orderId == null || orderId == undefined ? false : true,
      });
      this.state.selected == false || this.state.productData.length == 0
        ? this.productList(this.state.offset)
        : '';
      this.displayOrder();
      this.setState({ProductList: true});
    }
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
        if (horizontalList) {
          this.setState({
            horizontalData: [
              ...this.state.horizontalData,
              ...response.result.response,
            ],
            loadingHorizontal: false,
          });
        } else {
          this.setState({
            productData: [
              ...this.state.productData,
              ...response.result.response,
            ],
            loading: false,
          });
        }
        // var that = this;
        // setTimeout(function () {
        //   that.setState({loading: false});
        // }, 2000);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  renderItem = ({item}) => (
    <ProductListContainer
      item={item}
      navigation={this.props.navigation}
      updateState={data => this.updateState(data)}
      updateOrder_id={data => {
        this.setState({order_id: data});
        console.log('order_id', data);
      }}
      order_id={this.state.order_id}
      editMode={this.state.editMode}
      cartData={this.state.cartData}
      editModeHori={this.state.editModeHori}
      isLoading={data => {
        this.setState({isLoading: data});
        console.log('isLoading', data);
      }}
      display={() => {
        this.displayOrder();
      }}
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
      {/* </TouchableOpacity> */}
    </View>
  );
  renderFooterHori = () => (
    <View style={styles.footerHori}>
      {this.state.loadingHorizontal && this.state.offset > 0 ? (
        <ActivityIndicator
          color={color.Primary}
          size="large"
          style={{marginLeft: 8, alignSelf: 'center'}}
        />
      ) : null}
      {/* </TouchableOpacity> */}
    </View>
  );
  renderFooterHorizontal = () => (
    <View
      style={{
        height: windowHeight / 2,
      }}>
      <FlatList
        style={{marginTop: 5}}
        horizontal
        data={this.state.horizontalData}
        renderItem={this.renderItemHorizontal}
        onEndReached={() =>
          this.state.offset <= this.state.pageCount &&
          this.setState({offset: this.state.offset + 10}, () => {
            console.log('offsttt', this.state.offset);
            this.productList(this.state.offset, true);
          })
        }
        onEndReachedThreshold={0.9}
        ListFooterComponent={this.renderFooterHori}
        keyExtractor={item => item.id}
      />
    </View>
  );
  onRefresh = () => {
    <View style={styles.activityLoader}>
      <ActivityIndicator
        size="large"
        color={color.Primary}
        style={{alignSelf: 'center'}}
      />
    </View>;
  };

  searchText = e => {
    let text = e.toLowerCase();
    let trucks = this.state.productData;
    let filteredName = trucks.filter(item => {
      return item.product_name.toLowerCase().match(text);
    });
    if (!text || text === '') {
      this.setState({
        tempData: this.state.productData,
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
  renderItemHorizontal = ({item}) => (
    <ProductHorizontal
      item={item}
      navigation={this.props.navigation}
      updateState={data => this.updateStateHori(data)}
      updateOrder_id={data => {
        this.setState({order_id: data});
        console.log('order_id', data);
      }}
      order_id={this.state.order_id}
      editModeHori={this.state.editModeHori}
      cartData={this.state.cartData}
      editMode={this.state.editMode}
      isLoading={data => {
        this.setState({isLoading: data});
        console.log('isLoading', data);
      }}
      display={() => {
        this.displayOrder();
      }}
    />
  );
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: color.secondary}}>
        <StatusBar backgroundColor={color.Primary} />
        {this.state.loading &&
        this.state.offset == 0 &&
        this.state.horizontalList == false &&
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
          // data={data => {
          //   console.log('search data from category', data);
          //   this.searchText(data);
          // }}
          screenName={'ProductList'}
        />
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
                screenName: this.state.screenName,
                id: this.state.id,
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
            ListEmptyComponent={this.state.isLoading ? null : this.renderEmpty}
            data={
              this.state.tempData.length != 0
                ? this.state.tempData
                : this.state.productData
            }
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            onEndReached={() => {
              if (this.state.flag != 'Filter') {
                this.state.offset <= this.state.pageCount &&
                this.state.ProductList
                  ? this.setState({offset: this.state.offset + 10}, () => {
                      console.log('offsttt', this.state.offset);
                      this.productList(this.state.offset);
                    })
                  : null;
              }
            }}
            onEndReachedThreshold={0.9}
            ListFooterComponent={
              this.state.horizontalList
                ? this.renderFooterHorizontal
                : this.renderFooter
            }
            maxToRenderPerBatch={10}
          />
        </View>
        {/* 
          {this.state.horizontalList && (
            <View
              style={{
                flex: 1,
                height: windowHeight / 2.5,
              }}>
              <FlatList
                style={{marginTop: 5}}
                horizontal
                data={this.state.horizontalData}
                renderItem={this.renderItemHorizontal}
                onEndReached={() =>
                  this.state.offset <= this.state.pageCount &&
                  this.setState({offset: this.state.offset + 10}, () => {
                    console.log('offsttt', this.state.offset);
                    this.productList(this.state.offset, true);
                  })
                }
                onEndReachedThreshold={0.9}
                ListFooterComponent={this.renderFooterHori}
                keyExtractor={item => item.id}
              />
            </View>
          )} */}
        {/* )} */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
