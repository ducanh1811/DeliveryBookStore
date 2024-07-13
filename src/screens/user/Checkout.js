import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import Header from '../../components/Header'
import tw from 'twrnc'
import { useSelector, useDispatch } from 'react-redux'
import IconFont from 'react-native-vector-icons/FontAwesome6'
import CheckoutItem from '../../components/CheckoutItem'
import numeral from 'numeral'
import Loading from '../../components/loaders/Loading'
import Toast from 'react-native-toast-message'
import { BLUE_COLOR, BORDER_COLOR, PINK_COLOR, PRIMARY_COLOR, YELLOW_COLOR } from '../../styles/color.global'
import { CheckBox } from '@rneui/themed';
import { API_KEY, apiMaps, locationShop, paymentMethodList, shippingMethodList } from '../../constants'
import { useScrollToTop } from '@react-navigation/native'
import { apiCheckout, apiCreateOrderItem, apiUpdateVoucher } from '../../apis/user'
import { remove, updateListCheckout } from '../../stores/cartSlice'

const checkExpired = (expiredDate) => {

    const today = new Date()
    const expired = new Date(expiredDate)

    return today <= expired ? true : false
}

const Checkout = ({ route, navigation }) => {

    const dispatch = useDispatch()
    const scrollRef = useRef(null)
    const { listCheckout } = useSelector(state => state.cart)
    const { user, defaultAddress, token } = useSelector(state => state.user)
    const { addressDelivery } = useSelector(state => state.other)
    const { vouchers } = useSelector(state => state.data)
    const [paymentMethodId, setPaymentMethod] = React.useState(0)
    const [shippingMethod, setShippingPaymentMethod] = React.useState(0)
    const [subTotal, setSubTotal] = React.useState(0)
    const [total, setTotal] = React.useState(0)
    const [locationAddress, setLocationAddress] = useState([]);
    const [distance, setDistance] = useState(0);
    const [shippingFee, setShippingFee] = React.useState(0)
    const [discount, setDiscount] = React.useState(0)
    const [address, setAddress] = React.useState({})
    const [checkoutData, setCheckoutData] = React.useState([])
    const [voucherCodeList, setVoucherCodeList] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [voucher, setVoucher] = React.useState()
    const [message, setMessage] = React.useState()
    const [quantity, setQuantity] = React.useState(0)

    const handleToAddAddress = () => {

        navigation.navigate('AddAddress')
    }

    const handleToChooseAddress = () => {

        navigation.navigate('DeliveryAddress')
    }

    const handleAddVoucherCode = async (voucher) => {
        setVoucher(voucher)
    }

    const handleCheckout = async () => {

        // const tem = 0

        // if (tem == 0) {
        //     navigation.navigate('CheckoutSuccess')
        //     return
        // } else {

        // }

        const order = {
            address: address.street,
            city: address.province,
            country: "Việt Nam",
            deliveryDate: 'null',
            email: user.email,
            districs: address.district,
            name: address.name,
            payment_method: paymentMethodList[paymentMethodId],
            phone: address.phone,
            price: total,
            quantity: quantity,
            shippingCost: shippingFee,
            shipping_method: shippingMethodList[shippingMethod],
            user: user._id,
            wards: address.ward,
            message: message,
            flashsales: [],
            items: [],
        }

        setLoading(true)
        const response = await apiCheckout(order, token)
        if (response.status === 200) {
            const order = response.data.data
            const orderItems = checkoutData.map((item) => ({
                quantity: item.quantity,
                price: item.product.price * item.quantity,
                order: order._id,
                product: item.product._id,
            }))
            orderItems.forEach(async item => {
                await apiCreateOrderItem(token, item)
            })
            if (voucher) {
                await apiUpdateVoucher(voucher._id, { ...voucher, status: false })
            }
            setLoading(false)

            setTimeout(() => {
                navigation.navigate('CheckoutSuccess')
            }, 500)
            checkoutData.forEach(item => {
                dispatch(remove({
                    userId: user?._id,
                    productId: item?.product?._id
                }))
            })
            dispatch(updateListCheckout([]))
        } else {
            Toast.show({
                text1: 'Thanh toán thất bại!',
                type: 'error'
            })
        }
    }

    const setDefaultAddress = () => {
        addressDelivery.forEach(address => {
            if (address.selected) {
                setAddress(address)
                return
            }
        })
    }

    const handleOnFocus = () => {
        scrollRef.current.scrollToEnd({ animated: true })
    }

    React.useEffect(() => {

        if (voucher) {
            const calDiscount = subTotal * (voucher.discount / 100)
            setDiscount(calDiscount)
        }
    }, [voucher])

    React.useEffect(() => {

        setCheckoutData(listCheckout[user._id])
    }, [listCheckout])

    React.useEffect(() => {

        setDefaultAddress()
    }, [addressDelivery])

    React.useEffect(() => {

        const calSubTotal = checkoutData?.reduce((acc, item) => {

            return acc + item.quantity * item.product.price
        }, 0)

        const calQuantity = checkoutData?.reduce((acc, item) => {

            return acc + item.quantity
        }, 0)

        setSubTotal(calSubTotal)
        setQuantity(calQuantity)
    }, [checkoutData])

    React.useEffect(() => {

        const calTotal = (subTotal + shippingFee) - discount

        setTotal(calTotal)

    }, [shippingFee, discount, subTotal])

    React.useEffect(() => {
        if (vouchers.length > 0) {

            const newListVouchers = vouchers.filter(voucher => voucher.status && checkExpired(voucher.expried))
            setVoucherCodeList(newListVouchers)
        }
    }, [vouchers])

    React.useEffect(() => {
        fetch(`${apiMaps}geocoding/v5/mapbox.places/${`${address?.street}, ${address?.ward}, ${address?.district}, ${address?.province}`}.json?access_token=${API_KEY}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.features.length) {
                    setLocationAddress(result['features'][0]['center']);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [address]);

    React.useEffect(() => {
        fetch(
            `${apiMaps}directions/v5/mapbox/driving/${locationShop[0]},${locationShop[1]};${locationAddress[0]},${locationAddress[1]}.json?access_token=${API_KEY}`,
        )
            .then((response) => response.json())
            .then((result) => {
                if (!result.message) {
                    setDistance(result['routes'][0]['distance'] / 1000);
                }
            });
    }, [locationAddress]);

    React.useEffect(() => {
        var timeShipping = 0;
        if (distance <= 5.5) {
            setShippingFee(15000);
            timeShipping = 0.5;
        } else if (distance > 5.5 && distance <= 10.5) {
            setShippingFee(20000);
            timeShipping = 1;
        } else if (distance > 10.5 && distance <= 20.5) {
            setShippingFee(25000);
            timeShipping = 1.5;
        } else {
            setShippingFee(30000);
            timeShipping = distance / 120;
        }
        // moment.locale('vi');
        // const deliverytime = moment().add(timeShipping, 'days').calendar();
        // setDeliveryTime(deliverytime);
    }, [distance]);

    return (
        <View style={tw`relative flex-1`}>
            {
                loading && <Loading />
            }
            <Header title="Thông tin thanh toán" />
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
                <View style={tw`border-t border-[${BORDER_COLOR}]`}>
                    {
                        user?.address?.length > 0
                            ?
                            <TouchableOpacity onPress={handleToChooseAddress} style={tw`flex-row items-center px-[20px] py-[10px] bg-white`}>
                                <View style={tw`flex-1 mr-[10px]`}>
                                    <Text style={[tw`mb-[6px] font-bold`, { color: PRIMARY_COLOR }]}>Địa chỉ: </Text>
                                    <View style={tw`flex-row items-center`}>
                                        <Text style={tw`pr-[10px] font-bold text-[#333] border-r border-[${BORDER_COLOR}]`}>
                                            {address?.name}
                                        </Text>
                                        <Text style={tw`font-bold text-[#333] pl-[10px]`}>
                                            {address?.phone}
                                        </Text>
                                    </View>
                                    <Text style={tw`mt-[6px]`}>{`${address?.street}, ${address?.ward}, ${address?.district}, ${address?.province}`}</Text>
                                </View>
                                <IconFont
                                    name="chevron-right"
                                    size={16}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={handleToAddAddress} style={tw`flex-row items-center px-[10px] py-[20px] bg-white`}>
                                <Text style={tw`text-[#333] flex-1 font-bold ml-[10px]`}>Thêm địa chỉ</Text>
                                <IconFont
                                    name="chevron-right"
                                    size={16}
                                    color="#333"
                                />
                            </TouchableOpacity>
                    }
                </View>
                <View>
                    {
                        checkoutData?.map((item, index) => (
                            <CheckoutItem key={index} item={item} />
                        ))
                    }
                </View>
                <View style={tw`mt-[10px] p-[10px] bg-white`}>
                    <Text style={tw`text-[#333] font-bold ml-[10px]`}>Phương thức thanh toán</Text>
                    <View>
                        <CheckBox
                            checked={paymentMethodId === 0}
                            onPress={() => setPaymentMethod(0)}
                            iconType="material-community"
                            checkedIcon="radiobox-marked"
                            uncheckedIcon="radiobox-blank"
                            title="Thanh toán khi nhận hàng"
                            checkedColor={PRIMARY_COLOR}
                        />
                        {/* <CheckBox
                            checked={paymentMethodId === 1}
                            onPress={() => setPaymentMethod(1)}
                            iconType="material-community"
                            checkedIcon="radiobox-marked"
                            uncheckedIcon="radiobox-blank"
                            title="Thanh toán bằng VNPay"
                            checkedColor={PRIMARY_COLOR}
                        /> */}
                    </View>
                </View>
                <View style={tw`mt-[10px] p-[10px] bg-white`}>
                    <Text style={tw`text-[#333] font-bold ml-[10px]`}>Phương thức giao hàng</Text>
                    <View>
                        <CheckBox
                            checked={paymentMethodId === 0}
                            onPress={() => setShippingPaymentMethod(0)}
                            iconType="material-community"
                            checkedIcon="radiobox-marked"
                            uncheckedIcon="radiobox-blank"
                            title="Giao hàng tiêu chuẩn"
                            checkedColor={PRIMARY_COLOR}
                        />
                        {/* <CheckBox
                            checked={paymentMethodId === 1}
                            onPress={() => setPaymentMethod(1)}
                            iconType="material-community"
                            checkedIcon="radiobox-marked"
                            uncheckedIcon="radiobox-blank"
                            title="Thanh toán bằng VNPay"
                            checkedColor={PRIMARY_COLOR}
                        /> */}
                    </View>
                </View>
                {
                    voucherCodeList?.length > 0
                        ?
                        <View style={tw`mt-[10px] p-[10px] bg-white`}>
                            <Text style={tw`text-[#333] font-bold ml-[10px] mb-[10px]`}>Áp dụng mã voucher</Text>
                            <FlatList
                                horizontal={true}
                                pagingEnabled
                                keyExtractor={(p) => p._id}
                                data={voucherCodeList}
                                renderItem={({ item }) =>
                                    <View style={[tw`py-[10px] px-[20px] rounded-[4px] mr-[10px]`, { backgroundColor: `${voucher?._id === item._id ? BORDER_COLOR : BLUE_COLOR}` }]}>
                                        <Text style={tw`font-bold text-white`}>{item?.code}</Text>
                                        <View style={tw`flex flex-row items-center justify-between mt-[6px]`}>
                                            <Text style={[tw`font-bold mr-[10px]`, { color: PRIMARY_COLOR }]}>{'-' + item?.discount + '%'}</Text>
                                            <TouchableOpacity
                                                disabled={voucher?._id === item._id}
                                                onPress={() => handleAddVoucherCode(item)}
                                                style={[tw`p-[4px] rounded-[4px]`, { backgroundColor: `${voucher?._id === item._id ? "#666" : YELLOW_COLOR}` }]}
                                            >
                                                <Text style={tw`text-white`}>Áp dụng</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                            />
                        </View>
                        : <></>
                }
                <View style={tw`mt-[10px] p-[10px] bg-white`}>
                    <Text style={tw`text-[#333] font-bold ml-[10px]`}>Ghi chú</Text>
                    <View>
                        <TextInput
                            onFocus={handleOnFocus}
                            onChangeText={(text) => setMessage({ text })}
                            value={message}
                            multiline={true}
                            numberOfLines={4}
                            style={tw`border border-[${BORDER_COLOR}] rounded-[4px] p-[10px] m-0`}
                        />
                    </View>
                </View>
                <View style={tw`mt-[10px] p-[10px] bg-white`}>
                    <View style={tw`mx-[10px] flex-row items-center`}>
                        <Text style={tw`flex-1`}>Tạm tính</Text>
                        <Text style={tw`text-[#333]`}>{numeral(subTotal).format('0,0')} đ</Text>
                    </View>
                    <View style={tw`mx-[10px] flex-row items-center`}>
                        <Text style={tw`flex-1`}>Phí vận chuyển</Text>
                        <Text style={tw`text-[#333]`}>{numeral(shippingFee).format('0,0')} đ</Text>
                    </View>
                    <View style={tw`mx-[10px] flex-row items-center`}>
                        <Text style={tw`flex-1`}>Giảm giá</Text>
                        <Text style={tw`text-[#333]`}>-{numeral(discount).format('0,0')} đ</Text>
                    </View>
                    <View style={tw`mx-[10px] flex-row items-center`}>
                        <Text style={tw`flex-1`}>Tổng</Text>
                        <Text style={tw`text-[#333]`}>{numeral(total).format('0,0')} đ</Text>
                    </View>
                </View>
                <View style={tw`mb-[100px]`}></View>
            </ScrollView>
            <View style={[styles.button, tw`p-[10px] h-[90px] bg-white border-t border-[${BORDER_COLOR}]`]}>
                <View style={tw`mx-[10px] flex-row items-center`}>
                    <Text style={tw`flex-1 text-[16px] font-bold text-[#333]`}>Tổng</Text>
                    <Text style={[tw`text-[16px] font-bold`, styles.total]}>{numeral(total).format('0,0')} đ</Text>
                </View>
                <TouchableOpacity
                    onPress={handleCheckout}
                    style={tw`rounded-[100px] items-center justify-center py-[10px] px-[40px] mt-[10px] bg-[${PRIMARY_COLOR}]`}
                >
                    <Text style={tw`font-bold text-white`}>Thanh toán</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    total: {
        color: PRIMARY_COLOR
    }
})

export default Checkout