import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { Avatar, Icon, Image, Skeleton, Rating, ListItem } from '@rneui/themed';
import tw from 'twrnc';
import Header from '../../components/Header/index';

import { PRIMARY_COLOR } from '../../styles/color.global';
import Button from '../../components/Button/index';
import { useSelector, useDispatch } from 'react-redux';
import { color } from '@rneui/themed/dist/config';
import { apiDeleteFavorites, apiGetFavoritesForMe } from '../../apis/data';
import { getFavorites } from '../../stores/dataSlice';
import { add } from '../../stores/cartSlice';
import Toast from 'react-native-toast-message'

const Favorite = ({ navigation }) => {
  const { favorites, loading } = useSelector(state => state.data);
  const { user, token, isLoggedIn } = useSelector(state => state.user);
  const { data } = useSelector(state => state.cart)
  const [cartData, setCartData] = React.useState([])
  const [completeLoading, setCompleteLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [isdeleting, setIsdeleting] = useState(false);

  const checkIndex = (id) => {

    if (cartData) {
      const index = cartData.findIndex((item) => item.product._id === id)

      if (index !== -1) {
        if ((cartData[index].quantity + 1) > product.quantity) {

          return false
        }
      }
      return true
    } else {
      return true
    }
  }

  React.useEffect(() => {

    setCartData(data[user?._id])
  }, [data])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    console.log('1dsa', token, user?._id);
    const response = await apiGetFavoritesForMe(token + user?._id);
    console.log('respons2e21', response.status, response.data.data);
    if (response.status === 200) {
      dispatch(getFavorites(response?.data?.data));
      setRefreshing(false);
    } else {
      setRefreshing(false);
      ToastAndroid.show('Mạng không ổn định', ToastAndroid.SHORT);
    }
  }, []);

  const dispatch = useDispatch();

  const icon = (name, size = 18, color = 'white', onPress) => {
    return (
      <Icon
        name={name}
        type="material"
        color={color}
        size={size}
        style={tw`mr-[5px]`}
        onPress={null}
      />
    );
  };

  const formatToVND = number => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(number);
  };

  useEffect(() => {
    // sau 10 giây sẽ tắt loading
    setTimeout(() => {
      setCompleteLoading(true);
    }, 15000);
  }, []);

  const handleToDetail = (id) => {
    navigation.navigate('ProductDetail', {
      productId: id,
    })
  }

  const handleAddToCart = (product) => {
    if (product?.quantity >= 1 && checkIndex(product._id)) {

      dispatch(add({
        data: {
          product,
          quantity: 1
        },
        userId: user?._id
      }))
      Toast.show({
        type: 'success',
        text1: 'Thêm vào giỏ hàng thành công!'
      })
    }
  }

  // screen khi da dang nhap
  const fameItem = (item, index) => {
    return (
      <TouchableOpacity onPress={() => handleToDetail(item.productid._id)}
        key={index}
        style={tw`px-2 py-1 bg-white border-b border-gray-100 flex flex-row`}>
        <Image
          source={
            item?.productid?.images == null
              ? require('../../assets/images/images/bookimage.png')
              : {
                uri: item?.productid?.images,
              }
          }
          style={tw`flex justify-center items-center flex-2 w-[95px] h-full`}
        />
        <View style={tw`flex-3 flex-col flex py-[10px] px-[7px]`}>
          <View style={tw`flex-row justify-between items-start`}>
            <Text
              numberOfLines={2}
              style={[
                tw`text-[#333] flex-8 font-bold text-base`,
                { height: 50, overflow: 'hidden' },
              ]}>
              {item?.productid?.title == null
                ? '[Sản phẩm không còn tồn tại]'
                : item?.productid?.title}
            </Text>
            <TouchableOpacity style={tw`flex-col items-center flex-1`}>
              <Icon
                name={'clear'}
                type="material"
                color="gray"
                size={22}
                style={tw`mr-[1px]`}
                onPress={async () => {
                  console.log('item123', item?.productid?._id);
                  setIsdeleting(true);
                  const res = await apiDeleteFavorites(
                    token,
                    user?._id,
                    item?.productid?._id,
                  );
                  if (res.status == 200) {
                    console.log(
                      'r1232es',
                      favorites[0]._id,
                      res?.data.data._id,
                    );
                    dispatch(
                      getFavorites(
                        favorites.filter(
                          item => item?._id !== res?.data.data._id,
                        ),
                      ),
                    );
                    setIsdeleting(false);
                  }
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-[#666] text-sm`}>
            {item.productid?.author == null
              ? '[không có thông tin]'
              : item.productid?.author}
          </Text>

          <Text style={tw`text-[#666] text-sm`}>
            {item.productid?.rate == null
              ? '[trống]'
              : item.productid?.rate + ' sao'}
          </Text>

          <View style={tw`flex-row justify-between items-center`}>
            <Text style={[tw`text-[#666] text-xl `, { color: PRIMARY_COLOR }]}>
              {item.productid?.price == null
                ? '[Trống]'
                : formatToVND(item.productid?.price)}
            </Text>
            <TouchableOpacity
              onPress={() => handleAddToCart(item.productid)}
              disabled={
                item.quantity == 0 || item.productid == null ? true : false
              }
              style={[
                tw`flex-row items-center rounded p-2`,
                {
                  backgroundColor:
                    item.quantity == 0 || item.productid == null
                      ? 'gray'
                      : PRIMARY_COLOR,
                },
              ]}>
              {icon((name = 'add-shopping-cart'), (size = 20))}
              <Text style={tw`text-white text-sm`}>Thêm vào giỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // loading
  const fameLoading = index => {
    return (
      <View
        key={index}
        style={tw`px-2 py-1 bg-white border-b border-gray-100 flex flex-row`}>
        <Skeleton
          // LinearGradientComponent={LinearGradient}
          animation="wave"
          width={95}
          height={150}
        // skeletonStyle={tw`w-[95px] h-full`}
        />
        <View style={tw`flex-3 flex-col flex py-[10px] px-[7px]`}>
          <View style={tw`flex-row justify-between items-start`}>
            <Skeleton
              animation="pulse"
              width={250}
              height={40}
            // skeletonStyle={tw``}
            />
            <TouchableOpacity style={tw`flex-col items-center flex-1`}>
              <Icon
                name={'clear'}
                type="material"
                color="gray"
                size={22}
                style={tw`mr-[1px]`}
              // onPress={async () => {
              //   console.log('item123', item?.productid?._id);
              //   const res = await apiDeleteFavorites(
              //     token,
              //     user?._id,
              //     item?.productid?._id,
              //   );
              //   if (res.status == 200) {
              //     console.log(
              //       'r1232es',
              //       favorites[0]._id,
              //       res?.data.data._id,
              //     );
              //     dispatch(
              //       getFavorites(
              //         favorites.filter(
              //           item => item?._id !== res?.data.data._id,
              //         ),
              //       ),
              //     );
              //   }
              // }}
              />
            </TouchableOpacity>
          </View>
          <Skeleton
            animation="pulse"
            width={80}
            height={20}
            style={tw`mt-1.2`}
          />

          <Skeleton
            animation="pulse"
            width={80}
            height={20}
            style={tw`mt-1.2`}
          />

          <View style={tw`flex-row justify-between items-center`}>
            <Skeleton animation="pulse" width={120} height={30} style={tw``} />
            <Skeleton
              animation="wave"
              width={125}
              height={40}
              style={tw`flex-row items-center rounded p-2`}
            />
          </View>
        </View>
      </View>
    );
  };

  // console.log('favorites111', favorites);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Header title="Sản phẩm yêu thích" navigation={navigation} />
      </View>

      <ScrollView
        // style={tw`${!isdeleting ? `opacity-50` : `opacity-100`}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[PRIMARY_COLOR]}
          />
        }>
        <View style={tw`bg-white`}>
          {!loading ? (
            favorites.length != 0 ? (
              favorites.map((item, index) => fameItem(item, index))
            ) : (
              <View style={tw`flex justify-center items-center h-200`}>
                <Text style={tw`text-[#666] text-base`}>
                  Không có sản phẩm yêu thích nào!
                </Text>
              </View>
            )
          ) : !completeLoading ? (
            Array.from({ length: 5 }).map((_, index) => fameLoading(index))
          ) : (
            <View style={tw`flex justify-center items-center h-200`}>
              <Text style={tw`text-[#666] text-base`}>
                Mạng không ổn định, vui lòng thử lại!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {isdeleting ? ( // Hiển thị ActivityIndicator khi đang tải
        <ActivityIndicator
          size="large"
          color={PRIMARY_COLOR}
          style={tw`absolute bg-white mt-[80px] top-0 bottom-0 left-0 right-0 opacity-50`}
        />
      ) : null}
    </View>
  );
};

export default Favorite;
