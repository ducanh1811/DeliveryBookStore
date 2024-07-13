import { View, StatusBar, TouchableOpacity, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { BORDER_COLOR, PRIMARY_COLOR, YELLOW_COLOR } from '../../styles/color.global'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5'
import { apiGetProductByCategory, apiGetProductById, apiGetProductComment, apiGetProductRate } from '../../apis/product'
import { Rating } from 'react-native-ratings'
import numeral from 'numeral'
import { useSelector, useDispatch } from 'react-redux'
import ProductFrame, { RenderSlideList } from '../../components/ProductFrame/index'
import Skeleton from "@thevsstech/react-native-skeleton"
import ProductInfo from '../../components/ProductInfo/index'
import CommentInfo from '../../components/CommentInfo/index'
import AddProductToCartBar from '../../components/AddProductToCartBar/index'
import Toast from 'react-native-toast-message'
import { add } from '../../stores/cartSlice'
import Dialog from "react-native-dialog"
import { apiAddFavorite } from '../../apis/data'
import { updateFavorites } from '../../stores/dataSlice'

const ProductDetail = ({ route, navigation }) => {

    const useRef = React.useRef()
    const { productId } = route.params
    const { productsHots, favorites } = useSelector(state => state.data)
    const { user, isLoggedIn, token } = useSelector(state => state.user)
    const { data } = useSelector(state => state.cart)
    const [cartData, setCartData] = React.useState([])
    const dispatch = useDispatch()
    const [product, setProduct] = React.useState()
    const [rate, setRate] = React.useState()
    const [loading, setLoading] = React.useState(true)
    const [productCategory, setProductCategory] = React.useState([])
    const [comments, setComments] = React.useState([])
    const [quantity, setQuantity] = React.useState(1)
    const [showDialog, setShowDialog] = React.useState(false)
    const [isAddFavorite, setIsAddFavorite] = React.useState(false)

    const checkIndex = () => {

        if (cartData) {
            const index = cartData.findIndex((item) => item.product._id === product._id)

            if (index !== -1) {
                if ((quantity + cartData[index].quantity) > product.quantity) {

                    return false
                }
            }
            return true
        } else {
            return true
        }
    }

    React.useEffect(() => {

        setCartData(data[user?._id])
    }, [data])

    const handleGoBack = () => {

        navigation.goBack()
    }

    const handleToSearchProduct = () => {

        navigation.navigate("SearchProduct")
    }

    const handleToHome = () => {

        navigation.navigate("TabBottom")
    }

    const handleToCart = () => {

        navigation.navigate("Cart", { single: true })
    }

    const handleToTop = () => {
        useRef.current.scrollToOffset({ animated: true, offset: 0 })
    }

    const handleMinus = () => {

        setQuantity(prev => prev !== 1 ? prev - 1 : 1)
    }

    const handlePlus = () => {

        if (product?.quantity !== 0) {

            if (product?.quantity > quantity) {

                setQuantity(prev => prev + 1)
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Số lượng sản phẩm trong kho không đủ!'
                })
            }
        } else {
            Toast.show({
                type: 'info',
                text1: 'Sản phẩm hiện đã hết hàng!'
            })
        }
    }

    const handleAddToCart = () => {

        if (isLoggedIn) {

            if (product?.quantity !== 0) {

                if (product?.quantity >= quantity && checkIndex()) {

                    dispatch(add({
                        data: {
                            product,
                            quantity
                        },
                        userId: user?._id
                    }))
                    Toast.show({
                        type: 'success',
                        text1: 'Thêm vào giỏ hàng thành công!'
                    })
                } else {
                    Toast.show({
                        type: 'info',
                        text1: 'Số lượng sản phẩm trong kho không đủ!'
                    })
                }
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Sản phẩm hiện đã hết hàng!'
                })
            }
        } else {
            setShowDialog(true)
        }
    }

    const fetchProduct = async (id) => {

        setLoading(true)
        const response = await apiGetProductById(id)

        if (response.status === 200) {

            setProduct(response.data.data)
        }
    }

    const fetchProductCategory = async (categoryId, categoryName) => {

        const response = await apiGetProductByCategory(categoryId)
        setLoading(false)

        if (response.status === 200) {

            setProductCategory(response.data.data)
        }
    }

    const fetchRate = async (id) => {

        const response = await apiGetProductRate(id)

        if (response.status === 200) {

            setRate(response.data.data)
        }
    }

    const fetchCommentList = async (id) => {

        const response = await apiGetProductComment(id)

        if (response.status === 200) {

            setComments(response.data.data)
        }
    }

    const onCancel = () => {

        setShowDialog(false)
    }

    const onLogin = () => {

        navigation.navigate('Login')
    }

    const checkFavorite = () => {

        const index = favorites?.findIndex(favorites => favorites.productid._id === productId)

        return index !== -1
    }

    const handleAddToMyFavorites = async () => {

        if (!checkFavorite()) {

            setIsAddFavorite(true)
            const response = await apiAddFavorite(token, {
                productid: productId,
                userid: user?._id
            })
            setIsAddFavorite(false)

            if (response.status === 200) {

                dispatch(updateFavorites(response.data.data))
                Toast.show({
                    type: 'success',
                    text1: 'Sản phẩm đã được thêm vào danh sách yêu thích'
                })
            }
        }
    }

    React.useEffect(() => {

        handleToTop()
        fetchProduct(productId)
        fetchRate(productId)
        fetchCommentList(productId)
        setQuantity(1)
    }, [productId])

    React.useEffect(() => {

        if (product) {
            fetchProductCategory(product?.categoryId?._id, product?.categoryId?.name)
        }
    }, [product])

    return (
        <View style={tw`relative mb-[50px] h-[100%]`}>
            <Dialog.Container visible={showDialog}>
                <Dialog.Title>Thông báo</Dialog.Title>
                <Dialog.Description>
                    Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!
                </Dialog.Description>
                <Dialog.Button label="Hủy" color="#666" bold={true} onPress={onCancel} />
                <Dialog.Button label="Đăng nhập" color={PRIMARY_COLOR} bold={true} onPress={onLogin} />
            </Dialog.Container>
            {
                isAddFavorite &&
                <ActivityIndicator
                    size="large"
                    color={PRIMARY_COLOR}
                    style={tw`absolute z-10000 bg-white mt-[80px] top-0 bottom-0 left-0 right-0 opacity-50`}
                />
            }
            <View style={[tw`w-full px-[20px] flex-row h-[50px] items-center mt-[${StatusBar.currentHeight}px]`, { backgroundColor: PRIMARY_COLOR }]}>
                <TouchableOpacity style={tw`flex-1`} onPress={handleGoBack}>
                    <IconFontAwesome
                        name="arrow-left"
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
                <View style={tw`flex-row items-center gap-[30px]`}>
                    <TouchableOpacity onPress={handleToSearchProduct}>
                        <IconFontAwesome
                            name="search"
                            size={20}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToHome} >
                        <IconFontAwesome
                            name="home"
                            size={20}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToCart}>
                        <IconFontAwesome
                            name="cart-plus"
                            size={20}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                ref={useRef}
                keyExtractor={(item) => item}
                data={[0]}
                renderItem={() => (
                    <>
                        {
                            loading
                                ?
                                <Loading />
                                :
                                <View style={tw`w-full pb-[10px]`}>
                                    <View style={tw`bg-white py-[10px] px-[14%]`}>
                                        {
                                            product?.images &&
                                            <Image
                                                style={[tw`w-full h-[300px] bg-white`, styles.image]}
                                                source={{ uri: product?.images }}
                                            />
                                        }
                                    </View>
                                    <View style={tw`bg-white py-[10px] px-[16px]`}>
                                        <Text style={tw`text-[#333] text-[16px]`}>
                                            {product?.title}
                                        </Text>
                                        <View style={tw`items-center flex-row my-[6px]`}>
                                            <View style={tw`items-center flex-row flex-1`}>
                                                <Rating imageSize={15} startingValue={product?.rate} readonly />
                                                <Text style={tw`ml-[10px] pr-[10px] text-[${YELLOW_COLOR}] border-r border-[${BORDER_COLOR}]`}>
                                                    ({rate?.total} đánh giá)
                                                </Text>
                                                <Text style={tw`pl-[10px]`}>
                                                    Đã bán {product?.sold}
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={handleAddToMyFavorites} style={tw`mr-[20px]`}>
                                                <IconFontAwesome
                                                    name="heart"
                                                    size={20}
                                                    color={YELLOW_COLOR}
                                                    solid={checkFavorite()}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={tw`items-center flex-row my-[6px]`}>
                                            <Text style={[tw`font-bold text-[20px]`, { color: PRIMARY_COLOR }]}>
                                                {numeral(product?.price).format('0,0')} đ
                                            </Text>
                                            <Text style={[tw`text-[14px] mx-[10px]`, { textDecorationLine: 'line-through', textDecorationStyle: 'solid' }]}>
                                                {numeral(product?.old_price).format('0,0')} đ
                                            </Text>
                                            <View style={[tw`ml-[6px] px-[6px] rounded-[4px]`, { backgroundColor: PRIMARY_COLOR }]}>
                                                <Text style={tw`text-white text-[14px]`}>
                                                    -{(((product?.old_price - product?.price) / product?.old_price) * 100).toFixed(0)} %
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={tw`rounded-[4px] flex-row items-center`}>
                                            <View style={[tw`flex-row mr-[10px] p-[4px] rounded-[6px]`, styles.status]}>
                                                <View style={tw`bg-[${PRIMARY_COLOR}] p-[4px] rounded-[50px]`}>
                                                    <IconFontAwesome
                                                        name={product?.quantity > 0 ? "check" : "ban"}
                                                        size={10}
                                                        solid
                                                        color={"#fff"}
                                                    />
                                                </View>
                                                <Text style={tw`text-[14px] ml-[4px] text-[${PRIMARY_COLOR}]`}>
                                                    {product?.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                                                </Text>
                                            </View>
                                            <Text style={tw`text-[14px]`}>
                                                {product?.quantity} sản phẩm có sẵn
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={tw`bg-white mt-[10px]`}>
                                        <Text style={tw`uppercase px-[10px] py-[10px] text-[#333] font-bold`}>
                                            Sản phẩm liên quan
                                        </Text>
                                        {
                                            RenderSlideList(productCategory)
                                        }
                                    </View>
                                    <View style={tw`bg-white mt-[10px]`}>
                                        <Text style={tw`uppercase px-[10px] pt-[10px] text-[#333] font-bold`}>
                                            TA BOOKSTORE giới thiệu
                                        </Text>
                                        <ProductFrame.ProductFrame productList={productsHots} isSlide />
                                    </View>
                                    <View style={tw`bg-white mt-[10px]`}>
                                        <Text style={tw`uppercase px-[10px] pt-[10px] text-[#333] font-bold`}>
                                            Thông tin sản phẩm
                                        </Text>
                                        <ProductInfo product={product} />
                                    </View>
                                    <View style={tw`bg-white mt-[10px]`}>
                                        <Text style={tw`uppercase px-[10px] pt-[10px] text-[#333] font-bold`}>
                                            Khách hàng nhận xét ({rate?.total} đánh giá)
                                        </Text>
                                        <CommentInfo stattisticRate={rate} rate={product?.rate} comments={comments} />
                                    </View>
                                </View>
                        }
                    </>
                )}
            />
            {
                !loading &&
                <AddProductToCartBar quantity={quantity} minus={handleMinus} plus={handlePlus} addToCart={handleAddToCart} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        objectFit: 'contain'
    },

    status: {
        backgroundColor: "rgba(201, 33, 39, 0.1)"
    }
})

export const Loading = () => {

    return (
        <View style={tw`w-full items-center justify-center bg-white`}>
            <View style={tw`bg-white py-[10px] px-[14%] items-center`}>
                <Skeleton>
                    <Skeleton.Item width={200} height={300} />
                </Skeleton>
            </View>
            <View style={tw`bg-white py-[10px] px-[16px]`}>
                <Skeleton>
                    <Skeleton.Item width={300} height={16} marginBottom={10} borderRadius={10} />
                    <Skeleton.Item width={300} height={16} marginBottom={10} borderRadius={10} />
                    <Skeleton.Item width={300} height={16} marginBottom={10} borderRadius={10} />
                </Skeleton>
            </View>
            <View style={tw`bg-white mt-[10px]`}>
                <Skeleton>
                    <Skeleton.Item width={300} height={16} marginTop={10} marginLeft={10} borderRadius={10} />
                </Skeleton>
                <ProductFrame.Loading />
            </View>
        </View>
    )
}

export default ProductDetail