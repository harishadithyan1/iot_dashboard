import { StyleSheet, Text, View ,Image} from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router';
const index = () => {
    const router = useRouter();
    useEffect(()=>{
        setTimeout(()=>{
            router.push('/dashboard')
        },4000);
    })
  return (
    <>
    <View style={styles.container}>
      <Image 
      style={styles.logo} 
      resizeMode='contain'
      source={require("../assets/images/iologo.png")}/>
    </View>
    </>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#101010",
  },
  logo:{
    height:500,
    width:500,
  }
})
