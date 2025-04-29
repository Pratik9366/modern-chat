import { View, Text, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

export default function presentation() {
   const router = useRouter()
  return (
    <SafeAreaView style={{padding: 20, paddingVertical: 60}}>
      <StatusBar backgroundColor='black' barStyle='light-content' translucent hidden={true}/>
      <View style={{padding: 0}}>
      <Text style={{color: 'white', fontSize: 40, fontFamily: 'InterDisplay-Bold'}}>Hey There!</Text>
      <Text style={{color: 'grey', fontSize: 40, bottom: 10, fontFamily: 'InterDisplay-Bold'}}>Welcome</Text>
      <Text style={{color: 'white', fontFamily: 'Inter-Light', fontSize: 20, bottom: 10}}>Clean, fast, and modern.</Text>
      <Text style={{color: '#8A8A8A', fontSize: 12, fontFamily: 'InterDisplay-SemiBoldLight', top: 50}}>Modern chat app cuts through the noise to bring you a straightforward way to message friends, family, and communities instantly. Simply sign in or create an account to experience chat, perfected.</Text>
      </View>
      <View style={{alignSelf: 'center', flex: 1, marginTop: 550}}>
         <TouchableOpacity onPress={()=> router.push('/(auth)')} style={{height: 50, width: 380, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 6}}>
            <Text style={{fontSize: 15, fontFamily: 'Inter-SemiBold'}}>Next Page</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}