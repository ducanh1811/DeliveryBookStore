import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useDispatch } from 'react-redux'

const CheckoutSuccess = ({ navigation }) => {

    const dispatch = useDispatch()
    const handleBack = () => {
        navigation.navigate('TabBottom')
    }

    const handleToMyOrder = () => {
        //dispatch(updateLoaded())
        setTimeout(() => {
            navigation.navigate('MyOrder')
        }, 200)
    }

    return (
        <View style={tw`p-[20px] flex-1 justify-center`}>
            <View style={tw`p-[20px] rounded-[6px] bg-white`}>
                <View style={tw`items-center mb-[20px]`}>
                    <Image style={tw`w-[100px] h-[100px]`} source={require('../../assets/images/orderSuccess.png')} />
                </View>
                <Text style={tw`text-center font-bold text-[#333]`}>Chúc mừng! Bạn đã thanh toán thành công</Text>
                <View style={tw`flex-row p-[20px] justify-between`}>
                    <TouchableOpacity onPress={handleToMyOrder} style={tw`px-[20px] py-[8px] bg-red-500 items-center justify-center rounded-[12px]`}>
                        <Text style={tw`font-bold text-white`}>Xem đơn hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleBack} style={tw`px-[20px] py-[8px] bg-blue-500 items-center justify-center rounded-[12px]`}>
                        <Text style={tw`font-bold text-white`}>Mua hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CheckoutSuccess