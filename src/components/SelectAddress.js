import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useDispatch, useSelector } from 'react-redux'
import { apiDistrictById, apiGetProvince, apiWardById } from '../apis/user'
import Skeleton from "@thevsstech/react-native-skeleton"
import { getDistrict, getProvince, getWard } from '../stores/dataSlice'
import { BORDER_COLOR } from '../styles/color.global'

const tabList = [
    {
        key: 'province',
        label: 'Tỉnh, Thành'
    },
    {
        key: 'district',
        label: 'Quận, Huyện'
    },
    {
        key: 'ward',
        label: 'Phường, Xã'
    }
]

const SelectAddress = ({ watch, setValue, reset, close, initTab, clearErrors }) => {

    const dispatch = useDispatch()
    const { provinces, districes, wards } = useSelector(state => state.data)
    const [currentIndex, setCurrentIndex] = React.useState(initTab)
    const [provinceId, setProvinceId] = React.useState(null)
    const [districtId, setDistrictId] = React.useState(null)
    const [loading, setLoading] = React.useState(false)

    const fetchProvince = async () => {

        setLoading(true)
        const response = await apiGetProvince()
        setLoading(false)

        if (response.status === 200) {

            dispatch(getProvince(response.data.results))
        }
    }

    const fetchDistrict = async (id) => {

        setLoading(true)
        const response = await apiDistrictById(id)
        setLoading(false)

        if (response.status === 200) {

            dispatch(getDistrict(response.data.results))
        }
    }

    const fetchWard = async (id) => {

        setLoading(true)
        const response = await apiWardById(id)
        setLoading(false)

        if (response.status === 200) {

            dispatch(getWard(response.data.results))
        }
    }

    const handleClear = (tab, index) => {

        if (index === 0) {

            setValue(tabList[index + 1].key, null)
        }
        setValue(tab.key, null)
        setCurrentIndex(index)
    }

    const handleChooseProvince = (province) => {

        setValue('province', province.province_name)
        setProvinceId(province.province_id)
        setCurrentIndex(1)
        clearErrors('province')
    }

    const handleChooseDistrict = (district) => {

        setValue('district', district.district_name)
        setDistrictId(district.district_id)
        setCurrentIndex(2)
        clearErrors('district')
    }

    const handleChooseWard = (ward) => {

        setValue('ward', ward.ward_name)
        close()
        clearErrors('ward')
    }

    const handleClose = () => {
        close()
    }

    React.useState(() => {

        if (provinces.length <= 0) {

            fetchProvince()
        }

    }, [])

    React.useEffect(() => {

        if (provinceId) {
            fetchDistrict(provinceId)
        }
    }, [provinceId])

    React.useEffect(() => {

        if (districtId) {
            fetchWard(districtId)
        }
    }, [districtId])

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.dialog]}>
            <View style={tw`absolute bottom-0 left-0 right-0 bg-white h-[96%]`}>
                <View style={tw`px-[20px] py-[10px] flex-row items-center`}>
                    <TouchableOpacity onPress={handleClose} style={tw`p-[4px]`}>
                        <Text style={tw`text-[#333] text-[24px]`}>x</Text>
                    </TouchableOpacity>
                    <Text style={tw`flex-1 text-center text-[#333] font-bold`}>Địa chỉ giao hàng</Text>
                </View>
                <View style={tw`py-[10px] flex-row items-center justify-between px-[10px] bg-[${BORDER_COLOR}]`}>
                    {
                        tabList.map((tab, index) => (
                            <TouchableOpacity key={tab.key} disabled={!watch(tab.key)} onPress={() => handleClear(tab, index)}>
                                <Text
                                    numberOfLines={1}
                                    style={tw`font-bold border-b-2 w-[100px] ${currentIndex === index ? "text-[#FA7B05] border-[#FA7B05]" : "text-[#333] border-transparent"}`}>
                                    {watch(tab.key) ? watch(tab.key) : tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                {
                    loading
                        ?
                        <Loading />
                        :
                        <>
                            {
                                currentIndex === 0 &&
                                <ScrollView>
                                    {
                                        provinces.map(province => (
                                            <TouchableOpacity
                                                onPress={() => handleChooseProvince(province)}
                                                key={province.province_id}
                                                style={tw`px-[20px] py-[10px]`}
                                            >
                                                <Text style={tw`text-[#333]`}>
                                                    {province.province_name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                            }
                            {
                                currentIndex === 1 &&
                                <ScrollView>
                                    {
                                        districes.map(district => (
                                            <TouchableOpacity
                                                onPress={() => handleChooseDistrict(district)}
                                                key={district.district_id}
                                                style={tw`px-[20px] py-[10px]`}
                                            >
                                                <Text style={tw`text-[#333]`}>
                                                    {district.district_name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                            }
                            {
                                currentIndex === 2 &&
                                <ScrollView>
                                    {
                                        wards.map(ward => (
                                            <TouchableOpacity
                                                onPress={() => handleChooseWard(ward)}
                                                key={ward.ward_id}
                                                style={tw`px-[20px] py-[10px]`}
                                            >
                                                <Text style={tw`text-[#333]`}>
                                                    {ward.ward_name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                            }
                        </>
                }
            </View>
        </View>
    )
}

export const Loading = () => {

    return (
        <View style={tw`p-[20x]`}>
            <Skeleton>
                <Skeleton.Item flexDirection="column" alignItems="center">
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                            <Skeleton.Item
                                key={num}
                                width={300}
                                height={20}
                                borderRadius={6}
                                marginBottom={20}
                            />
                        ))
                    }

                </Skeleton.Item>
            </Skeleton>
        </View>
    )
}

const styles = StyleSheet.create({

    dialog: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0 ,0.3)',
        zIndex: 110,
    }
})

export default SelectAddress