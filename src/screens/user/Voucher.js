import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
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
import {
  apiDeleteFavorites,
  apiGetVouchersForMe,
} from '../../apis/data';
import { getFavorites, getVouchers } from '../../stores/dataSlice';

const Voucher = ({ navigation }) => {
  const { loading, vouchers } = useSelector(state => state.data);
  const { user, token, isLoggedIn } = useSelector(state => state.user);
  const [completeLoading, setCompleteLoading] = useState(false);
  // Check hướng điện thoại
  // Check hướng điện thoại
  const { orientation } = useSelector(state => state.other);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //console.log('1dsa', token, user?._id);
    const response = await apiGetVouchersForMe(token + user?._id);
    //console.log('respons2e21', response.status, response.data.data);
    if (response.status === 200) {
      dispatch(getVouchers(response?.data?.data));
      setRefreshing(false);
    } else {
      setRefreshing(false);
      ToastAndroid.show('Mạng không ổn định', ToastAndroid.SHORT);
    }
  }, []);

  console.log("voucehr", vouchers)

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

  useEffect(() => {
    // sau 10 giây sẽ tắt loading
    setTimeout(() => {
      setCompleteLoading(true);
    }, 15000);
  }, []);

  // useEffect(() => {
  //   const onChange = ({window}) => {
  //     const {width, height} = window;
  //     setOrientation(width > height ? 'landscape' : 'portrait');
  //   };

  //   Dimensions.addEventListener('change', onChange);

  //   // return () => {
  //   //   Dimensions.removeEventListener('change', onChange);
  //   // };
  // }, []);

  // screen khi da dang nhap
  const fameItem = (item, index) => {
    return (
      <View
        key={index}
        style={tw`pl-2 pr-${orientation == 'portrait' ? `3` : `2`
          } py-1 bg-white border-b border-gray-100 flex flex-row`}>
        <Image
          source={require('../../assets/images/images/coupon.png')}
          style={tw`flex justify-center items-center flex-2 w-40 h-full`}
        />

        <View
          style={[
            tw`flex-3 flex-col flex py-[10px] px-[7px] bg-[#E8CDA7]`,
            // (backgroundColor = '#D0B28C'),
          ]}>
          <View style={tw`flex-row  justify-between items-start`}>
            <Text
              numberOfLines={2}
              style={[
                tw`text-[#333] flex-8 font-bold text-base text-[#736357]`,
                { height: 50, overflow: 'hidden' },
              ]}>
              Mã giảm giá: {item?.code}
            </Text>
          </View>
          <Text style={tw`text-[#666] text-sm`}>
            Trạng thái: {item?.status ? 'Chưa sử dụng' : 'Đã sử dụng'}
          </Text>

          <Text style={tw`text-[#666] text-sm`}>HSD: {item?.expried}</Text>

          <View style={tw`flex-col justify-between items-start`}>
            <Text style={[tw`text-[#BF1622] text-xl `]}>
              Giá trị: {item?.discount + '%'}
            </Text>
            <TouchableOpacity
              disabled={!item.status ? true : false}
              style={[
                tw`flex-row items-center rounded p-2`,
                {
                  backgroundColor: !item.status ? 'gray' : PRIMARY_COLOR,
                },
              ]}>
              {icon((name = 'difference'), (size = 20))}
              <Text style={tw`text-white text-sm`}>Sử dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // loading
  const fameLoading = index => {
    return (
      <View
        key={index}
        style={tw`pl-2 pr-${orientation == 'portrait' ? `3` : `2`
          } py-1 bg-white border-b border-gray-100  flex flex-row`}>
        <Image
          source={require('../../assets/images/images/coupon.png')}
          style={tw`flex justify-center items-center flex-2 w-40 h-full`}
        />
        <View style={tw`flex-3 flex-col flex py-[10px] bg-[#E8CDA7] px-[7px]`}>
          <Skeleton
            animation="pulse"
            width={200}
            height={40}
            style={tw`bg-[#CFAA83]`}
            //skeletonStyle={tw`bg-[#BF9D79]`}
            skeletonStyle={tw`bg-[#E6BD91]`}
          />

          <Skeleton
            animation="pulse"
            width={80}
            height={20}
            style={tw`mt-1.2 bg-[#CFAA83] `}
            skeletonStyle={tw`bg-[#E6BD91]`}
          />

          <Skeleton
            animation="pulse"
            width={80}
            height={20}
            style={tw`mt-1.2 bg-[#CFAA83]`}
            skeletonStyle={tw`bg-[#E6BD91]`}
          />

          <View style={tw`flex-row justify-between items-center`}>
            <Skeleton
              animation="pulse"
              width={105}
              height={30}
              style={tw`bg-[#CFAA83]`}
              skeletonStyle={tw`bg-[#E6BD91]`}
            />
            <Skeleton
              animation="pulse"
              width={90}
              height={35}
              style={tw`flex-row items-center bg-[#CFAA83] rounded`}
              skeletonStyle={tw`bg-[#E6BD91]`}
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
        <Header title="Voucher của tôi" navigation={navigation} />
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
            vouchers.length != 0 ? (
              vouchers.map((item, index) => fameItem(item, index))
            ) : (
              <View style={tw`flex justify-center items-center h-200`}>
                <Text style={tw`text-[#666] text-base`}>
                  Không có mã giảm giá nào!
                </Text>
              </View>
            )
          ) : !completeLoading ? (
            Array.from({ length: 6 }).map((_, index) => fameLoading(index))
          ) : (
            <View style={tw`flex justify-center items-center h-200`}>
              <Text style={tw`text-[#666] text-base`}>
                Mạng không ổn định, vui lòng thử lại!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Voucher;
