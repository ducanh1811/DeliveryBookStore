import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { BORDER_COLOR, PINK_COLOR, YELLOW_COLOR } from '../../styles/color.global'
import ProductItem from '../ProductItem/index'
import Button from '../Button/index'
import Skeleton from "@thevsstech/react-native-skeleton"

export const RenderSlideList = (products) => {

    return (
        <FlatList
            horizontal={true}
            pagingEnabled
            keyExtractor={(p) => p._id}
            data={products}
            renderItem={({ item }) => <ProductItem key={item._id} isSlide product={item} />}
        />
    )
}

export const RenderGridList = (products) => {

    return (
        <FlatList
            numColumns={2}
            keyExtractor={(p) => p._id}
            data={products}
            renderItem={({ item }) => <ProductItem key={item?._id} product={item} />}
        />
    )
}

const ProductFrame = ({ isSlide, productList, title, onPress }) => {

    const [currentTab, setCurrentTab] = React.useState(0)

    const handleChangeTab = (index) => {

        setCurrentTab(index)
    }

    return (
        <View style={tw`mt-[10px] rounded-[12px] bg-white pb-[20px]`}>
            {
                title
                    ?
                    <View style={[tw`flex-row items-center p-[10px]`, { backgroundColor: PINK_COLOR }]}>
                        <Image style={tw`w-[20px] h-[20px]`} source={require('../../assets/images/icons/ico_dealhot.png')} />
                        <Text style={tw`ml-[6px] font-bold`}>
                            {title}
                        </Text>
                    </View>
                    :
                    <View></View>
            }
            <View style={[tw`py-[10px] flex-row border-b`, { borderColor: BORDER_COLOR }]}>
                <FlatList
                    horizontal
                    data={productList}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity key={index} onPress={() => handleChangeTab(index)}>
                            <View style={[tw`px-[10px] mx-[10px] rounded-[6px] py-[4px] border`, { borderColor: `${currentTab === index ? YELLOW_COLOR : BORDER_COLOR}`, width: 'max-content' }]}>
                                <Text style={[tw``, { color: `${currentTab === index ? YELLOW_COLOR : "#333"}` }]}>
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <View></View>
            </View>
            <View style={tw`py-[10px]`}>
                <View>
                    {
                        isSlide
                            ?
                            RenderSlideList(productList[currentTab]?.products || [])
                            :
                            RenderGridList(productList[currentTab]?.products || [])
                    }
                </View>
            </View>
            {
                title
                    ?
                    <View style={tw`mx-[35%]`}>
                        <Button title="Xem thêm" type="line" size="small" onPress={onPress} />
                    </View>
                    :
                    <View></View>
            }
        </View>
    )
}

const Loading = () => {

    return (
        <View style={tw`mt-[10px] rounded-[12px] bg-white pb-[20px]`}>
            <View style={tw`flex-row items-center p-[10px]`}>
                <Skeleton>
                    <Skeleton.Item flexDirection="row" alignItems="center">
                        <Skeleton.Item width={25} height={25} borderRadius={100} />
                        <Skeleton.Item width={200} height={16} marginLeft={10} />
                    </Skeleton.Item>
                </Skeleton>
            </View>
            <View style={[tw`p-[10px] flex-row border-b`, { borderColor: BORDER_COLOR }]}>
                <Skeleton>
                    <Skeleton.Item width={100} height={40} borderRadius={12} />
                </Skeleton>
                <View></View>
            </View>
            <View style={tw`py-[10px]`}>
                <FlatList
                    numColumns={2}
                    keyExtractor={(item) => item}
                    data={[1, 2, 3, 4]}
                    renderItem={() => (
                        <Skeleton>
                            <Skeleton.Item
                                width={168}
                                height={250}
                                borderRadius={6}
                                marginLeft={5}
                                marginBottom={10}
                                marginRight={5}
                            />
                        </Skeleton>
                    )}
                />
            </View>
            <View style={tw`mx-[35%]`}>
                <Skeleton>
                    <Skeleton.Item
                        width={100}
                        height={40}
                        borderRadius={100}
                    />
                </Skeleton>
            </View>
        </View>
    )
}

export default { ProductFrame, Loading }
