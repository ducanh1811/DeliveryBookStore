import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import { YELLOW_COLOR } from '../../styles/color.global'
import Skeleton from "@thevsstech/react-native-skeleton"

const HomeHero = ({ slide }) => {

    return (
        <View style={tw`w-full items-center`} >
            <View style={tw`w-full h-[160px] z-2 items-center`}>
                <Image
                    blurRadius={60}
                    style={[tw`w-[134%] h-[200px]`]}
                    source={{ uri: slide.images }}
                />
                <View style={[tw`rounded-[24px] flex-row items-center p-[20px] h-[140px] mx-[20px] mt-[32%] bg-white`, StyleSheet.absoluteFillObject]}>
                    <View style={tw`flex-1`}>
                        <Text
                            numberOfLines={3}
                            style={[tw`font-bold`, { color: YELLOW_COLOR }]}
                        >
                            {slide.title}
                        </Text>
                        <TouchableOpacity>
                            <View style={[tw`w-[90px] flex-row items-center px-[10px] mt-[10px] rounded-[12px] py-[6px] border`, { borderColor: YELLOW_COLOR }]}>
                                <Text style={[tw`font-bold mr-[8px] text-[12px]`, { color: YELLOW_COLOR }]}>
                                    Xem thêm
                                </Text>
                                <IconFontAwesome
                                    name="arrow-right"
                                    size={12}
                                    color={YELLOW_COLOR}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Image
                        style={[tw`w-[50%] h-[100px]`, { objectFit: 'contain' }]}
                        source={{ uri: slide.images }}
                    />
                </View>
            </View>
        </View >
    )
}

const Loading = () => {

    return (
        <View style={tw`w-full items-center`} >
            <View style={tw`w-full h-[160px] z-2 items-center`}>
                <Skeleton>
                    <Skeleton.Item width={320} height={140} borderRadius={24} />
                </Skeleton>
            </View>
        </View >
    )
}

export default { HomeHero, Loading }