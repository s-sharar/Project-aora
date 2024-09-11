import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...delegated }) => {
    const [showPass, setShowPass] = React.useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-gray-100 font-pmedium text-base">
        {title}
       </Text>
       <View className="flex-row border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center">
        <TextInput 
        className="flex-1 text-white font-psemibold text-base"
        value={value}
        placeholder={placeholder}
        placeholderTextColor='#7b7b8b'
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !showPass}
        />
        {title === 'Password' &&
            <TouchableOpacity onPress={() => {
                setShowPass(!showPass);
            }}>
                <Image 
                source={showPass ? icons.eyehide : icons.eye} 
                className='w-6 h-6'
                resizeMode='contain'
                />
            </TouchableOpacity>
        }
       </View>
    </View>
  )
}

export default FormField