import {
  View,
  Text,
  // TouchableOpacity,
  // RefreshControl,
  // ToastAndroid,
  // // Clipboard,
  // // Clipboard,
  // ActivityIndicator,
  // ScrollView,
  // FlatList,
} from 'react-native';
import React from 'react';
// import {useState, useRef, useEffect} from 'react';
// import {Avatar, Icon, Image, Skeleton, Rating, ListItem} from '@rneui/themed';
import tw from 'twrnc';
import Header from '../../components/Header/index';
// import Clipboard from '@react-native-clipboard/clipboard';
// import {PRIMARY_COLOR} from '../../styles/color.global';
// import Button from '../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';
// import {color} from '@rneui/themed/dist/config';

// import {getAuthInstance} from '../../utils/storage';
// import {apiDeleteFavorites, apiGetAllOrderForMe} from '../../apis/data';
// import {getAllMyOrder, getFavorites} from '../../stores/dataSlice';
import CustomTab from '../../components/CustomTab';
// import {set} from 'react-hook-form';
import CustomFlatList from '../../components/CustomFlatList';

const MyOrder = ({navigation}) => {
  const {
    allMyOrder,
    // confirmMyOrder,
    deliveryMyOrder,
    completeMyOrder,
    cancelMyOrder,
    timeOrderType,
  } = useSelector(state => state.data);

  // console.log('allMyOrder12121', allMyOrder);
  const data = [
    // {
    //   title: `${
    //     Array.isArray(confirmMyOrder)
    //       ? `Chờ xác nhận (${confirmMyOrder?.length})`
    //       : 'Chờ xác nhận'
    //   }`,
    //   icon: 'cube-outline',
    //   content: <CustomFlatList allMyOrder={confirmMyOrder} type="0" />,
    // },
    {
      title: `${
        Array.isArray(deliveryMyOrder)
          ? `Đang giao (${deliveryMyOrder?.length})`
          : 'Đang giao'
      }`,
      icon: 'cube-outline',
      content: <CustomFlatList allMyOrder={deliveryMyOrder} type="1" />,
    },
    {
      title: `${
        Array.isArray(completeMyOrder)
          ? `Đã giao (${completeMyOrder?.length})`
          : 'Đã giao'
      }`,
      icon: 'checkmark-circle-outline',
      content: <CustomFlatList allMyOrder={completeMyOrder} type="2" />,
    },
    {
      title: `${
        Array.isArray(cancelMyOrder)
          ? `Đã hủy (${cancelMyOrder?.length})`
          : 'Đã hủy'
      }`,
      icon: 'close-circle-outline',
      content: <CustomFlatList allMyOrder={cancelMyOrder} type="3" />,
    },
    // {
    //   title: `${
    //     Array.isArray(allMyOrder) ? `Tất cả (${allMyOrder?.length})` : 'Tất cả'
    //   }`,
    //   icon: 'albums-outline',
    //   content: <CustomFlatList allMyOrder={allMyOrder} type="Tất cả" />,
    // },
  ];
  // console.log('loading MyOrder ', i.current++);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Header title="Đơn hàng" />
      </View>
      <CustomTab data={data} />
    </View>
  );
};

export default MyOrder;
