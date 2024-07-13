import { TouchableOpacity, Text, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'

const SuggestItem = ({ product }) => {

    const navigation = useNavigation()

    const handleToProductDetail = () => {

        navigation.navigate("ProductDetail", {
            productId: product._id
        })
    }

    return (
        <TouchableOpacity onPress={handleToProductDetail} style={tw`py-[16px] items-center flex-row border-b border-[#C8C2C2]`}>
            <Image
                source={{ uri: product.images }}
                style={[tw`w-[50px] h-[50px]`, { objectFit: 'contain' }]}
            />
            <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={tw`ml-[10px] text-[#333] flex-1`}
            >
                {product.title}
            </Text>
        </TouchableOpacity>
    )
}

export default SuggestItem