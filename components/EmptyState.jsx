import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CButton from './CButton'
import { router } from 'expo-router'
const EmptyState = ( { title, subtitle}) => {
  return (
    <View className="justify-center items-center px-4">
        <Image source={images.empty} className="w-[270px] h-[215px]" resizeMode='contain'/>
        <Text className="text-xl text-center mt-2 font-psemibold text-white">
                {title}
        </Text>
        <Text className="font-pmedium text-gray-100 text-sm">
            {subtitle}
        </Text>
        <CButton 
        title='Create video'
        handlePress={() => (
            router.push('/create')
        )}
        containerStyles='w-full my-5'
        />
    </View>
  )
}

export default EmptyState