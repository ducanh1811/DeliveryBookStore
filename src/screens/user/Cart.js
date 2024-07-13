import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../components/Header/index'
import CartItem from '../../components/CartItem/index'
import tw from 'twrnc'
import CheckBox from 'react-native-check-box'
import { YELLOW_COLOR } from '../../styles/color.global'
import numeral from 'numeral'
import Button from '../../components/Button/index'
import Toast from 'react-native-toast-message'
import { minusQuantity, plusQuantity, remove, updateListCheckout } from '../../stores/cartSlice'
import { apiGetProductById } from '../../apis/product'

const Cart = ({ route, navigation }) => {

    const { single } = route?.params || false
    const dispatch = useDispatch()
    const { user, isLoggedIn } = useSelector(state => state.user)
    const { data } = useSelector(state => state.cart)
    const [cartData, setCartData] = React.useState([])
    const [productSelector, setProductSelector] = React.useState([])
    const [selectAll, setSelectAll] = React.useState(false)
    const [total, setTotal] = React.useState(0)

    React.useEffect(() => {

        if (isLoggedIn) {
            if (Object.keys(data).length > 0) {
                if (data.hasOwnProperty(user._id)) {
                    setCartData(data[user._id])
                }
            }
        }

    }, [data])

    React.useEffect(() => {

        const newListSelector = cartData?.filter(cartItem =>
            productSelector.some(item => item.product._id === cartItem.product._id))

        setProductSelector(newListSelector)
    }, [cartData])

    const handleToLogin = () => {
        navigation.navigate('Login')
    }

    const handleToggle = (cart) => {

        const check = productSelector.find(item => item?.product?._id === cart.product._id)

        if (check) {

            const newList = productSelector.filter(item => item?.product?._id !== cart.product._id)

            setProductSelector(newList)
        } else {

            setProductSelector(prev => [...prev, cart])
        }
    }

    const handleToggleSelectAll = () => {

        setSelectAll(prev => !prev)
    }

    const handleToCheckout = () => {

        if (productSelector.length === 0) {

            Toast.show({
                type: 'info',
                text1: 'Vui lòng chọn sản phẩm thanh toán!'
            })
            return
        }
        navigation.navigate('Checkout')
    }

    const handleMinus = (productId) => {

        dispatch(minusQuantity({ userId: user._id, productId }))

    }

    const handlePlus = async (cart) => {

        const response = await apiGetProductById(cart.product._id)

        if (response.status === 200) {

            if (response.data.data.quantity - cart.quantity === 0) {
                Toast.show({
                    type: 'info',
                    text1: 'Số lượng trong kho không đáp ứng!'
                })
            } else {

                dispatch(plusQuantity({ userId: user?._id, productId: cart.product._id }))
            }
        }

    }

    const handleRemove = (productId) => {

        if (productSelector.some(item => item?.product?._id === productId)) {

            Toast.show({
                type: 'info',
                text1: 'Vui lòng bỏ chọn thanh toán trước khi xóa!'
            })
        } else {
            dispatch(remove({ userId: user._id, productId }))
        }
    }

    const handleToShopping = () => {

        navigation.navigate("Product", { keywords: null, categoryId: null })
    }

    React.useEffect(() => {

        if (selectAll) {
            setProductSelector(cartData)
        } else {
            setProductSelector([])
        }
    }, [selectAll])

    React.useEffect(() => {

        if (isLoggedIn) {
            let caculateTotal = productSelector?.reduce((acc, item) => acc + item.quantity * item.product.price, 0)

            setTotal(caculateTotal)
            dispatch(updateListCheckout({
                userId: user._id,
                data: productSelector
            }))
        }

    }, [productSelector])

    return (
        <>
            {
                isLoggedIn
                    ?
                    <View style={tw`relative h-[100%]`}>
                        <Header title="Giỏ hàng" navigation={single ? navigation : false} />
                        <ScrollView style={tw`p-[10px]`}>
                            {
                                cartData?.length > 0 && cartData
                                    ?
                                    <>
                                        <View style={tw`p-[10px] mt-[10px] bg-white rounded-[6px] flex-row items-center overflow-hidden`}>
                                            <CheckBox
                                                isChecked={selectAll}
                                                checkBoxColor="#999"
                                                checkedCheckBoxColor={YELLOW_COLOR}
                                                onClick={handleToggleSelectAll}
                                            />
                                            <Text style={tw`ml-[10px] text-[#333]`}>
                                                Chọn tất cả ({cartData.length} sản phẩm)
                                            </Text>
                                        </View>
                                        <View style={tw`pb-[90px]`}>
                                            {
                                                cartData?.map((cart, index) => (
                                                    <CartItem
                                                        key={index}
                                                        cart={cart}
                                                        isSelect={productSelector.some(item => item?.product?._id === cart.product._id)}
                                                        onChange={() => handleToggle(cart)}
                                                        minus={() => handleMinus(cart.product._id)}
                                                        plus={() => handlePlus(cart)}
                                                        remove={() => handleRemove(cart.product._id)}
                                                    />
                                                ))
                                            }
                                        </View>
                                    </>
                                    :
                                    <View style={tw`p-[10px] items-center justify-center`}>
                                        <Image
                                            style={[tw`w-full h-[200px] mt-[100px]`, { objectFit: 'contain' }]}
                                            source={require('../../assets/images/icons/empty.png')}
                                        />
                                        <Text style={tw`py-[20px] text-[#333] text-[16px] text-center`}>Chưa có sản phẩm trong giỏ hàng của bạn</Text>
                                        <View style={tw`px-[40px]`}>
                                            <Button title="Mua sắm ngay" type="linear" onPress={handleToShopping} />
                                        </View>
                                    </View>
                            }
                        </ScrollView>
                        {
                            cartData?.length > 0 &&
                            <View style={tw`flex-row items-center absolute bottom-0 left-0 right-0 z-100 h-[70px] bg-white px-[20px] py-[10px]`}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`font-bold text-[#333]`}>Thành tiền</Text>
                                    <Text style={[tw`font-bold text-[18px]`, { color: YELLOW_COLOR }]}>
                                        {numeral(total).format('0,0')} đ
                                    </Text>
                                </View>
                                <Button
                                    type="linear"
                                    title="Thanh toán"
                                    icon="arrow-right"
                                    onPress={handleToCheckout}
                                />
                            </View>
                        }
                    </View>
                    :
                    <View
                        style={tw`flex-1 justify-center items-center`}>
                        <View
                            style={tw`flex-col h-full bg-white w-full justify-center items-center`}>
                            <Text style={tw`my-[20px]`}>
                                Vui lòng đăng nhập để xem thông tin giỏ hàng
                            </Text>
                            <Button title="Đăng nhập" type="line" onPress={handleToLogin} />
                        </View>
                    </View>
            }
        </>
    )
}

export default Cart