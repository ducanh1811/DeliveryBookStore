import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { BLUE_COLOR, BORDER_COLOR, STAR_COLOR } from '../../styles/color.global'
import { Rating } from 'react-native-ratings'
import * as Progress from 'react-native-progress'
import IconFont from 'react-native-vector-icons/FontAwesome5'

const CommentInfo = ({ stattisticRate, rate, comments }) => {

    return (
        <View style={[tw`px-[10px] py-[20px] border-t border-[${BORDER_COLOR}] mt-[10px]`]}>
            <View style={tw`flex-row pb-[20px]`}>
                <View style={tw`items-center w-[40%]`}>
                    <Text style={tw`text-[30px] font-bold text-[#333] pb-[6px]`}>{rate?.toFixed(1)}</Text>
                    <Rating imageSize={15} startingValue={rate} readonly />
                    <Text style={tw`pt-[6px] font-bold`}>{stattisticRate?.total} đánh giá</Text>
                </View>
                {
                    stattisticRate &&
                    <View>
                        {
                            stattisticRate?.rate?.map((item, index) => (
                                <View key={index} style={tw`pb-[6px] flex-row items-center gap-[8px]`}>
                                    <Text style={tw`text-[13px] text-[#333]`}>{index + 1} sao</Text>
                                    <Progress.Bar
                                        key={index}
                                        progress={stattisticRate?.total != 0 ? parseFloat((item / stattisticRate?.total).toFixed(1)) : 0}
                                        borderWidth={0}
                                        color={STAR_COLOR}
                                        unfilledColor="#eee"
                                        width={120}
                                    />
                                    <Text style={tw`text-[13px] text-[#333]`}>{stattisticRate?.total != 0 ? ((item / stattisticRate?.total) * 100)?.toFixed(0) : 0} %</Text>
                                </View>
                            ))
                        }
                    </View>
                }
            </View>
            {
                stattisticRate?.total !== 0
                    ?
                    <>
                        {
                            comments.map(comment => (
                                <View key={comment?._id} style={tw`pt-[10px] border-t border-[${BORDER_COLOR}]`}>
                                    <View style={tw`flex-row justify-between`}>
                                        <View style={tw`items-start`}>
                                            <Text style={tw`font-bold text-[#333] pb-[4px]`}>{comment?.user?.fullName}</Text>
                                            <Rating imageSize={13} startingValue={comment?.rate} readonly />
                                        </View>
                                        <Text style={tw`text-[#999]`}>{comment?.createdAt}</Text>
                                    </View>
                                    <Text numberOfLines={3} style={tw`text-justify text-[#333] mt-[10px]`}>
                                        {comment?.comment}
                                    </Text>
                                </View>
                            ))
                        }
                    </>
                    :
                    <View style={tw`items-center`}>
                        <IconFont
                            name="comments"
                            size={40}
                            color="#666"
                        />
                        <Text style={tw`mt-[10px] text-[#333]`}>Hiện chưa có nhận xét nào về sản phẩm này</Text>
                    </View>
            }
        </View>
    )
}

export default CommentInfo