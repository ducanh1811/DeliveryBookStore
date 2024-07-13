import { View, Text, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5'
import useDebounce from '../../hooks/useDebounce'
import { useDispatch } from 'react-redux'
import { search } from '../../stores/productSlice'
import { apiSearchProduct } from '../../apis/product'
import { getData, setData } from '../../utils/storage'
import { HISTORY_KEY } from '../../constants/storageKey'

const SearchInput = ({ isSearch, navigation, searchText }) => {

    const [keywords, setKeywords] = React.useState()
    const dispatch = useDispatch()

    const keywordDebounce = useDebounce(keywords, 400)

    const getSuggesttionProducts = async (keywords) => {

        const response = await apiSearchProduct(keywords)

        if (response.status === 200) {
            dispatch(search({
                suggestionProducts: response.data.data.products,
                keywords: keywords
            }))
        }
    }

    React.useEffect(() => {

        if (keywords) {

            getSuggesttionProducts(keywordDebounce)
        } else {

            dispatch(search({
                keywords: null,
                suggestionProducts: []
            }))
        }

    }, [keywordDebounce])

    const handleSubmit = async () => {

        if (keywordDebounce) {

            const historySearch = await getData("history")

            if (historySearch) {

                const index = historySearch.findIndex(h => h === keywordDebounce)

                if (index === -1) {

                    historySearch.push(keywordDebounce)
                    setData(HISTORY_KEY, historySearch)
                }
            } else {

                setData(HISTORY_KEY, [keywordDebounce])
            }
            navigation.navigate("Product", { keywords: keywordDebounce, categoryId: null })
        }
    }

    return (
        <View style={tw`flex-row flex-1 items-center bg-white px-[10px] py-[4px] rounded-[6px] border border-[#999]`}>
            <IconFontAwesome
                name="search"
                size={18}
                color="#999"
            />
            {
                isSearch
                    ?
                    <TextInput
                        placeholder='Nhập để tìm kiếm...'
                        style={tw`text-[#333] flex-1 py-[0] ml-[10px]`}
                        autoFocus={true}
                        value={keywords}
                        onChangeText={setKeywords}
                        onSubmitEditing={handleSubmit}
                    />
                    :
                    <Text style={tw`text-[#999] ml-[10px] py-[4px]`}>
                        {searchText ? searchText : "Nhập để tìm kiếm..."}
                    </Text>
            }
        </View>
    )
}

export default SearchInput