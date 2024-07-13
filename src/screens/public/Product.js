import { View, Text, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, ScrollView, Modal } from 'react-native'
import React from 'react'
import { BORDER_COLOR, PRIMARY_COLOR, YELLOW_COLOR } from '../../styles/color.global'
import SearchInput from '../../components/SearchInput/index'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5'
import tw from 'twrnc'
import { apiGetProduct } from '../../apis/product'
import ProductItem from '../../components/ProductItem/index'
import Skeleton from "@thevsstech/react-native-skeleton"
import { useSelector } from 'react-redux'
import { Rating } from 'react-native-ratings'
import CheckBox from 'react-native-check-box'
import Button from '../../components/Button/index'

const listSort = [
    {
        name: 'Giá thấp nhấp',
        filter: 'price',
        sort: 'asc'
    },
    {
        name: 'Giá cao nhất',
        filter: 'price',
        sort: 'desc'
    },
    {
        name: 'Bán chạy nhất',
        filter: 'sold',
        sort: 'desc'
    },
    {
        name: 'Đánh giá cao nhất',
        filter: 'rate',
        sort: 'desc'
    },
]

const listTabFilter = [
    {
        name: 'Danh mục',
        icon: 'chevron-down',
        isFilter: false
    },
    {
        name: 'Sắp xếp',
        icon: 'chevron-down',
        isFilter: false
    },
    {
        name: 'Lọc',
        icon: 'filter',
        isFilter: true
    }
]

const priceOptions = [
    {
        label: "0đ - 150K",
        valueMin: 0,
        valueMax: 150000
    },
    {
        label: "150K - 300K",
        valueMin: 150000,
        valueMax: 300000
    },
    {
        label: "300K - 500K",
        valueMin: 300000,
        valueMax: 500000
    },
    {
        label: "500K - 700K",
        valueMin: 500000,
        valueMax: 700000
    },
    {
        label: "700K - Trở lên",
        valueMin: 700000
    }
]

