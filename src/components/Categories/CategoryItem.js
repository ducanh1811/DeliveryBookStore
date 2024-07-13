import { TouchableOpacity, Text, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'

const CategoryItem = ({ category }) => {

    const navigation = useNavigation()

    const handleToProduct = () => {
        navigation.navigate("Product", { keywords: null, categoryId: category.id })
    }

    return (
        <TouchableOpacity onPress={handleToProduct} style={tw`items-center mx-[10px]`}>
            <Image
                source={{ uri: category.image }}
                style={tw`w-[50px] h-[50px]`}
            />
            <Text style={tw`text-[13px] text-center mt-[10px] max-w-[100px]`}>
                {category.title}
            </Text>
        </TouchableOpacity>
    )
}

export default CategoryItem