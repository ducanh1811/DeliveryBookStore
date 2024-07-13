import { View, Text, useWindowDimensions, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../components/Header/index'
import tw from 'twrnc'
import RenderHtml from 'react-native-render-html'

const ProductInfo = ({ route, navigation }) => {

    const { product } = route.params
    const { width } = useWindowDimensions()

    return (
        <ScrollView style={tw`bg-white`}>
            <Header title="Thông tin sản phẩm" navigation={navigation} />
            <View style={tw`p-[10px]`}>
                <View style={tw`flex-row gap-[40px] items-center pt-[20px]`}>
                    <Text style={tw`text-[#333] w-[100px]`} >
                        Mã hàng
                    </Text>
                    <Text style={tw`text-[#333]`} >
                        {product?._id}
                    </Text>
                </View>
                <View style={tw`flex-row gap-[40px] items-center pt-[20px]`}>
                    <Text style={tw`text-[#333] w-[100px]`} >
                        Tác giả
                    </Text>
                    <Text style={tw`text-[#333]`} >
                        {product?.author}
                    </Text>
                </View>
                <View style={tw`flex-row gap-[40px] items-center pt-[20px]`}>
                    <Text style={tw`text-[#333] w-[100px]`} >
                        Ngày xuất bản
                    </Text>
                    <Text style={tw`text-[#333]`} >
                        {product?.published_date}
                    </Text>
                </View>
                <View style={tw`flex-row gap-[40px] items-center pt-[20px]`}>
                    <Text style={tw`text-[#333] w-[100px]`} >
                        Đã bán
                    </Text>
                    <Text style={tw`text-[#333]`} >
                        {product?.sold}
                    </Text>
                </View>
                <View >
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: product?.desciption || "" }}
                        renderersProps={{
                            img: {
                                enableExperimentalPercentWidth: true
                            }
                        }}
                        enableExperimentalMarginCollapsing={true}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default ProductInfo