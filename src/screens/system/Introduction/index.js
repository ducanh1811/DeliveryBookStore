import React from 'react';
import {useEffect} from 'react';
import {
  getAllMyOrder,
  getCancelMyOrder,
  getCompleteMyOrder,
  getConfirmMyOrder,
  getDeliveryMyOrder,
} from '../../../stores/dataSlice';
import {token, user} from '../../../stores';
import {useState} from 'react';
import {
  apiGetAllOrderForMe,
  apiGetCityOrderForMe,
  apiGetStatusOrderForMe,
} from '../../../apis/data';
import {useDispatch} from 'react-redux';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';
import {StatusBar} from 'react-native';
import {Image, View} from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import {PRIMARY_COLOR} from '../../../styles/color.global';
import Toast from 'react-native-toast-message';
import { logout } from '../../../stores/userSlice';
// import {useNavigation} from '@react-navigation/native';

function Introduction({setIsIntro}) {
  const {user, token} = useSelector(state => state.user);
  const lottieSrc = require('../../../assets/jsons/login.json');
  const imgLogo = require('../../../assets/images/logos/TA.png');
  const dispatch = useDispatch();
  // const navigation = useNavigation();
  // load data
  useEffect(() => {
    if (!token) return;
    setIsIntro(true);
    // lấy đơn hàng trong khu vực của tôi
    const fetchData = async () => {
      try {
        const data = await apiGetCityOrderForMe(1, token, user?.city);
        console.log("allOrder1")
        if (data?.action === 'login') {
          setIsIntro(false);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Thông báo hệ thống',
            text2: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.',
          });
          dispatch(logout());
          // return;
        }
        
        const allOrder = await apiGetAllOrderForMe(token, user?._id, 1, 10);
        console.log("allOrder")
        
        // const confirmOrder = await apiGetStatusOrderForMe(token, user?._id, 'CHOXACNHAN', 1, 10);
        const deliveryOrder = await apiGetStatusOrderForMe(
          '01' + '1' + token + user?._id,
        );
        const completeOrder = await apiGetStatusOrderForMe(
          '01' + '2' + token + user?._id,
        );
        const cancelOrder = await apiGetStatusOrderForMe(
          '01' + '3' + token + user?._id,
        );

        const ordersFilter = allOrder?.data?.data;

        dispatch(getAllMyOrder(ordersFilter));

        dispatch(getDeliveryMyOrder(deliveryOrder.data.data));

        dispatch(getCompleteMyOrder(completeOrder.data.data));

        dispatch(getCancelMyOrder(cancelOrder.data.data));

        dispatch(getConfirmMyOrder(data?.data?.data));

        setIsIntro(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsIntro(false);
      }
    };
    fetchData(); // Gọi hàm async từ hàm fetchData
  }, [token]);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={[
            tw`w-full h-[100%] items-center pt-10`,
            {backgroundColor: 'rgb(45, 50, 80)'},
          ]}>
          <LottieView
            source={lottieSrc}
            autoPlay={true}
            loop
            style={{flexGrow: 1, width: '60%'}}
          />
          <View style={tw`flex-row items-end mb-3 justify-center`}>
            <Image source={imgLogo} style={tw`w-10 h-10`} />
            <Text style={tw`text-[${PRIMARY_COLOR}] ml-2 text-2xl font-bold`}>
              TA Book Store
            </Text>
          </View>
          <Text style={tw`text-white text-lg mb-20`}>Loading...</Text>
        </View>
      </View>
    </>
  );
}

export default Introduction;
