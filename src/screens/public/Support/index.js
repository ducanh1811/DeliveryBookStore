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
import {useState, useEffect} from 'react';
import {Avatar, Icon, Image, Skeleton, Rating, Dialog} from '@rneui/themed';
import tw from 'twrnc';
import Header from '../../../components/Header/index';

import {PRIMARY_COLOR} from '../../../styles/color.global';
import Button from '../../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';
import {color} from '@rneui/themed/dist/config';
import {
  apiDeleteFavorites,
  apiGetVouchersForMe,
} from '../../../apis/data';
import {getFavorites, getVouchers} from '../../../stores/dataSlice';

const Support = ({navigation}) => {
  const {loading, vouchers} = useSelector(state => state.data);
  const {
    addressDelivery,
  } = useSelector(state => state.other);
  const [completeLoading, setCompleteLoading] = useState(false);
  // Check hướng điện thoại
  const {orientation} = useSelector(state => state.other);

  const menu = [
    {
      title: 'Giới thiệu TA Book Store',
      onPress: () => {
        console.log('Giới thiệu TA Book Store', addressDelivery);
      },
    },
    {
      title: 'Điều khoản sử dụng',
      onPress: () => {
        navigation.navigate('TermsOfUse');
      },
    },
    {
      title: 'Chính sách bảo mật',
      onPress: () => {
        navigation.navigate('PrivacyPolicy');
      },
    },
    {
      title: 'Phương thức thanh toán',
      onPress: () => {
        navigation.navigate('PaymentMethod');
      },
    },
    {
      title: 'Phương thức vận chuyển',
      onPress: () => {
        navigation.navigate('DeliveryMethod');
      },
    },
    {
      title: 'Liên hệ',
      onPress: () => {
        navigation.navigate('Contact');
      },
    },
  ];

  // console.log('favorites111', favorites);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Header title="Hỗ trợ" navigation={navigation} />
      </View>
      <ScrollView>
        <View style={tw`bg-white`}>
          {menu.map((item, index) => {
            return (
              <TouchableOpacity
                //disabled={item.choose}
                key={index}
                style={tw`flex-row justify-between items-center py-3 px-4 border-b border-gray-100`}
                onPress={item.onPress}>
                <Text style={tw`text-base text-[#333]`}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Support;
