import { View, StatusBar, FlatList } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import tw from 'twrnc'
import HomeHero from '../../components/HomeHero/index'
import Swiper from 'react-native-swiper'
import { YELLOW_COLOR } from '../../styles/color.global'
import Categories from '../../components/Categories/index'
import ProductFrame from '../../components/ProductFrame/index'
import { listPathCategory, listPathHots, listPathLearn } from '../../constants/index'
import { apiGetProductCategory, apiGetProductHots } from '../../apis/data'
import { getLearnBooks, getProductCategory, getProductHots } from '../../stores/dataSlice'
import SearchBar from '../../components/SearchBar/index'
import ScrollToTop from '../../components/ScrollToTop/index'
import notifee from '@notifee/react-native';
import Button from '../../components/Button'
import { useNotification } from '../../hooks/useNotification'
import { useLinkTo } from '@react-navigation/native'

const Home = ({ navigation }) => {

    const linkTo = useLinkTo()
    const flatListRef = React.useRef()
    const { loading, productsHots, categoryBooks, slideList, learnBooks } = useSelector(state => state.data)
    const [scrollPosition, setScrollPosition] = React.useState(0)
    const dispatch = useDispatch()
    const { displayNotification } = useNotification()

    const fetchData = async () => {

        listPathHots.forEach(async (item, index) => {

            if (index !== 0) {
                const response = await apiGetProductHots(item.path)

                if (response.status === 200) {
                    dispatch(getProductHots({
                        title: item.title,
                        products: response.data.data
                    }))
                }
            }
        })

        listPathCategory.forEach(async (item, index) => {

            if (index !== 0) {
                const response = await apiGetProductCategory(item.path)

                if (response.status === 200) {
                    dispatch(getProductCategory({
                        title: item.title,
                        products: response.data.data
                    }))
                }
            }
        })

        listPathLearn.forEach(async (item, index) => {

            if (index !== 0) {

                const response = await apiGetProductCategory(item.path)

                if (response.status === 200) {
                    dispatch(getLearnBooks({
                        title: item.title,
                        products: response.data.data
                    }))
                }
            }
        })
    }

    React.useEffect(() => {

        if (!loading) {
            fetchData()
        }
    }, [loading])

    const handleScroll = (event) => {

        const { contentOffset } = event.nativeEvent
        const currentScrollPosition = contentOffset.y

        setScrollPosition(currentScrollPosition)
    }

    const handleToProduct = () => {
        navigation.navigate("Product", { keywords: null, categoryId: null })
    }

    const handleToCategoryProduct = (categoryId) => {
        navigation.navigate("Product", { keywords: null, categoryId: categoryId })
    }

    const onDisplayNotification = async () => {

        displayNotification({
            title: 'Thông báo đơn hàng',
            description: 'Đơn hàng của bạn đã được giao thành công!',
            image: 'https://www.advotics.com/wp-content/uploads/2022/02/surat-jalan-01-1-4-1536x984.png',
            //largeImage: 'https://salt.tikicdn.com/ts/product/69/2c/57/9d96bec7a87b33daf7fae7a717f2058c.jpg'
        })
        // linkTo('/product-detail/65646a7d1d2b3aa954b7d9d5')
    }

    return (
        <View style={tw`mt-[${StatusBar.currentHeight}px]`}>
            {
                loading
                    ?
                    <HomeLoading />
                    :
                    <>
                        <SearchBar.SearchBar navigation={navigation} scrollPosition={scrollPosition} />

                        <FlatList
                            ref={flatListRef}
                            onScroll={handleScroll}
                            data={[1]}
                            keyExtractor={(item) => item}
                            renderItem={() => (
                                <>
                                    <Swiper
                                        loop
                                        autoplay
                                        height={270}
                                        activeDotColor={YELLOW_COLOR}
                                    >
                                        {
                                            slideList.map(slide => (
                                                <HomeHero.HomeHero key={slide._id} slide={slide} />
                                            ))
                                        }
                                    </Swiper>
                                    <View >
                                        <Categories.Categories />
                                        <ProductFrame.ProductFrame
                                            title="Sản phẩm được quan tâm"
                                            productList={productsHots}
                                            onPress={handleToProduct}
                                        />
                                        <ProductFrame.ProductFrame
                                            title="Danh mục nổi bật"
                                            productList={categoryBooks}
                                            isSlide={true}
                                            onPress={handleToProduct}
                                        />
                                        <ProductFrame.ProductFrame
                                            title="Đồ dùng học tập"
                                            productList={learnBooks}
                                            onPress={handleToProduct}
                                        />
                                    </View>
                                </>
                            )}
                        />
                    </>
            }
        </View>
    )
}

const HomeLoading = () => {

    return (
        <View style={tw`items-center justify-center`}>
            <SearchBar.Loading />

            <FlatList
                data={[1]}
                keyExtractor={(item) => item}
                renderItem={() => (
                    <>
                        <HomeHero.Loading />
                        <View style={tw`justify-center`}>
                            <Categories.Loading />
                            <ProductFrame.Loading />
                            <ProductFrame.Loading />
                        </View>
                    </>
                )}
            />
        </View>
    )
}

export default Home