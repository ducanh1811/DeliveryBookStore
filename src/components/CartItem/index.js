import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import CheckBox from 'react-native-check-box'
import { PRIMARY_COLOR, YELLOW_COLOR } from '../../styles/color.global'
import tw from 'twrnc'
import numeral from 'numeral'
import IconFont from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'

const CartItem = ({ cart, isSelect, onChange, minus, plus, remove }) => {

    const navigation = useNavigation()

    const handleToDetail = () => {

        navigation.navigate('ProductDetail', {
            productId: cart.product._id,
        })
    }

    return (
        <TouchableOpacity onPress={handleToDetail} style={tw`p-[10px] mt-[10px] bg-white rounded-[6px] flex-row items-center overflow-hidden`}>
            <CheckBox
                isChecked={isSelect}
                checkBoxColor="#999"
                checkedCheckBoxColor={YELLOW_COLOR}
                onClick={onChange}
            />
            <Image
                source={{ uri: cart?.product?.images }}
                style={[tw`w-[80px] h-[100px] mx-[20px]`, styles.image]}
            />
            <View style={tw`justify-between flex-2`}>
                <Text numberOfLines={2} style={tw`text-[#333] w-[100%]`}>
                    {cart?.product?.title}
                </Text>
                <View style={tw`flex-row items-center py-[10px]`}>
                    <Text style={[tw`font-bold`, { color: YELLOW_COLOR }]}>
                        {numeral(cart?.product?.price).format('0,0')} đ
                    </Text>
                    <Text style={[tw`text-[12px] mx-[10px]`, { textDecorationLine: 'line-through', textDecorationStyle: 'solid' }]}>
                        {numeral(cart?.product?.old_price).format('0,0')} đ
                    </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-[#eee] flex-row items-center py-[2px] rounded-[6px]`}>
                        <TouchableOpacity onPress={minus} style={tw`px-[10px]`}>
                            <IconFont
                                name="minus"
                                size={16}
                            />
                        </TouchableOpacity>
                        <Text style={tw`text-[#333] text-[16px] px-[20px] py-[2px] rounded-[4px] bg-white`}>{cart.quantity}</Text>
                        <TouchableOpacity onPress={plus} style={tw`px-[10px]`}>
                            <IconFont
                                name="plus"
                                size={16}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={remove} style={tw`ml-[20px]`}>
                        <IconFont
                            name="trash"
                            size={20}
                            color={PRIMARY_COLOR}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        objectFit: 'contain'
    }
})

export default CartItem