import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CButton from '../../components/CButton'
import { Link, router } from 'expo-router'
import { register } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const [userName, setUserName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleSubmit = async () => {
    if (!userName || !email || !pass) {
      Alert.alert('Error', 'Please fill out all the fields');
    }
    setIsSubmitting(true);
    try {
      const result = await register(email, pass, userName);
      setUser(result);
      setIsLoggedIn(true);
      router.replace('/home');
    } catch(error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="h-full w-full justify-center min-h-[82vh] px-4 my-6">
          <Image 
          source={images.logo}
          resizeMode='contain'
          className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up to Aora
          </Text>
          <FormField 
          title='Username'
          value={userName}
          handleChangeText={(e) => {
            setUserName(e);
          }}
          otherStyles='mt-10'
          keyboardType='username'
          />
          <FormField 
          title='Email'
          value={email}
          handleChangeText={(e) => {
            setEmail(e);
          }}
          otherStyles='mt-7'
          keyboardType='email-address'
          />
          <FormField 
          title='Password'
          value={pass}
          handleChangeText={(e) => {
            setPass(e);
          }}
          otherStyles='mt-7'
          keyboardType='email-address'
          />
          <CButton 
          title='Sign Up'
          handlePress={handleSubmit}
          containerStyles='mt-7'
          isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 gap-2 flex-row">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary">Sign in</Link>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default SignUp