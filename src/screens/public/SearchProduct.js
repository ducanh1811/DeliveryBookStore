import { View, Text, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import tw from "twrnc"
import { PRIMARY_COLOR } from '../../styles/color.global'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5'
import { useSelector } from 'react-redux'
import SuggestItem from '../../components/SuggestItem/index'
import SearchInput from '../../components/SearchInput/index'
import { getData, setData } from '../../utils/storage'
import { HISTORY_KEY } from '../../constants/storageKey'
import { categories } from '../../constants/index'

const SearchProduct = ({ navigation }) => {

    const { keywords, suggestionProducts } = useSelector(state => state.product)
    const [historySearch, setHistorySearch] = React.useState([])
    const [isClear, setIsClear] = React.useState(false)
    const [categoryHot, setCategoryHot] = React.useState([])

    const handleBackToHome = () => {

        navigation.goBack()
    }

    const getHistory = async () => {

        let history = await getData(HISTORY_KEY)
        setHistorySearch(history)
    }

    const handleClearHistory = () => {

        setData(HISTORY_KEY, [])
        setIsClear(prev => !prev)
    }

    const handleRemoveHistoryItem = (item) => {

        const newHistory = historySearch.filter(history => history !== item)

        setData(HISTORY_KEY, newHistory)
        setHistorySearch(newHistory)
    }

    const handleSearch = (item) => {

        navigation.navigate("Product", { keywords: item, categoryId: null })
    }

    const handleRandom = () => {

        var randomItems = [];
        var arrayCopy = categories.slice()

        for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor(Math.random() * arrayCopy.length)
            var randomItem = arrayCopy[randomIndex]
            randomItems.push(randomItem)
            arrayCopy.splice(randomIndex, 1)
        }

        setCategoryHot(randomItems)
    }

    React.useEffect(() => {

        getHistory()
    }, [isClear, keywords])

    React.useEffect(() => {

        handleRandom()
    }, [])

    return (
        <View style={tw`mt-[${StatusBar.currentHeight}px]`}>
            <View style={[tw`pt-[20px] pb-[10px] px-[20px] flex-row items-center gap-[20px]`, { backgroundColor: PRIMARY_COLOR }]}>
                <TouchableOpacity onPress={handleBackToHome}>
                    <IconFontAwesome
                        name="arrow-left"
                        size={16}
                        color="#fff"
                    />
                </TouchableOpacity>
                <SearchInput isSearch navigation={navigation} />
            </View>
            <View style={tw`px-[20px]`}>
                {
                    keywords
                        ?
                        <View style={tw`pt-[20px] pb-[40px]`}>
                            <View style={tw`flex-row items-center`}>
                                <Text style={tw`text-[16px] font-bold flex-1 text-[#333]`}>Gợi ý</Text>

                            </View>
                            {
                                suggestionProducts.length > 0
                                    ?
                                    <FlatList
                                        data={suggestionProducts}
                                        renderItem={({ item }) => (
                                            <SuggestItem product={item} />
                                        )}
                                        keyExtractor={item => item._id}
                                    />
                                    :
                                    <Text style={tw`mt-[10px]`}>Không tìm thấy kết quả phù hợp</Text>
                            }
                        </View>
                        :
                        <View style={tw`pt-[20px]`}>
                            {
                                historySearch?.length > 0
                                    ?
                                    <>
                                        <View style={tw`flex-row items-center`}>
                                            <Text style={tw`text-[16px] font-bold flex-1 text-[#333]`}>Tìm kiếm gần đây</Text>
                                            <TouchableOpacity onPress={handleClearHistory}>
                                                <IconFontAwesome
                                                    name="trash"
                                                    size={16}
                                                    color="#999"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            historySearch?.map(history => (
                                                <View
                                                    key={history}
                                                    style={tw`flex-row items-center py-[14px] border-b border-[#C8C2C2]`}
                                                >
                                                    <IconFontAwesome
                                                        name="clock"
                                                        size={16}
                                                        color="#999"
                                                    />
                                                    <TouchableOpacity style={tw`flex-1`} onPress={() => handleSearch(history)}>
                                                        <Text style={tw`ml-[10px] text-[#666]`}>
                                                            {history}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => handleRemoveHistoryItem(history)}>
                                                        <Text>X</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))
                                        }
                                    </>
                                    :
                                    <View></View>
                            }
                            <View style={tw`flex-row items-center mt-[20px]`}>
                                <Text style={tw`text-[16px] font-bold flex-1 text-[#333]`}>
                                    Danh mục nổi bật
                                </Text>
                                <TouchableOpacity onPress={handleRandom} style={tw`flex-row items-center gap-[6px]`}>
                                    <Text>Thay đổi</Text>
                                    <IconFontAwesome
                                        name="retweet"
                                        size={16}
                                        color="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                            {
                                categoryHot.map(category => (
                                    <View key={category.title} style={tw`flex-row items-center py-[8px] border-b border-[#C8C2C2]`}>
                                        <Image source={{ uri: category.image }} style={tw`w-[40px] h-[50px]`} />
                                        <Text style={tw`text-[#333] ml-[10px]`}>
                                            {category.title}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>
                }
            </View>
        </View>
    )
}

export default SearchProduct