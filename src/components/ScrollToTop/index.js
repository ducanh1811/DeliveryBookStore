import { TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import IconFont from 'react-native-vector-icons/FontAwesome5'
import { BORDER_COLOR } from '../../styles/color.global'

const ScrollToTop = ({ ref }) => {

    const handleScrollToTop = () => {

        if (ref?.current) {
            ref?.current.scrollToOffset({ animated: true, offset: 0 })
        }
    }

    return (
        <TouchableOpacity onPress={handleScrollToTop} style={tw`absolute p-[10px] rounded-[10px] border border-[${BORDER_COLOR}] bottom-[120px] right-[20px] z-100 bg-white`}>
            <IconFont
                name="arrow-up"
                size={20}
                color="#333"
            />
        </TouchableOpacity>
    )
}

export default ScrollToTop