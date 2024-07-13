import { View, Text, Image } from 'react-native'
import React from 'react'
import numeral from 'numeral'
import tw from 'twrnc'
import { PRIMARY_COLOR } from '../styles/color.global'

const CheckoutItem = ({ item }) => {

    const variantId = item.variantId

    if (item) {
        return (
            <View key={item.product._id} style={tw`flex-row items-center p-[10px] rounded-[4px] bg-white mt-[10px]`}>
                <Image
                    style={[tw`w-[110px] h-[110px] mx-[10px]`, { objectFit: 'contain' }]}
                    source={{ uri: item.product.images }}
                />
                <View style={tw`ml-[4px] flex-1`}>
                    <Text numberOfLines={2} style={tw`text-[#333]`}>
                        {item.product.title}
                    </Text>
                    <Text style={[{ color: PRIMARY_COLOR }, tw`font-bold my-[6px]`]}>
                        {numeral(item.product.price).format('0,0')} đ
                    </Text>

                    <Text style={tw`text-[#333]`}>x{item.quantity}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={tw`p-[20px]`}>
            <Text>Không tồn tại sản phẩm</Text>
        </View>
    )
}

export default CheckoutItem