const Product = ({ navigation, route }) => {

    const { categories } = useSelector(state => state.data)
    const [products, setProducts] = React.useState([])
    const { keywords, categoryId } = route.params
    const [loadingContinue, setLoadingContinue] = React.useState(false)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [currentSort, setCurrentSort] = React.useState(null)
    const [currentTabFilter, setCurrentTabFilter] = React.useState(null)
    const [tabChild, setTabChild] = React.useState([false, false, false, false, false, false, false, false, false, false])
    const [currentCategory, setCurrentCategory] = React.useState(categoryId)
    const [rate, setRate] = React.useState(null)
    const [price, setPrice] = React.useState(null)
    const [filter, setFilter] = React.useState(false)

    const handleTogge = (index) => {

        const newList = tabChild.map((tab, tabIndex) => {

            if (index === tabIndex) {
                return tab ? false : true
            } else return tab
        })

        setTabChild(newList)
    }

    const handleBackToHome = () => {

        navigation.navigate("TabBottom")
    }

    const handleToSearch = () => {

        navigation.navigate("SearchProduct")
    }

    const fetchProduct = async () => {

        let params = {
            page: currentPage,
            perPage: 10
        }

        if (keywords) params.title = keywords
        if (currentCategory) params.category = currentCategory
        if (rate) params.rate = rate
        if (rate) params.rate = rate
        if (price) {
            params.minPrice = price.valueMin
            params.maxPrice = price.valueMax
        }
        if (currentSort !== null) {
            console.log('vô')
            params.sort = listSort[currentSort].sort
            params.filter = listSort[currentSort].filter
        }

        if (currentPage === 1) {
            setLoading(true)
        }

        const response = await apiGetProduct(params)
        setLoading(false)
        setLoadingContinue(false)

        if (response.status == 200) {

            if (currentPage === 1) {
                setProducts(response.data.data.products)
            } else {

                setProducts(prev => {

                    return [...prev, ...response.data.data.products]
                })
            }
        }
    }

    React.useEffect(() => {

        fetchProduct()
    }, [keywords, currentPage, currentSort, currentCategory, filter])

    React.useEffect(() => {

        setCurrentPage(1)

    }, [currentSort, currentCategory, filter, keywords])

    const handleEndReached = () => {

        setLoadingContinue(true)
        setCurrentPage(prev => prev += 1)
    }

    const handleChooseFilter = (index) => {

        setCurrentTabFilter(prev => prev === index ? null : index)
    }

    React.useEffect(() => {

        if (currentCategory) {

            const findIndex = categories.findIndex(c => c.categories.some(child => child?._id == currentCategory))

            console.log("findIndex: ", findIndex)
            if (findIndex !== -1) {

                handleTogge(findIndex)
            }
        }
    }, [])

    const handleClearFilter = () => {

        setPrice(null)
        setRate(null)
        setCurrentTabFilter(null)
        setFilter(prev => !prev)
    }

    const handleFilter = () => {

        setFilter(prev => !prev)
        setCurrentTabFilter(null)
    }

    return (
        <View style={tw`mt-[${StatusBar.currentHeight}px]`}>
            <View style={[tw`pt-[20px] pb-[10px] h-[66px] px-[20px] flex-row items-center gap-[20px]`, { backgroundColor: PRIMARY_COLOR }]}>
                <TouchableOpacity onPress={handleBackToHome}>
                    <IconFontAwesome
                        name='chevron-left'
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex-1`} onPress={handleToSearch}>
                    <SearchInput searchText={keywords} />
                </TouchableOpacity>
            </View>
            <View>
                <View style={tw`relative flex-row z-1000 justify-between py-[10px] px-[40px] mb-[10px] bg-white`}>
                    {
                        listTabFilter.map((filter, index) => (
                            <TouchableOpacity onPress={() => handleChooseFilter(index)} key={filter.name} style={tw`flex-row items-center`}>
                                <Text style={tw`${currentTabFilter === index ? "text-[#f7941e]" : "text-[#333]"} mr-[4px]`}>{filter.name}</Text>
                                <IconFontAwesome
                                    name={!filter.isFilter ? currentTabFilter === index ? "chevron-up" : "chevron-down" : filter.icon}
                                    size={14}
                                    color={currentTabFilter === index ? YELLOW_COLOR : "#666"}
                                />
                            </TouchableOpacity>
                        ))
                    }

                </View>
                <Modal visible={currentTabFilter !== null} transparent={true}>
                    <View style={[tw`flex-1`, style.modal]}>
                        <View style={[tw`pt-[20px] pb-[10px] h-[66px] px-[20px] flex-row items-center gap-[20px]`, { backgroundColor: PRIMARY_COLOR }]}>
                            <TouchableOpacity onPress={handleBackToHome}>
                                <IconFontAwesome
                                    name='chevron-left'
                                    size={20}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`flex-1`} onPress={handleToSearch}>
                                <SearchInput searchText={keywords} />
                            </TouchableOpacity>
                        </View>
                        <View style={tw`relative flex-row z-1000 justify-between py-[10px] px-[40px] mb-[2px] bg-white`}>
                            {
                                listTabFilter.map((filter, index) => (
                                    <TouchableOpacity onPress={() => handleChooseFilter(index)} key={filter.name} style={tw`flex-row items-center`}>
                                        <Text style={tw`${currentTabFilter === index ? "text-[#f7941e]" : "text-[#333]"} mr-[4px]`}>{filter.name}</Text>
                                        <IconFontAwesome
                                            name={!filter.isFilter ? currentTabFilter === index ? "chevron-up" : "chevron-down" : filter.icon}
                                            size={14}
                                            color={currentTabFilter === index ? YELLOW_COLOR : "#666"}
                                        />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        {
                            currentTabFilter === 0
                            &&
                            <ScrollView style={tw`bg-white max-h-[360px] pb-[20px]`}>
                                <View style={tw`flex-1`}>
                                    <TouchableOpacity
                                        onPress={() => { setCurrentCategory(null); setCurrentTabFilter(null) }}
                                        style={tw`flex-row items-center justify-between px-[10px] py-[14px]`}
                                    >
                                        <Text style={tw`${currentCategory === null ? "text-[#f7941e]" : "text-[#333]"} font-bold`}>
                                            Tất cả danh mục
                                        </Text>
                                        {
                                            currentCategory === null
                                            &&
                                            <IconFontAwesome
                                                name="check"
                                                size={14}
                                                color={YELLOW_COLOR}
                                            />
                                        }
                                    </TouchableOpacity>
                                    {
                                        categories?.map((category, index) => (
                                            <View
                                                key={category._id}
                                                style={tw`px-[10px] py-[14px] bg-white ml-[4px] mb-[4px]`}>
                                                <TouchableOpacity onPress={() => handleTogge(index)} style={tw`flex-row items-center justify-between`}>
                                                    <Text style={tw`${tabChild[index] ? 'text-[#C92127]' : 'text-[#333]'} font-bold`}>
                                                        {category._id}
                                                    </Text>
                                                    <IconFontAwesome
                                                        name={tabChild[index] ? "chevron-up" : "chevron-down"}
                                                        size={14}
                                                        color={tabChild[index] ? PRIMARY_COLOR : "#333"}
                                                    />
                                                </TouchableOpacity>
                                                {
                                                    tabChild[index] &&
                                                    <>
                                                        {
                                                            category?.categories?.map((child, index) => (
                                                                child
                                                                    ?
                                                                    <TouchableOpacity onPress={() => { setCurrentCategory(child._id); setCurrentTabFilter(null) }} key={child._id} style={tw`flex-row items-center justify-between border-b border-[${BORDER_COLOR}] py-[14px] bg-white ml-[4px] mb-[4px]`}>
                                                                        <Text style={tw`${child._id == currentCategory ? "text-[#f7941e]" : "text-[#333]"}`}>
                                                                            {child.name}
                                                                        </Text>
                                                                        {
                                                                            child._id == currentCategory
                                                                            &&
                                                                            <IconFontAwesome
                                                                                name="check"
                                                                                size={14}
                                                                                color={YELLOW_COLOR}
                                                                            />
                                                                        }
                                                                    </TouchableOpacity>
                                                                    :
                                                                    <View key={index}></View>
                                                            ))
                                                        }
                                                    </>
                                                }
                                            </View>
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        }
                        {
                            currentTabFilter === 1
                            &&
                            <View style={tw`bg-white`}>
                                <TouchableOpacity
                                    onPress={() => { setCurrentSort(null); setCurrentTabFilter(null) }}
                                    style={tw`flex-row items-center justify-between px-[20px] py-[12px] border-b border-[${BORDER_COLOR}]`}
                                >
                                    <Text style={tw`${currentSort === null ? "text-[#f7941e]" : "text-[#333]"}`}>
                                        Mặc định
                                    </Text>
                                    {
                                        currentSort === null ?
                                            <IconFontAwesome
                                                name='check'
                                                size={14}
                                                color="#f7941e"
                                            />
                                            : <></>
                                    }
                                </TouchableOpacity>
                                {
                                    listSort.map((item, index) => (
                                        <TouchableOpacity
                                            onPress={() => { setCurrentSort(index); setCurrentTabFilter(null) }}
                                            style={tw`flex-row items-center justify-between px-[20px] py-[12px] border-b border-[${BORDER_COLOR}]`}
                                            key={item.name}
                                        >
                                            <Text style={tw`${currentSort === index ? "text-[#f7941e]" : "text-[#333]"}`}>
                                                {item.name}
                                            </Text>
                                            {
                                                currentSort === index ?
                                                    <IconFontAwesome
                                                        name='check'
                                                        size={14}
                                                        color="#f7941e"
                                                    />
                                                    : <></>
                                            }
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>

                        }
                        {
                            currentTabFilter === 2
                            &&
                            <View style={tw`bg-white px-[10px] py-[20px]`}>
                                <View style={tw`border-b border-[${BORDER_COLOR}]`}>
                                    <Text style={tw`text-[#333] font-bold`}>Giá</Text>
                                    <View style={tw`py-[10px] flex-row gap-[5px] flex-wrap`}>
                                        {
                                            priceOptions.map(option => (
                                                <TouchableOpacity
                                                    onPress={() => setPrice(option)}
                                                    key={option.label}
                                                    style={tw`w-[110px] border ${option.valueMin === price?.valueMin ? `border-[${YELLOW_COLOR}] bg-white` : 'border-transparent bg-[#eee]'} items-center rounded-[6px] p-[10px]`}>
                                                    <Text style={tw`${option.valueMin === price?.valueMin ? 'text-[#f7941e]' : 'text-[#333]'}`}>{option.label}</Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                                </View>
                                <View style={tw`border-b border-[${BORDER_COLOR}] pt-[10px]`}>
                                    <Text style={tw`text-[#333] font-bold`}>Đánh giá</Text>
                                    <View style={tw`py-[10px] gap-[10px]`}>
                                        {
                                            [1, 2, 3, 4, 5].map(rateValue => (
                                                <View key={rateValue} style={tw`flex-row items-center gap-[10px]`}>
                                                    <CheckBox
                                                        isChecked={rateValue === rate}
                                                        checkBoxColor="#999"
                                                        checkedCheckBoxColor={YELLOW_COLOR}
                                                        onClick={() => setRate(rateValue)}
                                                    />
                                                    <Rating imageSize={20} startingValue={rateValue} readonly />
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                                <View style={tw`mt-[20px] mx-[20px] flex-row justify-between`}>
                                    <Button type='line' title="Xóa bộ lọc" onPress={handleClearFilter} />
                                    <Button type='linear' title="Lọc" onPress={handleFilter} />
                                </View>
                            </View>
                        }
                    </View>
                </Modal>
                {
                    loading
                        ?
                        <Loading />
                        :
                        <FlatList
                            keyExtractor={(p) => p}
                            data={[1]}
                            renderItem={() => (
                                <View style={tw`pb-[260px] z-1`}>
                                    {
                                        products.length > 0
                                            ?
                                            <FlatList
                                                numColumns={2}
                                                keyExtractor={(p, index) => index}
                                                data={products}
                                                renderItem={({ item }) => <ProductItem product={item} />}
                                                onEndReached={handleEndReached}
                                                onEndReachedThreshold={0}
                                            />
                                            :
                                            <View style={tw`flex-1 items-center justify-center h-[500px]`}>
                                                <View style={tw`items-center justify-center p-[10px] border border-[${YELLOW_COLOR}] rounded-[6px] bg-white`}>
                                                    <Text style={tw`font-bold text-[#f7941e]`}>Không tìm thấy sản phẩm phù hợp</Text>
                                                </View>
                                            </View>
                                    }
                                    {
                                        loadingContinue
                                            ?
                                            <ActivityIndicator size="large" color="#C92127" />
                                            :
                                            <Text></Text>
                                    }
                                </View>
                            )}
                        />
                }
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
})

const Loading = () => {

    return (
        <View style={tw`py-[10px]`}>
            <FlatList
                numColumns={2}
                keyExtractor={(item) => item}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
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
    )
}

export default Product