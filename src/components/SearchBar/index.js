import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5'
import Skeleton from "@thevsstech/react-native-skeleton"
import SearchInput from '../SearchInput/index'

const SearchBar = ({ scrollPosition, navigation }) => {

    const handleToSearchProduct = () => {

        navigation.navigate("SearchProduct")
    }

    const handleToCategory = () => {

        navigation.push("Categories")
    }

    return (
        <View style={[styles.container, tw`w-full z-10 justify-center p-[10px] items-center ${scrollPosition > 0 ? "bg-[#C92127]" : "bg-transparent"}`]}>
            <Image
                source={require('../../assets/images/logos/TA.png')}
                style={[tw`w-[60%] h-[40px] ${scrollPosition > 0 ? 'hidden' : ''}`, { objectFit: 'contain' }]}
            />
            <View style={tw`flex-row gap-[20px] px-[10px] my-[10px] w-full items-center`}>
                <TouchableOpacity onPress={handleToCategory}>
                    <IconFontAwesome
                        name="bars"
                        size={30}
                        color="#999"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex-1`} onPress={handleToSearchProduct}>
                    <SearchInput />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    }
})

const Loading = () => {

    return (
        <View style={tw`items-center py-[20px]`}>
            <Skeleton>
                <Skeleton.Item width={100} height={40} borderRadius={6} marginBottom={10} />
                <Skeleton.Item width={320} height={40} borderRadius={100} />
            </Skeleton>
        </View>
    )
}

export default { SearchBar, Loading }