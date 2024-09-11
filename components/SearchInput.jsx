import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { usePathname, router } from 'expo-router'

const SearchInput = ({ initialQuery = ''}) => {
    const pathname = usePathname();
    const [query, setQuery] = React.useState(initialQuery);
  return (
       <View className="flex-row border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center space-x-4">
        <TextInput 
        className="flex-1 text-white font-regular text-base mt-0.5"
        value={query}
        placeholder='Search for a video topic'
        placeholderTextColor='#CDCDE0'
        onChangeText={(event) => {
            setQuery(event)
        }}
        />
        <TouchableOpacity onPress={() => {
            if (!query) {
                return Alert.alert('Missing query', 'Please input something to search results across database')
            }
            if (pathname.startsWith('/search')) {
                router.setParams({ query });
            } else {
                router.push(`/search/${query}`)
            }
        }}
        >
            <Image 
            source={icons.search}
            className="w-5 h-5"
            resizeMode='contain'
            />
        </TouchableOpacity>
       </View>
  )
}

export default SearchInput;