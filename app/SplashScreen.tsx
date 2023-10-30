
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Animatable from 'react-native-animatable';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { GlobalStyles } from '../styles';

const SplashScreen = () => {
  const router = useRouter();
  return(
    <View style={GlobalStyles.container}>
        <View style={GlobalStyles.header}>
            <Animatable.Image animation="bounceIn" duration={1500} useNativeDriver={true} source={require('../assets/images/heartios.png')} style={GlobalStyles.logo} resizeMode="stretch"/>
        </View>
        <Animatable.View animation="fadeInUpBig" useNativeDriver={true} style={GlobalStyles.footer}>
            <Text style={[GlobalStyles.title,{fontFamily:'fontBold'}]}>Your Health Matters</Text>
            <Text style={[GlobalStyles.text,{fontFamily:'fontBold'}]}>Meet professional human & AI doctors to serve you from the comfort of your home. You can also request for doctors</Text>
            <View style={GlobalStyles.button}>
                <TouchableOpacity onPress={()=>router.push('Login')}>
                    <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]}start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={GlobalStyles.signIn}>
                        <Text style={[GlobalStyles.textSign,{fontFamily:'fontBold'}]}>Get Started</Text>
                        <Icon name='navigate-next' type='MaterialIcons' size={20} color={colors.white} />
                    </LinearGradient>
                </TouchableOpacity> 
            </View>
        </Animatable.View>
    </View>
  )
}
export default SplashScreen


