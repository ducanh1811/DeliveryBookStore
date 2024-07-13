import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ToastAndroid,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import axios, {all} from 'axios';
import {getAuthInstance} from '../../utils/storage';
import {useSelector, useDispatch} from 'react-redux';
import {Avatar, Icon, Skeleton, Rating, ListItem} from '@rneui/themed';
import tw from 'twrnc';
import {PRIMARY_COLOR} from '../../styles/color.global';
import Clipboard from '@react-native-clipboard/clipboard';
import {set} from 'react-hook-form';
import {apiGetAllOrderForMe, apiGetStatusOrderForMe} from '../../apis/data';
import {
  getAllMyOrder,
  getConfirmMyOrder,
  getDeliveryMyOrder,
  getCompleteMyOrder,
  getCancelMyOrder,
} from '../../stores/dataSlice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {useRef} from 'react';
// import FlatList from './FlatList';
import {useMemo} from 'react';
import ItemFlatList from './ItemFlatList';

const CustomFlatList = memo(({allMyOrder, type}) => {
  // const [users, setUsers] = useState([]);
  const {orientation} = useSelector(state => state.other);
  const {loading, deliveryMyOrder} = useSelector(state => state.data);
  const [data, setData] = useState([]);
  const [isEnd, setIsEnd] = useState(false);
  // type == 1 &&
  //   console.log(
  //     deliveryMyOrder.length,
  //     allMyOrder.length,
  //     'deliveryMyOrde1212121r',
  //   );
  const [currentPage, setCurrentPage] = useState(1);
  // const pageRef = useRef(currentPage);
  const [isLoading, setIsLoading] = useState(false);
  // const {loading} = useSelector(state => state.data);
  // const [completeLoading, setCompleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {user, token} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const i = useRef(0);
  // type == 1 ? (allMyOrder = deliveryMyOrder) : null;
  console.log(deliveryMyOrder.length, 'deliveryMyOrder1212');
  let completeLoading = false;
  // const loading = false;

  // console.log('loading', allMyOrder.length, type, loading);
  // console.log('loading CustomFlatList ', i.current++, allMyOrder);

  useEffect(() => {
    // sau 15 giây sẽ tắt loading
    const timeout = setTimeout(() => {
      completeLoading = true;
      // console.log('completeLoading', completeLoading, loading);
    }, 1500);

    return () => {
      // Xóa timeout khi component unmount
      // console.log('xoa timeout');
      clearTimeout(timeout);
    };
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // console.log('abc');
    const response =
      type == 'Tất cả'
        ? await apiGetAllOrderForMe(token, user?._id, '01', 10)
        : await apiGetStatusOrderForMe('01' + type + token + user?._id);
    // console.log('respons2e21', response.status, response.data.data);
    // console.log('abc1');
    if (response.status === 200) {
      // console.log('goi lai ne onrefresh');
      type == 'Tất cả'
        ? dispatch(getAllMyOrder(response?.data?.data))
        : type == '0'
        ? dispatch(getConfirmMyOrder(response?.data?.data))
        : type == '1'
        ? dispatch(getDeliveryMyOrder(response?.data?.data))
        : type == '2'
        ? dispatch(getCompleteMyOrder(response?.data?.data))
        : dispatch(getCancelMyOrder(response?.data?.data));
      // console.log('abc3');
      setCurrentPage(1);
      // console.log('abc4212');
      setRefreshing(false);
      ToastAndroid.show('Loading thành công', ToastAndroid.SHORT);
      // console.log('abc5');
      // setIsLoading(false);
      // console.log('abc6');
    } else {
      setRefreshing(false);
      ToastAndroid.show('Mạng không ổn định', ToastAndroid.SHORT);
    }
  }, []);

  const getUsers = async () => {
    setIsLoading(true);
    console.log(
      deliveryMyOrder.length,
      allMyOrder.length,
      'deliveryMyOrde1212122121r',
    );
    //const allMyOrderNew = allMyOrder.slice(0, 10 * currentPage);
    // console.log('currentPagene', currentPage, type);
    if (currentPage * 10 > allMyOrder.length) {
      if (type == 'Tất cả') {
        const response = await apiGetAllOrderForMe(
          //token, shipper, page, limit
          token,
          user?._id,
          currentPage.toString().padStart(2, '0'),
          10,
        );
        // setUsers([...users, ...response.data.data]);
        dispatch(getAllMyOrder([...allMyOrder, ...response?.data?.data]));
      } else if (type == '0') {
        // console.log(
        //   'test',
        //   currentPage.toString().padStart(2, '0') + type + token + user?._id,
        // );
        const response = await apiGetStatusOrderForMe(
          currentPage.toString().padStart(2, '0') + type + token + user?._id,
        );
        dispatch(getConfirmMyOrder([...allMyOrder, ...response?.data?.data]));
      } else if (type == '1') {
        const response = await apiGetStatusOrderForMe(
          currentPage.toString().padStart(2, '0') + type + token + user?._id,
        );
        
        // console.log('goi lai ne usser');
        dispatch(getDeliveryMyOrder([...allMyOrder, ...response?.data?.data]));
      } else if (type == '2') {
        const response = await apiGetStatusOrderForMe(
          currentPage.toString().padStart(2, '0') + type + token + user?._id,
        );
        dispatch(getCompleteMyOrder([...allMyOrder, ...response?.data?.data]));
      } else if (type == '3') {
        const response = await apiGetStatusOrderForMe(
          currentPage.toString().padStart(2, '0') + type + token + user?._id,
        );
        dispatch(getCancelMyOrder([...allMyOrder, ...response?.data?.data]));
      }
    } else {
    }
    setIsLoading(false);
  };

  // console.log('allMyOrdernew', allMyOrder.length + ' ' + type);

  // loading
  const fameLoading = index => {
    return (
      <View
        key={index}
        style={tw`px-2 py-1 bg-white border-b border-gray-100 flex flex-row`}>
        <View style={tw`flex-3 flex-col flex py-[10px] px-[7px]`}>
          <View style={tw`flex-row justify-between items-start`}>
            <Skeleton
              animation="wave"
              width={orientation != 'portrait' ? 400 : 280}
              height={25}
              // skeletonStyle={tw``}
            />
            <TouchableOpacity
              style={tw`flex-col items-center flex-1 ${
                orientation != 'portrait' ? `ml-80` : ``
              }`}>
              <Icon
                name={'copy-outline'}
                type="ionicon"
                color="gray"
                size={22}
                style={tw`ml-10`}
              />
            </TouchableOpacity>
          </View>
          <Skeleton
            animation="wave"
            width={155}
            height={13}
            style={tw`mt-1.4`}
          />
          <Skeleton animation="wave" width={220} height={13} style={tw`mt-1`} />

          <Skeleton animation="wave" width={140} height={13} style={tw`mt-1`} />

          <View style={tw`flex-row justify-between items-center`}>
            <Skeleton
              animation="wave"
              width={200}
              height={33}
              style={tw`mt-1`}
            />
            <Skeleton
              animation="wave"
              width={135}
              height={40}
              style={tw`flex-row items-center rounded p-2 mt-1`}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="small" color={PRIMARY_COLOR} />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    // console.log('loadMoreItem', isLoading);
    isLoading == false ? setCurrentPage(currentPage + 1) : null;
  };

  useEffect(() => {
    // console.log('Da vao roi 112');
    console.log(allMyOrder.length, 'allMyOrder.length');
    if (allMyOrder.length != 0) {
      currentPage > 1 && getUsers();
      !loading && setData(allMyOrder.slice(0, 10 * currentPage));
      // console.log('currentPage', currentPage, allMyOrder.length);
      allMyOrder.length > 0 &&
        setIsEnd(currentPage * 10 - 10 > allMyOrder.length);
    }
  }, [currentPage, loading]);

  // isEnd && setIsLoading(false);

  useEffect(() => {
    if (type == '1' && deliveryMyOrder.length > 0) {
      console.log('load lai ne ', deliveryMyOrder.length);
      setData(deliveryMyOrder.slice(0, 10 * currentPage));
      setIsEnd(currentPage * 10 - 10 > deliveryMyOrder.length);
    }
  }, [deliveryMyOrder]);

  return (
    <>
      {/* hết loading đầu tiên */}
      {!loading ? (
        // Nếu có đơn đặt hàng
        allMyOrder.length > 0 ? (
          data.length > 0 ? (
            <>
              <FlatList
                data={data}
                renderItem={({item, index}) => {
                  // console.log(type);
                  return (
                    <ItemFlatList
                      item={item}
                      index={index}
                      onRefresh={onRefresh}
                    />
                  );
                }}
                keyExtractor={item => item._id}
                // extraData={currentPage}
                ListFooterComponent={renderLoader}
                onEndReached={!isEnd && loadMoreItem}
                onEndReachedThreshold={0.3}
                // removeClippedSubviews={true} // Bật cắt bỏ phần con không được hiển thị
                removeClippedSubviews={true}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[PRIMARY_COLOR]}
                  />
                }
              />
            </>
          ) : // <View
          //   style={tw`text-center text-[#666] ${
          //     orientation == `portrait`
          //       ? `pr-3 h-200 w-100 text-base`
          //       : `w-210 h-full text-base`
          //   }`}>
          //   {Array.from({length: 1}).map((_, index) => fameLoading(index))}
          // </View>
          null
        ) : (
          // Nếu không có đơn đặt hàng nào
          <ScrollView
            style={tw`bg-white`}
            onRefresh={onRefresh}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[PRIMARY_COLOR]}
              />
            }>
            <View style={tw`flex justify-center items-center h-180`}>
              <Text style={tw`text-[#666] text-base`}>
                Bạn không có đơn đặt hàng nào{' '}
                {type === 'Tất cả'
                  ? ''
                  : type === '0'
                  ? 'đang chờ xác nhận'
                  : type === '1'
                  ? 'đang giao'
                  : type === '2'
                  ? 'đã hoàn thành'
                  : 'đã hủy'}
                !
              </Text>
            </View>
          </ScrollView>
        )
      ) : /* đang loading đầu tiên */
      // trước 15sx
      !completeLoading ? (
        <View
          style={tw`text-center text-[#666] 
          ${
            orientation == `portrait`
              ? `pr-2 h-200 text-base`
              : `w-210 h-full text-base`
          }`}>
          {Array.from({length: 5}).map((_, index) => fameLoading(index))}
        </View>
      ) : (
        // sau 15s mà chưa load xong, khả năng cao là mạng yếu
        <View style={tw`flex justify-center items-center h-200`}>
          <Text style={tw`text-[#666] text-base`}>
            Mạng không ổn định, vui lòng thử lại!
          </Text>
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  itemWrapperStyle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemImageStyle: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  contentWrapperStyle: {
    justifyContent: 'space-around',
  },
  txtNameStyle: {
    fontSize: 16,
  },
  txtEmailStyle: {
    color: '#777',
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});

export default CustomFlatList;
