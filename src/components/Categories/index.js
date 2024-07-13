import { View, Text, FlatList } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import CategoryItem from './CategoryItem'
import { categories } from '../../constants/index'
import Skeleton from "@thevsstech/react-native-skeleton"

const Categories = () => {
    return (
        <View style={tw`bg-white py-[20px] rounded-[12px]`}>
            <FlatList
                horizontal={true}
                pagingEnabled
                keyExtractor={(item) => item.id}
                data={categories}
                renderItem={({ item }) => <CategoryItem category={item} />}
            />
        </View>
    )
}

const Loading = () => {

    return (
        <View style={tw`bg-white py-[20px] rounded-[12px]`}>
            <FlatList
                horizontal={true}
                keyExtractor={(item) => item}
                data={[1, 2, 3, 4]}
                renderItem={() => (
                    <View >
                        <Skeleton>
                            <Skeleton.Item width={80} height={150} borderRadius={12} marginLeft={10} />
                        </Skeleton>
                    </View>
                )}
            />
        </View>
    )
}

export default { Categories, Loading }