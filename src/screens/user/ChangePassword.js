import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../components/Header/index'
import Toast from 'react-native-toast-message'
import Loading from '../../components/loaders/Loading'
import Button from '../../components/Button/index'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { useForm, Controller } from 'react-hook-form';
import { PRIMARY_COLOR } from '../../styles/color.global';

import tw from 'twrnc'
import { apiUpdateUser } from '../../apis/user';
import { update } from '../../stores/userSlice';

const ChangePassword = ({ navigation }) => {

    const dispatch = useDispatch()
    const { user, token } = useSelector(state => state.user)
    const [isShowPassword, setIsShowPassword] = React.useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {

        const formData = new FormData()
        formData.append('password', data.password)

        try {
            setLoading(true)
            const response = await apiUpdateUser(formData, user._id, token)
            setLoading(false)

            if (response.status === 200) {

                dispatch(update(response.data.data))
                Toast.show({
                    type: 'success',
                    text1: 'Thay đổi mật khẩu thành công'
                })

                setTimeout(() => {
                    navigation.goBack()
                }, 200)

            }
        } catch (error) {
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: 'Lỗi thay đổi mật khẩu'
            })
        }

    }

    React.useEffect(() => {

        if (watch('password') !== watch('confirmPassword')) {

            setError('confirmPassword', { type: 'custom', message: 'Mật khẩu không khớp' })
        } else {

            clearErrors('confirmPassword')
        }

    }, [watch('password'), watch('confirmPassword')])

    return (
        <View style={tw`flex-1`}>
            {loading && <Loading />}
            <Header navigation={navigation} title="Thiết lập mật khẩu" />
            <View style={tw`px-[20px] items-center pt-[20px]`}>

                <View style={tw`w-full my-[10px]`}>
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: true,
                            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View
                                style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-[#999]'
                                    } rounded-[6px] text-[#333] w-full px-[10px]`}>
                                <View style={tw`w-[20px]`}>
                                    <IconFontAwesome
                                        name="lock"
                                        size={22}
                                        color={`${PRIMARY_COLOR}`}
                                    />
                                </View>
                                <TextInput
                                    spellCheck={false}
                                    onBlur={onBlur}
                                    placeholder="Nhập mật khẩu mới"
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    style={tw`ml-[10px] flex-1`}
                                    placeholderTextColor="#999"
                                    secureTextEntry={!isShowPassword}
                                />
                                {watch('password') ? (
                                    <View>
                                        {isShowPassword ? (
                                            <TouchableOpacity onPress={() => setIsShowPassword(prev => !prev)}>
                                                <IconFontAwesome
                                                    name="eye"
                                                    size={18}
                                                    color={`${PRIMARY_COLOR}`}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => setIsShowPassword(prev => !prev)}>
                                                <View style={tw`flex-1 w-[20px]`}>

                                                </View>
                                                <IconFontAwesome
                                                    name="eye-slash"
                                                    size={18}
                                                    color={`${PRIMARY_COLOR}`}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                            </View>
                        )}
                    />

                    {errors.password && (
                        <View style={tw`mt-[10px]`}>
                            <Text style={tw`text-red-500`}>Mật khẩu mới phải bao gồm: </Text>
                            <Text style={tw`text-red-500`}>Từ 8 kí tự trở lên</Text>
                            <Text style={tw`text-red-500`}>Ít nhất: 1 kí tự đặc biệt, 1 số, 1 in hoa</Text>
                        </View>
                    )}

                </View>

                <View style={tw`w-full my-[10px]`}>
                    <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View
                                style={tw`flex-row items-center border ${errors.confirmPassword ? 'border-red-500' : 'border-[#999]'
                                    } rounded-[6px] text-[#333] w-full px-[10px]`}>
                                <View style={tw`w-[20px]`}>
                                    <IconFontAwesome
                                        name="lock"
                                        size={22}
                                        color={`${PRIMARY_COLOR}`}
                                    />
                                </View>
                                <TextInput
                                    spellCheck={false}
                                    onBlur={onBlur}
                                    placeholder="Nhập lại mật khẩu mới"
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    style={tw`ml-[10px] flex-1`}
                                    placeholderTextColor="#999"
                                    secureTextEntry={!isShowConfirmPassword}
                                />
                                {watch('confirmPassword') ? (
                                    <View>
                                        {isShowConfirmPassword ? (
                                            <TouchableOpacity onPress={() => setIsShowConfirmPassword(prev => !prev)}>
                                                <IconFontAwesome
                                                    name="eye"
                                                    size={18}
                                                    color={`${PRIMARY_COLOR}`}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => setIsShowConfirmPassword(prev => !prev)}>
                                                <View style={tw`flex-1 w-[20px]`}>

                                                </View>
                                                <IconFontAwesome
                                                    name="eye-slash"
                                                    size={18}
                                                    color={`${PRIMARY_COLOR}`}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                            </View>
                        )}
                    />

                    {errors.confirmPassword && (
                        <Text style={tw`mt-[10px] text-red-500`}>
                            {errors.confirmPassword?.message}
                        </Text>
                    )}
                    <View style={tw`mt-[20px] mx-[70px]`}>
                        <Button
                            type="linear"
                            title="Lưu mật khẩu"
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </View>

            </View>
        </View>
    )
}

export default ChangePassword