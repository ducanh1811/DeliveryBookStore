import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header/index';
import tw from 'twrnc';
import {BORDER_COLOR, PRIMARY_COLOR} from '../../styles/color.global';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from '@rneui/themed';
import {launchImageLibrary} from 'react-native-image-picker';
import Button from '../../components/Button/index';
import Dialog from 'react-native-dialog';
// import DatePicker from 'react-native-date-picker'
import {apiUpdateUser, apiVerifyOtp} from '../../apis/user';
import Toast from 'react-native-toast-message';
import Loading from '../../components/loaders/Loading';
import {update} from '../../stores/userSlice';

const lisGender = [
  {
    name: 'Nam',
    value: 'male',
  },
  {
    name: 'Nữ',
    value: 'female',
  },
  {
    name: 'Khác',
    value: 'other',
  },
];

const getDateString = date => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
};

const EditProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {user, token} = useSelector(state => state.user);
  const [image, setImage] = React.useState();
  const [fullName, setFullName] = React.useState();
  const [gender, setGender] = React.useState();
  const [birth, setBirth] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();

  const [bank, setBank] = React.useState();
  const [bankUser, setBankUser] = React.useState();
  const [bankNumber, setBankNumber] = React.useState();
  const [email, setEmail] = React.useState();
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [openNameBox, setOpenNameBox] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [openGenderBox, setOpenGenderBox] = React.useState(false);
  const [openDateBox, setOpenDateBox] = React.useState(false);
  const [openPhoneNumberBox, setOpenPhoneNumberBox] = React.useState(false);
  const [openBankBox, setOpenBankBox] = React.useState(false);
  const [openEmailBox, setOpenEmailBox] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const options = {
    storageOptions: {
      path: 'image',
    },
  };

  const handleChooseImage = () => {
    launchImageLibrary(options, response => {
      if (!response.didCancel) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (image)
      formData.append('images', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || 'image.jpg',
      });
    if (fullName) formData.append('fullName', fullName);
    if (gender) formData.append('gender', gender.value);
    if (birth) formData.append('birth', birth);
    if (phoneNumber) formData.append('phoneNumber', phoneNumber);
    if (bank) formData.append('bankName', bank);
    if (bankNumber) formData.append('bankNumber', bankNumber);
    if (bankUser) formData.append('bankUser', bankUser);

    try {
      setLoading(true);
      const response = await apiUpdateUser(formData, user._id, token);

      setLoading(false);
      if (response.status === 200) {
        dispatch(update(response.data.data));

        Toast.show({
          type: 'success',
          text1: 'Cập nhật thông tin thành công!',
        });

        setTimeout(() => {
          navigation.goBack();
        }, 200);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Lỗi cập nhật thông tin!',
      });
    }
  };

  const handleToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleAthenEmail = async () => {
    try {
      setLoading(true);
      const response = await apiVerifyOtp(email);
      setLoading(false);
      if (response.status === 200) {
        setEmail(null);
        setOpenEmailBox(false);
        navigation.navigate('AuthenChangeEmail', {
          email: email,
          otpCode: response.data.data,
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Lỗi gửi mã OTP',
      });
    }
  };

  React.useEffect(() => {
    if (
      image ||
      fullName ||
      gender ||
      birth ||
      phoneNumber ||
      bank ||
      email ||
      bankUser ||
      bankNumber
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [
    image,
    fullName,
    gender,
    birth,
    phoneNumber,
    bank,
    email,
    bankUser,
    bankNumber,
  ]);

  React.useEffect(() => {
    const regex =
      /^[a-zA-ZÃ€ÃÃ‚ÃƒÃˆÃ‰ÃŠÃŒÃÃ’Ã“Ã”Ã•Ã™ÃšÄ‚ÄÄ¨Å¨Æ Ã Ã¡Ã¢Ã£Ã¨Ã©ÃªÃ¬Ã­Ã²Ã³Ã´ÃµÃ¹ÃºÄƒÄ‘Ä©Å©Æ¡Æ¯Ä‚áº áº¢áº¤áº¦áº¨áºªáº¬áº®áº°áº²áº´áº¶áº¸áººáº¼á»€á»€á»‚áº¾Æ°Äƒáº¡áº£áº¥áº§áº©áº«áº­áº¯áº±áº³áºµáº·áº¹áº»áº½á»á»á»ƒáº¿á»„á»†á»ˆá»Šá»Œá»Žá»á»’á»”á»–á»˜á»šá»œá»žá» á»¢á»¤á»¦á»¨á»ªá»…á»‡á»‰á»‹á»á»á»‘á»“á»•á»—á»™á»›á»á»Ÿá»¡á»£á»¥á»§á»©á»«á»¬á»®á»°á»²á»´Ãá»¶á»¸á»­á»¯á»±á»³á»µá»·á»¹\s\W|_]+$/;
    console.log(regex.test(fullName));
    if (!regex.test(fullName)) {
      setErrors(prev => {
        prev.fullName = 'Tên phải ít nhất 1 kí tự, không chứa kí tự số';

        return {...prev};
      });
    } else {
      setErrors(prev => {
        delete prev.fullName;

        return {...prev};
      });
    }
  }, [fullName]);

  React.useEffect(() => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    if (!regexPhoneNumber.test(phoneNumber)) {
      setErrors(prev => {
        prev.phone = 'Vui lòng nhập đúng định dạng số điện thoại';
        return {...prev};
      });
    } else {
      setErrors(prev => {
        delete prev.phone;
        return {...prev};
      });
    }
  }, [phoneNumber]);

  React.useEffect(() => {
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (email) {
      if (!regexEmail.test(email)) {
        setErrors(prev => {
          prev.email = 'Vui lòng nhập đúng định dạng email';
          return {...prev};
        });
      } else {
        setErrors(prev => {
          delete prev.email;
          return {...prev};
        });
      }
    }
  }, [email]);

  return (
    <View style={tw`relative flex-1`}>
      {loading && <Loading />}
      {openNameBox && (
        <View
          style={[
            tw`absolute flex-1 top-0 bottom-0 left-0 right-0 z-100`,
            style.dialog,
          ]}>
          <View style={tw`absolute bg-white bottom-0 left-0 right-0 p-[20px]`}>
            <View style={tw`items-center`}>
              <Dialog.Title>Sửa tên</Dialog.Title>
            </View>
            <TextInput
              // keyboardType='numeric'
              value={fullName}
              defaultValue={user.fullName}
              onChangeText={value => setFullName(value)}
              style={tw`bg-[#eee] px-[10px] rounded-[6px] my-[10px]`}
              autoFocus={true}
            />
            {errors?.fullName && (
              <Text style={[{color: PRIMARY_COLOR}]}>{errors?.fullName}</Text>
            )}
            <View style={tw`flex-row items-center justify-end`}>
              <Dialog.Button
                label="Hủy"
                bold
                color="#333"
                onPress={() => {
                  setOpenNameBox(false);
                  setFullName(null);
                }}
              />
              <Dialog.Button
                disabled={errors.fullName ? true : false}
                label="Lưu"
                bold
                color={errors.fullName ? '#666' : PRIMARY_COLOR}
                onPress={() => setOpenNameBox(false)}
              />
            </View>
          </View>
        </View>
      )}
      <Dialog.Container visible={openGenderBox} style={tw`py-[10px]`}>
        <View style={tw`items-center`}>
          <Dialog.Title>Giới tính</Dialog.Title>
        </View>
        {lisGender.map(item => (
          <TouchableOpacity
            onPress={() => setGender(item)}
            key={item.value}
            style={tw`py-[4px]`}>
            <Text
              style={[
                tw`font-bold text-[16px]`,
                {
                  color: gender
                    ? gender.value === item.value
                      ? PRIMARY_COLOR
                      : '#333'
                    : user.gender === item.value
                    ? PRIMARY_COLOR
                    : '#333',
                },
              ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
        <Dialog.Button
          label="Hủy"
          bold
          color="#333"
          onPress={() => {
            setOpenGenderBox(false);
            setGender(null);
          }}
        />
        <Dialog.Button
          label="Lưu"
          bold
          color={PRIMARY_COLOR}
          onPress={() => setOpenGenderBox(false)}
        />
      </Dialog.Container>
      {/* <DatePicker
                confirmText="Lưu"
                cancelText="Hủy"
                title="Ngày sinh"
                modal
                open={openDateBox}
                date={user.birth !== "" ? new Date(user.birth) : new Date()}
                maximumDate={new Date()}
                mode="date"
                onConfirm={(date) => {
                    setOpenDateBox(false)
                    setBirth(getDateString(date))
                }}
                onCancel={() => {
                    setOpenDateBox(false)
                    setBirth(null)
                }}
            /> */}
      {openPhoneNumberBox && (
        <View
          style={[
            tw`absolute flex-1 top-0 bottom-0 left-0 right-0 z-100`,
            style.dialog,
          ]}>
          <View style={tw`absolute bg-white bottom-0 left-0 right-0 p-[20px]`}>
            <View style={tw`items-center`}>
              <Dialog.Title>Sửa số điện thoại</Dialog.Title>
            </View>
            <TextInput
              keyboardType="phone-pad"
              value={phoneNumber}
              defaultValue={user.phoneNumber}
              onChangeText={value => setPhoneNumber(value)}
              style={tw`bg-[#eee] px-[10px] rounded-[6px] my-[10px]`}
              autoFocus={true}
            />
            {errors?.phone && (
              <Text style={[{color: PRIMARY_COLOR}]}>{errors?.phone}</Text>
            )}
            <View style={tw`flex-row items-center justify-end`}>
              <Dialog.Button
                label="Hủy"
                bold
                color="#333"
                onPress={() => {
                  setOpenPhoneNumberBox(false);
                  setPhoneNumber(null);
                }}
              />
              <Dialog.Button
                disabled={errors.phone ? true : false}
                label="Lưu"
                bold
                color={errors.phone ? '#666' : PRIMARY_COLOR}
                onPress={() => setOpenPhoneNumberBox(false)}
              />
            </View>
          </View>
        </View>
      )}
      {openBankBox && (
        <View
          style={[
            tw`absolute flex-1 top-0 bottom-0 left-0 right-0 z-100`,
            style.dialog,
          ]}>
          <View style={tw`absolute bg-white bottom-0 left-0 right-0 p-[20px]`}>
            <View style={tw`items-center`}>
              <Dialog.Title>Sửa thông tin Ngân hàng</Dialog.Title>
            </View>
            <TextInput
            //   keyboardType="phone-pad"
              placeholder="Tên ngân hàng"
              value={bank}
              defaultValue={user.bankName}
              onChangeText={value => setBank(value)}
              style={tw`bg-[#eee] px-[10px] rounded-[6px] my-[10px]`}
              autoFocus={true}
            />
            {errors?.bank && (
              <Text style={[{color: PRIMARY_COLOR}]}>{errors?.bank}</Text>
            )}
            <TextInput
            //   keyboardType="phone-pad"
              placeholder="Tên chủ tài khoản"
              value={bankUser}
              defaultValue={user.bankUser}
              onChangeText={value => setBankUser(value)}
              style={tw`bg-[#eee] px-[10px] rounded-[6px] my-[10px]`}
              autoFocus={true}
            />
            {errors?.bankUser && (
              <Text style={[{color: PRIMARY_COLOR}]}>{errors?.bankUser}</Text>
            )}
            <TextInput
              keyboardType="phone-pad"
              placeholder="Số tài khoản"
              value={bankNumber}
              defaultValue={user.bankNumber}
              onChangeText={value => setBankNumber(value)}
              style={tw`bg-[#eee] px-[10px] rounded-[6px] my-[10px]`}
              autoFocus={true}
            />
            {errors?.bankNumber && (
              <Text style={[{color: PRIMARY_COLOR}]}>{errors?.bankNumber}</Text>
            )}
            <View style={tw`flex-row items-center justify-end`}>
              <Dialog.Button
                label="Hủy"
                bold
                color="#333"
                onPress={() => {
                  setOpenBankBox(false);
                  setBank(null);
                }}
              />
              <Dialog.Button
                disabled={errors.bank ? true : false}
                label="Lưu"
                bold
                color={errors.bank ? '#666' : PRIMARY_COLOR}
                onPress={() => setOpenBankBox(false)}
              />
            </View>
          </View>
        </View>
      )}
      {openEmailBox && (
        <View
          style={[
            tw`absolute flex-1 top-0 bottom-0 left-0 right-0 z-100`,
            style.dialog,
          ]}>
          <View style={tw`absolute bg-white bottom-0 left-0 right-0 p-[20px]`}>
            <View style={tw`items-center`}>
              <Dialog.Title>Nhập địa chỉ email mới</Dialog.Title>
            </View>
            <TextInput
              keyboardType="email-address"
              value={email}
              onChangeText={value => setEmail(value)}
              style={tw`bg-[#eee] px-[10px] rounded-[6px] my-[10px]`}
              autoFocus={true}
            />
            {errors?.email && (
              <Text style={[{color: PRIMARY_COLOR}]}>{errors?.email}</Text>
            )}
            <View style={tw`flex-row items-center justify-end`}>
              <Dialog.Button
                label="Hủy"
                bold
                color="#333"
                onPress={() => {
                  setOpenEmailBox(false);
                }}
              />
              <Dialog.Button
                disabled={errors.email ? true : false}
                label="Tiếp tục"
                bold
                color={errors.email ? '#666' : PRIMARY_COLOR}
                onPress={handleAthenEmail}
              />
            </View>
          </View>
        </View>
      )}
      <Header navigation={navigation} title="Chỉnh sửa thông tin" />
      <View style={tw`relative h-[200px]`}>
        <View style={[tw`h-[70%]`, {backgroundColor: PRIMARY_COLOR}]}></View>
        <View
          style={[
            tw`w-[120px] h-[120px] rounded-[100px] items-center justify-center bg-[#eee] border-4 border-white`,
            style.images,
          ]}>
          <Image
            source={{uri: image ? image.uri : user.images}}
            style={[
              tw`w-[116px] h-[116px] rounded-[100px]`,
              {objectFit: 'contain'},
            ]}
          />
          <TouchableOpacity
            onPress={handleChooseImage}
            style={[
              tw`absolute w-[25px] border-2 border-white h-[25px] items-center justify-center right-0 bottom-[10%] rounded-[50px]`,
              style.button,
            ]}>
            <Icon name="edit" type="material" color="white" size={18} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View
          style={tw`p-[12px] border border-[${BORDER_COLOR}] bg-white flex-row items-center mb-[10px]`}>
          <Text style={tw`flex-1 text-[#333]`}>Họ tên</Text>
          <TouchableOpacity
            onPress={() => setOpenNameBox(true)}
            style={tw`flex-row items-center`}>
            <Text style={tw`text-[#333]`}>
              {fullName
                ? fullName
                : user.fullName
                ? user.fullName
                : 'Thiết lập ngay'}
            </Text>
            <Icon name="chevron-right" type="material" color="#333" size={20} />
          </TouchableOpacity>
        </View>
        <View
          style={tw`p-[12px] border border-[${BORDER_COLOR}] bg-white flex-row items-center mb-[10px]`}>
          <Text style={tw`flex-1 text-[#333]`}>Giới tính</Text>
          <TouchableOpacity
            onPress={() => setOpenGenderBox(true)}
            style={tw`flex-row items-center`}>
            <Text style={tw`text-[#333]`}>
              {gender
                ? gender.name
                : user.gender
                ? user.gender === 'male'
                  ? 'Nam'
                  : 'Nữ'
                : 'Thiết lập ngay'}
            </Text>
            <Icon name="chevron-right" type="material" color="#333" size={20} />
          </TouchableOpacity>
        </View>
        {/* <View style={tw`p-[12px] border border-[${BORDER_COLOR}] bg-white flex-row items-center mb-[10px]`}>
                    <Text style={tw`flex-1 text-[#333]`}>Ngày sinh</Text>
                    <TouchableOpacity onPress={() => setOpenDateBox(true)} style={tw`flex-row items-center`}>
                        <Text style={tw`text-[#333]`}>{birth ? birth : user.birth ? user.birth : 'Thiết lập ngay'}</Text>
                        <Icon
                            name='chevron-right'
                            type="material"
                            color="#333"
                            size={20}
                        />
                    </TouchableOpacity>
                </View> */}
        <View
          style={tw`p-[12px] border border-[${BORDER_COLOR}] bg-white flex-row items-center mb-[10px]`}>
          <Text style={tw`flex-1 text-[#333]`}>Ngân hàng</Text>
          <TouchableOpacity
            onPress={() => setOpenBankBox(true)}
            style={tw`flex-row items-center`}>
            <Text style={tw`text-[#333]`}>
              {bank ? bank : user.bankName ? user.bankName : 'Thiết lập ngay'}
            </Text>
            <Icon name="chevron-right" type="material" color="#333" size={20} />
          </TouchableOpacity>
        </View>
        <View
          style={tw`p-[12px] border border-[${BORDER_COLOR}] bg-white flex-row items-center mb-[10px]`}>
          <Text style={tw`flex-1 text-[#333]`}>Số điện thoại</Text>
          <TouchableOpacity
            onPress={() => setOpenPhoneNumberBox(true)}
            style={tw`flex-row items-center`}>
            <Text style={tw`text-[#333]`}>
              {phoneNumber
                ? phoneNumber
                : user.phoneNumber
                ? user.phoneNumber
                : 'Thiết lập ngay'}
            </Text>
            <Icon name="chevron-right" type="material" color="#333" size={20} />
          </TouchableOpacity>
        </View>
        <View
          style={tw`p-[12px] border border-[${BORDER_COLOR}] bg-white flex-row items-center mb-[10px]`}>
          <Text style={tw`flex-1 text-[#333]`}>Email</Text>
          <TouchableOpacity
            onPress={() => setOpenEmailBox(true)}
            style={tw`flex-row items-center`}>
            <Text style={tw`text-[#333]`}>
              {user.email ? user.email : 'Thiết lập ngay'}
            </Text>
            <Icon name="chevron-right" type="material" color="#333" size={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleToChangePassword}
          style={tw`p-[12px] border border-[${BORDER_COLOR}] bg-white flex-row items-center mb-[10px]`}>
          <Text style={tw`flex-1 text-[#333]`}>Thiết lập lại mật khẩu</Text>
          <Icon name="chevron-right" type="material" color="#333" size={20} />
        </TouchableOpacity>
      </View>
      <View style={tw`mt-[20px] mx-[30%]`}>
        <Button
          type="linear"
          title="Lưu"
          disabled={isDisabled}
          onPress={handleSave}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  images: {
    position: 'absolute',
    transform: [{translateX: -60}, {translateY: -50}],
    top: '50%',
    left: '50%',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  dialog: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default EditProfile;
