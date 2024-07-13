import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import IconFont from 'react-native-vector-icons/FontAwesome5'
import { BORDER_COLOR, PRIMARY_COLOR } from '../../styles/color.global'

const AddProductToCartBar = ({ plus, minus, addToCart, buyNow, quantity }) => {

    return (
        <View style={[styles.container, tw`h-[50px] bg-white justify-center items-center`]}>
            <View style={tw`h-full flex-row items-center border-r border-[${BORDER_COLOR}]`}>
                <TouchableOpacity onPress={minus} style={tw`px-[20px]`}>
                    <IconFont
                        name="minus"
                        size={16}
                    />
                </TouchableOpacity>
                <Text style={tw`text-[#333] text-[16px]`}>{quantity}</Text>
                <TouchableOpacity onPress={plus} style={tw`px-[20px]`}>
                    <IconFont
                        name="plus"
                        size={16}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={tw`px-[10px] flex-1`} onPress={addToCart}>
                <Text style={[tw`font-bold`, { color: PRIMARY_COLOR }]}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={buyNow} style={[tw`px-[20px] flex-row items-center justify-center h-full`, { backgroundColor: PRIMARY_COLOR }]}>
                <Text style={[tw`font-bold text-white`]}>Mua ngay</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        bottom: 0,
        zIndex: 100,
        flexDirection: 'row',
    },
})

export default AddProductToCartBar