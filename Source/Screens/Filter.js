import React, {Component} from 'react';

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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Mcon from 'react-native-vector-icons/MaterialIcons';
import {color} from '../Helper/Global';
import {MultiSelect, Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {POST} from '../Helper/ApiManger/Apis';

const data = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  {label: 'Item 3', value: '3'},
  {label: 'Item 4', value: '4'},
  {label: 'Item 5', value: '5'},
  {label: 'Item 6', value: '6'},
  {label: 'Item 7', value: '7'},
  {label: 'Item 8', value: '8'},
];

export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
      brandList: [],
      categoryList: [],
      brandSelected: '',
      categorySelected: '',

      loading: true,
      brandSelectedId: '',
      categorySelectedId: '',
      selectedArrBrand: [],
      allList: [],
      selectedArrCategory: [],
      productData: [],
      screenName: '',
    };
    console.log('filter props', this.props);
  }

  componentDidMount() {
    const {navigation} = this.props;

    // this.focusListener = navigation.addListener('focus', async () => {
    this.setState({loading: true});
    if (this.props.route.params != undefined) {
      this.setState({loading: false});

      if (this.props.route.params.screenName == 'BrandGrid') {
        this.setState({
          screenName: this.props.route.params.screenName,
          loading: false,
        });
        this.getCategoryBrand(this.props.route.params.id);
      }
      if (this.props.route.params.screenName == 'CategoryGrid') {
        this.setState({
          screenName: this.props.route.params.screenName,
          loading: false,
        });
        this.getBrandCategory(this.props.route.params.id);
      }
      if (
        this.props.route.params.screenName == 'Home' ||
        this.props.route.params.screenName == 'Filter'
      ) {
        this.brandList();
        this.categoryList();
        var that = this;

        setTimeout(function () {
          that.setState({loading: true});
        }, 1000);
      }
      if (this.props.route.params.screenName == '') {
        this.brandList();
        this.categoryList();
        var that = this;

        setTimeout(function () {
          that.setState({loading: true});
        }, 1000);
      }

      //   if (
      //     this.props.route.params.brandSelected.value == undefined
      //     // ||
      //     // this.props.route.params.categorySelected.value == undefined
      //   ) {
      //     this.setState({
      //       brandSelectedId: '',
      //       categorySelectedId: '',
      //     });
      //   } else {
      //     this.setState({
      //       brandSelectedId:
      //         this.props.route.params &&
      //         this.props.route.params.brandSelected.value,
      //     });
      //   }
    } else {
      this.brandList();
      this.categoryList();
      var that = this;

      setTimeout(function () {
        that.setState({loading: true});
      }, 1000);
    }
    // });

    // this.getBrand();
  }

  selectBrand(id) {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        brand_id: id,
      },
    });
    console.log('raw  ', raw);

    POST('filter/brand', raw)
      .then(response => {
        this.setState({
          loading: false,
          selectedArrBrand: response.result.response,
        });

        console.log('selectbrand Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  selectCategory(id) {
    this.setState({loading: true});
    console.log('category  ', this.state.categorySelectedId);

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
        this.setState({
          loading: false,
          selectedArrCategory: response.result.response,
        });

        console.log('category Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  brandList() {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    POST('brands', raw)
      .then(response => {
        const newBrandList = response.result.response.map(value => ({
          label: value.brand_name,
          value: value.id,
        }));

        this.setState({brandList: newBrandList});
        this.setState({loading: false});
        console.log('brand Response ', this.state.brandList);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }

  categoryList() {
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {},
    });
    POST('categories', raw)
      .then(response => {
        const newCategoryList = response.result.response.map(value => ({
          label: value.name,
          value: value.id,
        }));

        this.setState({categoryList: newCategoryList, loading: false});
        console.log('category Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  }
  getBrandCategory = id => {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        category_id: id,
      },
    });
    console.log('category/related/brand', raw);
    POST('category/related/brand', raw)
      .then(async response => {
        this.setState({loading: false});
        const newBrandList = response.result.response.map(value => ({
          label: value.brand_name,
          value: value.id,
        }));

        this.setState({brandList: newBrandList});
        console.log(
          'category/related/brand Response ',
          response,
          this.state.categorySelectedId,
        );
        // this.getProducts(id,this.state.brandSelected.value)
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  };
  getCategoryBrand = id => {
    this.setState({loading: true});

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        brand_id: id,
      },
    });
    console.log('brand/related/category', raw);
    POST('brand/related/category', raw)
      .then(async response => {
        this.setState({loading: false});
        const newCategoryList = response.result.response.map(value => ({
          label: value.name,
          value: value.id,
        }));

        this.setState({categoryList: newCategoryList});
        console.log('brand/related/category Response ', response);
      })
      .catch(err => {
        this.setState({loading: false});

        console.log('Erroorr', err);
      });
  };
  getProducts = () => {
    var raw = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        category_id: this.state.categorySelectedId,
        brand_id: this.state.brandSelectedId,
      },
    });
    console.log('getProducts', raw);

    POST('filter/brand/category', raw)
      .then(async response => {
        console.log('getProducts Response ', response);
        // this.setState({productData: this.state.productData});
        this.props.route.params.onSelect({
          selectedArrBrand: response.result.response,

          selected: true,
          brandSelected: this.state.brandSelected,
          categorySelected: this.state.categorySelected,
          screenName: this.state.screenName,
        });
        this.props.navigation.goBack();
      })
      .catch(err => {
        console.log('Erroorr', err);
      });
  };
  done() {
    this.props.route.params.onSelect({
      selectedArrBrand: this.state.productData,

      selected: true,
      brandSelected: this.state.brandSelected,
      categorySelected: this.state.categorySelected,
    });
    this.props.navigation.goBack();
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {this.state.loading && (
          <View style={styles.activityLoader}>
            <ActivityIndicator
              size="large"
              color="#000"
              style={{alignSelf: 'center'}}
            />
          </View>
        )}
        <StatusBar backgroundColor={color.Primary} />

        <View style={styles.headerContainer}>
          <Icon
            style={styles.closeBtn}
            name="close"
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
            Filter
          </Text>
        </View>
        {/* 
        <View style={styles.filterTypeContainer}>
          <Text style={styles.filterTypeText}>Brand</Text>
          <Mcon
            style={{alignSelf: 'center'}}
            name="arrow-drop-down"
            size={30}
            color="black"
          />
        </View> */}
        {this.state.screenName == 'CategoryGrid' ? null : (
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={this.state.categoryList}
            labelField="label"
            valueField="value"
            placeholder="Categories"
            searchPlaceholder="Search..."
            value={this.state.categorySelectedId}
            onChange={item => {
              this.selectCategory(item.value);
              this.state.screenName == 'BrandGrid'
                ? null
                : this.getBrandCategory(item.value);
              this.setState({
                categorySelected: item,
                categorySelectedId: item.value,
              });
              console.log('item', item, this.state.categorySelectedId);
            }}
            renderRightIcon={() => (
              <Mcon
                style={{alignSelf: 'center'}}
                name="arrow-drop-down"
                size={30}
                color="black"
              />
            )}
            selectedStyle={styles.selectedStyle}
          />
        )}
        {this.state.screenName == 'BrandGrid' ? null : (
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            search
            data={this.state.brandList}
            labelField="label"
            valueField="value"
            placeholder="Brand"
            searchPlaceholder="Search..."
            value={this.state.brandSelectedId}
            onChange={item => {
              console.log('item', item);
              this.selectBrand(item.value);
              this.state.screenName == 'CategoryGrid'
                ? null
                : this.getCategoryBrand(item.value);

              this.setState({brandSelected: item, brandSelectedId: item.value});
            }}
            renderRightIcon={() => (
              <Mcon
                style={{alignSelf: 'center'}}
                name="arrow-drop-down"
                size={30}
                color="black"
              />
            )}
            selectedStyle={styles.selectedStyle}
          />
        )}
        {/* <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Price"
          searchPlaceholder="Search..."
          value={this.state.selected}
          onChange={item => {
            this.setState({selected: item});
          }}
          renderRightIcon={() => (
            <Mcon
              style={{alignSelf: 'center'}}
              name="arrow-drop-down"
              size={30}
              color="black"
            />
          )}
          selectedStyle={styles.selectedStyle}
        /> */}
        {/* <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Product Rating"
          searchPlaceholder="Search..."
          value={this.state.selected}
          onChange={item => {
            this.setState({selected: item});
          }}
          renderRightIcon={() => (
            <Mcon
              style={{alignSelf: 'center'}}
              name="arrow-drop-down"
              size={30}
              color="black"
            />
          )}
          selectedStyle={styles.selectedStyle}
        />


        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Discount"
          searchPlaceholder="Search..."
          value={this.state.selected}
          onChange={item => {
            this.setState({selected: item});
          }}
          renderRightIcon={() => (
            <Mcon
              style={{alignSelf: 'center'}}
              name="arrow-drop-down"
              size={30}
              color="black"
            />
          )}
          selectedStyle={styles.selectedStyle}
        />

        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Food Type"
          searchPlaceholder="Search..."
          value={this.state.selected}
          onChange={item => {
            this.setState({selected: item});
          }}
          renderRightIcon={() => (
            <Mcon
              style={{alignSelf: 'center'}}
              name="arrow-drop-down"
              size={30}
              color="black"
            />
          )}
          selectedStyle={styles.selectedStyle}
        />

        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Pack Size"
          searchPlaceholder="Search..."
          value={this.state.selected}
          onChange={item => {
            this.setState({selected: item});
          }}
          renderRightIcon={() => (
            <Mcon
              style={{alignSelf: 'center'}}
              name="arrow-drop-down"
              size={30}
              color="black"
            />
          )}
          selectedStyle={styles.selectedStyle}
        />

     */}
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            width: '70%',
            paddingBottom: 10,
            paddingTop: 10,
            flexDirection: 'row',
            alignSelf: 'center',
            borderRadius: 5,
            justifyContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: color.Primary,
            }}
            onPress={() => {
              this.setState(
                {
                  brandSelectedId: '',
                  brandSelected: '',
                  categorySelectedId: '',
                  categorySelected: '',
                },
                () => {
                  if (this.state.screenName == 'BrandGrid') {
                    this.getCategoryBrand(this.props.route.params.id);
                  } else if (this.state.screenName == 'CategoryGrid') {
                    this.getBrandCategory(this.props.route.params.id);
                  } else {
                    this.brandList();
                    this.categoryList();
                  }
                },
              );
              // this.props.route.params.onSelect({
              //   selectedArrBrand: [],
              //   selectedArrCategory: [],
              //   selected: false,
              // });
              // this.props.navigation.goBack();
            }}>
            <Text style={{color: color.Primary, padding: 10}}>CLEAR ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // this.done();
              this.getProducts();
            }}
            style={{
              backgroundColor: color.Primary,
              width: 100,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white', padding: 10, textAlign: 'center'}}>
              DONE
            </Text>
          </TouchableOpacity>
        </View>
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
  container: {padding: 16},
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',

    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    padding: 15,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
    borderWidth: 1,
    margin: 5,
    color: 'black',
  },

  priceText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 0,
  },
  ratingText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  filterTypeText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 0,
  },
  filterTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  headerContainer: {
    height: Platform.OS == 'ios' ? 85 : 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.Primary,
    marginTop: Platform.OS == 'ios' ? -55 : 0,
  },
  closeBtn: {
    position: 'absolute',
    left: 10,
    top: Platform.OS == 'ios' ? 45 : 10,

    overflow: 'hidden',
  },
});
