import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  PanResponder,
  Touchable,
} from 'react-native';
import React, {memo} from 'react';
import {useState, useEffect} from 'react';
import {Avatar, Icon, ListItem, Dialog, Skeleton, Rating} from '@rneui/themed';

import tw from 'twrnc';
import Header from '../../components/Header/index';
import SwipeToDeleteEditItem from '../../components/SwipeToDeleteEditItem/index';
import {BLUE_COLOR, PRIMARY_COLOR} from '../../styles/color.global';
import Button from '../../components/Button/index';
import {useSelector, useDispatch} from 'react-redux';

import {color} from '@rneui/themed/dist/config';
import {
  apiDeleteFavorites,
  apiGetCityOrderForMe,
  apiGetFavoritesForMe,
  apiGetStatusOrderForMe,
  apiUpdateOrder,
} from '../../apis/data';
import {getDeliveryMyOrder, getFavorites} from '../../stores/dataSlice';
import CustomDialog from '../../components/CustomDialog';
import {getAddressDelivery} from '../../stores/otherSlice';
import {getConfirmMyOrder} from '../../stores/dataSlice';
import Toast from 'react-native-toast-message';
const DeliveryAddress = ({route, navigation}) => {
  const {loading} = useSelector(state => state.data);
  const {user, token, isLoggedIn} = useSelector(state => state.user);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isdeleting, setIsdeleting] = useState(false);
  const {addressDelivery, orientation} = useSelector(state => state.other);
  const [deleteItem, setDeleteItem] = useState(null);
  const {confirmMyOrder} = useSelector(state => state.data);
  console.log(loading, 'loading');
  const dispatch = useDispatch();

  const onRefresh = React.useCallback(async () => {
    // apiGetCityOrderForMe;
    // chờ 1s để hiển thị loading

    try {
      setRefreshing(true);
      const data = await apiGetCityOrderForMe(1, token, user?.city);
      dispatch(getConfirmMyOrder(data?.data?.data));
      setRefreshing(false);
    } catch (error) {
      // console.error('Error fetching data:', error);
      setRefreshing(false);
    }
  }, []);

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

  const onDelete = async item => {
    await apiUpdateOrder('DANGGIAO', token, item, user?._id);
    const deliveryOrder = await apiGetStatusOrderForMe(
      '01' + '1' + token + user?._id,
    );
    dispatch(getDeliveryMyOrder(deliveryOrder.data.data));
    onRefresh();
  };

  const updateAddressDelivery = async item => {
    // await apiUpdateOrder('DANGGIAO', token, item._id, user?._id, user?.city);
    // onRefresh();
  };

  useEffect(() => {
    // console.log('nhận giao hàng', deleteItem);
    // deleteItem &&
    //   dispatch(
    //     getAddressDelivery(
    //       addressDelivery.filter(data => data.id != deleteItem),
    //     ),
    //   );
    deleteItem && onDelete(deleteItem);
  }, [deleteItem]);
  // screen khi da dang nhap
  const fameItem = (item, index) => {
    return (
      <View
        key={index}
        style={tw`flex-row justify-between items-center bg-white border-b border-[#f5f5f5]`}>
        <SwipeToDeleteEditItem
          index={index}
          //onDelete={onDelete}
          updateAddressDelivery={updateAddressDelivery}
          addressDelivery={confirmMyOrder}
          func={setDeleteItem}
        />
      </View>
    );
  };

  // console.log('addressDelivery2', addressDelivery.length, deleteItem);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Header title={`Kho ${user?.city}`} />
      </View>
      {isdeleting ? ( // Hiển thị ActivityIndicator khi đang tải
        <ActivityIndicator
          size="large"
          color={PRIMARY_COLOR}
          style={tw`absolute bg-white mt-[80px] top-0 bottom-0 left-0 right-0 opacity-50`}
        />
      ) : null}
      <View
        style={tw`flex-1 bg-[#f5f5f5] flex-${
          orientation == 'portrait' ? `col` : `row`
        } justify-center`}>
        <ScrollView
          style={tw`flex-10 flex bg-white flex-col `}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[PRIMARY_COLOR]}
            />
          }>
          <View style={tw`flex-1`}>
            {confirmMyOrder?.length ? (
              confirmMyOrder.map((item, index) => {
                return fameItem(item, index);
              })
            ) : (
              <View style={tw`flex justify-center h-180 items-center`}>
                <Text style={tw`text-[#666] text-base`}>
                  Không có đơn nào gần bạn!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {orientation == 'portrait' ? (
          <View
            style={tw`flex-1 flex-row justify-center mt-1 items-center bg-white`}>
            {/* <Button
              title="Thêm địa chỉ"
              type="line"
              size="thin"
              icon={() => icon('add', 20, PRIMARY_COLOR)}
              // onPress={() => navigation.navigate('AddAddress', {address: null})}
            /> */}
            <Icon
              name="information-circle-outline"
              type="ionicon"
              color={BLUE_COLOR}
              size={25}
            />
            <Text style={tw`text-[${BLUE_COLOR}] text-sm ml-2`}>
              Quẹt đơn để xác nhận lấy hàng
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddDeliveryAddress')}
            style={tw`flex-1 flex-row justify-center bg-red-200 mt-0 items-center`}>
            <Icon
              name="add-circle-outline"
              type="ionicon"
              color={PRIMARY_COLOR}
              size={40}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DeliveryAddress;
