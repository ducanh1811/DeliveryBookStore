import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import tw from 'twrnc'
import { Controller, useForm } from 'react-hook-form'
import SelectAddress from '../../components/SelectAddress'
import Toast from 'react-native-toast-message'
import { useDispatch, useSelector } from 'react-redux'
import { BORDER_COLOR, PRIMARY_COLOR } from '../../styles/color.global'
import { getAddressDelivery } from '../../stores/otherSlice'

const AddAddress = ({ route, navigation }) => {

    const dispatch = useDispatch()
    const { address } = route.params || null
    const { addressDelivery } = useSelector(state => state.other);
    const inputRefs = React.useRef([])
    const [initTab, setInittab] = React.useState(0)
    const [isOpenDialog, setIsOpenDialog] = React.useState(false)

    const {
        reset,
        setValue,
        register,
        handleSubmit,
        control,
        clearErrors,
        watch,
        formState: { errors }
    } = useForm()

    const addStore = data => {
        if (addressDelivery.length == 0 || data.selected == false) {
            console.log('data1');
            return [...addressDelivery, data];
        } else if (data.selected == true) {
            console.log('data2');
            return [
                ...addressDelivery.map(item => {
                    return { ...item, selected: false };
                }),
                data,
            ];
        }
    };

    const onSubmit = async (data) => {

        address
            ? !data.selected
                ? dispatch(
                    getAddressDelivery(
                        addressDelivery.map(item => {
                            return item.id == address.id ? data : item;
                        }),
                    ),
                )
                : dispatch(
                    getAddressDelivery(
                        addressDelivery.map(item => {
                            return item.id != address.id ? { ...item, selected: false } : data;
                        }),
                    ),
                )
            : dispatch(
                getAddressDelivery(
                    addStore({
                        ...data,
                        id: new Date().getTime(),
                    }),
                ),
            );

        Toast.show({
            type: 'success',
            text1: `${address ? 'Cập nhật địa chỉ thành công!' : 'Thêm mới địa chỉ thành công!'}`
        })
        navigation.goBack()
    }

    const handleNextToInput = (index) => {
        if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleClose = () => {

        setIsOpenDialog(false)
    }

    const handleClickProvince = () => {

        setInittab(0)
        setIsOpenDialog(true)
    }

    const handleClickDistrict = () => {

        if (watch('province')) {
            setInittab(1)
            setIsOpenDialog(true)
        } else {
            Toast.show({
                type: 'info',
                text1: 'Vui lòng chọn tỉnh/thành phố trước!'
            })
        }
    }

    const handleClickWard = () => {

        if (watch('district')) {
            setInittab(2)
            setIsOpenDialog(true)
        } else {
            Toast.show({
                type: 'info',
                text1: 'Vui lòng chọn quận/huyện trước!'
            })
        }
    }

    React.useEffect(() => {

        if (address) {
            Object.keys(address).forEach(key => {
                if (key === 'customer') {
                    setValue('name', address[key].name)
                    setValue('phone', address[key].phone)
                } else {
                    setValue(key, address[key])
                }
            })
        }
    }, [address])

    return (
        <View style={tw`flex-1 relative`}>
            {
                isOpenDialog && <SelectAddress clearErrors={clearErrors} initTab={initTab} watch={watch} setValue={setValue} reset={reset} close={handleClose} />
            }
            <Header title="Địa chỉ giao hàng" />
            <ScrollView style={tw`p-[14px] bg-white`}>
                <Text style={tw`text-[16px] text-[#333]`}>Nhập địa chỉ mới</Text>
                <View style={tw`mt-[20px]`}>
                    <Text style={tw`text-[#333] mb-[8px]`}>Tên người nhận</Text>
                    <Controller
                        name='name'
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                ref={(ref) => (inputRefs.current[0] = ref)}
                                onSubmitEditing={() => handleNextToInput(0)}
                                placeholder='Nhập tên người dùng'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                maxLength={50}
                                style={tw`py-[4px] px-[10px] rounded-[6px] border border-[${BORDER_COLOR}]`}
                            />
                        )}
                    />
                    {
                        errors.name && <Text style={[{ color: PRIMARY_COLOR }, tw`mt-[8px]`]}>Vui lòng nhập tên người nhận</Text>
                    }
                </View>

                <View style={tw`mt-[20px]`}>
                    <Text style={tw`text-[#333] mb-[8px]`}>Số điện thoại</Text>
                    <Controller
                        name='phone'
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                ref={(ref) => (inputRefs.current[1] = ref)}
                                placeholder='Nhập số điện thoại'
                                keyboardType='phone-pad'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                style={tw`py-[4px] px-[10px] rounded-[6px] border border-[${BORDER_COLOR}]`}
                            />
                        )}
                    />
                    {
                        errors.phone && <Text style={[{ color: PRIMARY_COLOR }, tw`mt-[8px]`]}>
                            Vui lòng nhập số điện thoại
                        </Text>
                    }
                </View>

                <View style={tw`mt-[20px]`}>
                    <Text style={tw`text-[#333] mb-[8px]`}>Tỉnh, Thành</Text>
                    <Controller
                        name='province'
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TouchableOpacity onPress={handleClickProvince}>
                                <TextInput
                                    editable={false}
                                    placeholder='Chọn tỉnh/thành phố'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={tw`text-[#333] py-[4px] px-[10px] rounded-[6px] border border-[${BORDER_COLOR}]`}
                                />
                            </TouchableOpacity>
                        )}
                    />
                    {
                        errors.province && <Text style={[{ color: PRIMARY_COLOR }, tw`mt-[8px]`]}>
                            Vui lòng chọn tỉnh/thành phố
                        </Text>
                    }
                </View>

                <View style={tw`mt-[20px]`}>
                    <Text style={tw`text-[#333] mb-[8px]`}>Quận, Huyện</Text>
                    <Controller
                        name='district'
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TouchableOpacity onPress={handleClickDistrict}>
                                <TextInput
                                    editable={false}
                                    placeholder='Chọn quận/huyện'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={tw`text-[#333] py-[4px] px-[10px] rounded-[6px] border border-[${BORDER_COLOR}]`}
                                />
                            </TouchableOpacity>
                        )}
                    />
                    {
                        errors.district && <Text style={[{ color: PRIMARY_COLOR }, tw`mt-[8px]`]}>
                            Vui lòng chọn quận/huyện
                        </Text>
                    }
                </View>

                <View style={tw`mt-[20px]`}>
                    <Text style={tw`text-[#333] mb-[8px]`}>Xã, Phường</Text>
                    <Controller
                        name='ward'
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TouchableOpacity onPress={handleClickWard}>
                                <TextInput
                                    editable={false}
                                    placeholder='Chọn xã/phường'
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={tw`text-[#333] py-[4px] px-[10px] rounded-[6px] border border-[${BORDER_COLOR}]`}
                                />
                            </TouchableOpacity>
                        )}
                    />
                    {
                        errors.ward && <Text style={[{ color: PRIMARY_COLOR }, tw`mt-[8px]`]}>
                            Vui lòng chọn xã/phường
                        </Text>
                    }
                </View>
                <View style={tw`mt-[20px]`}>
                    <Text style={tw`text-[#333] mb-[8px]`}>Nhập địa chỉ</Text>
                    <Controller
                        name='street'
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder='Nhập số nhà, tên đường,...'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                style={tw`py-[4px] px-[10px] rounded-[6px] border border-[${BORDER_COLOR}]`}
                            />
                        )}
                    />
                    {
                        errors.street && <Text style={[{ color: PRIMARY_COLOR }, tw`mt-[8px]`]}>
                            Vui lòng nhập địa chỉ (số nhà, tên đường,...)
                        </Text>
                    }
                </View>
                <View style={tw`mt-[20px] mb-[100px]`}>
                    <Text style={tw`text-[#333] mb-[8px]`}>Đặt làm địa chỉ mặc định</Text>
                    <Controller
                        name="selected"
                        control={control}
                        defaultValue={false} // Đặt giá trị mặc định là false
                        render={({ field: { onChange, onBlur, value } }) =>
                            <Switch
                                value={value}
                                onValueChange={value => onChange(value)}
                                onBlur={onBlur}
                                // màu của switch khi bật
                                thumbColor={PRIMARY_COLOR}
                                trackColor={{ false: '#767577', true: '#FF6666' }}
                                style={tw`ml-[10px] mr-2 flex-1 py-1.5`}
                            />
                        }
                    />
                </View>
            </ScrollView>
            <View style={tw`mt-[10px] items-center justify-center  bg-white absolute left-0 right-0 bottom-0`}>
                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={tw`mb-[10px] rounded-[100px] items-center justify-center py-[10px] px-[60px] mt-[10px] bg-[${PRIMARY_COLOR}]`}>
                    <Text style={tw`font-bold text-white`}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddAddress