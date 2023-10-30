import {TouchableOpacity, View, Text, StyleSheet} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from "expo-router";
import Icon from "../ui/Icon";
import { useDispatch } from "react-redux";
import useUsers from "../../hooks/useUsers";
import { FontAwesome } from "@expo/vector-icons";
import Stats from "./components/Stats";
import { RequestBtns } from "./components/RequestBtns";
import Photos from "./components/Photos";
import About from "./components/About";
import { colors } from "../../constants/Colors";
import useAuth from "../../hooks/useAuth";
export const BodySection = () =>{
    const navigation = useRouter();
    const {activeUser:activeProfile,profileOwner,accountInfo} = useUsers();
    const {logOut} = useAuth();
    return(
        <View style={{flex: 1,marginTop:5,borderRadius:10}}>
             <Stack.Screen options={{ 
                headerRight: () => (
                    profileOwner ? <TouchableOpacity onPress={logOut} style={{}}><Icon type="FontAwesome" name="sign-out" size={40} color={colors.tomato} /></TouchableOpacity> :
                    (activeProfile.type === 'AI_DOCTOR' && <TouchableOpacity onPress={() => {navigation.push('AICallBox')}} style={{}}><Icon type="FontAwesome" name="phone" size={40} color={colors.green} /></TouchableOpacity>)
                )
            }} />
            <LinearGradient colors={["#fff","#e8e9f5","#fff","#F6BDA7"]} style={styles.footerStyle}>
                <View style={styles.ProfileFooterHeader}>
                    <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                        <FontAwesome name="ellipsis-h" color="#63acfa" size={36}></FontAwesome>
                    </View>
                    <Stats data={{activeProfile,profileOwner}} />
                </View>
                <RequestBtns data={{activeProfile,profileOwner,accountInfo}} />
                <Photos data={{activeProfile,profileOwner}} />
                <About data={{activeProfile,profileOwner}} />
                {profileOwner &&
                    <View style={{alignItems:'center',marginTop:5,paddingTop:10}}>
                        <Text style={{fontFamily:'fontBold',textAlign:'center',fontSize:12}}>Join Smarth ealth As A doctor</Text>
                        <TouchableOpacity onPress={() => navigation.push("CreateBusiness")}>
                            <Icon name='add-circle-outline' type="Ionicons" size={72} color="green" />
                        </TouchableOpacity>
                    </View>
                }
            </LinearGradient>
        </View>
    )
};
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30,
        marginTop:-70
    },
    ProfileFooterHeader:{
        backgroundColor:'#fff',borderTopLeftRadius: 30, borderTopRightRadius: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 1,
        borderBottomWidth:1,
        borderBottomColor:'#63acfa'
    },
});

/**
 * RTK query
 * Restyle
 * rn-nodefy
 * react-native crypto
 * React-navigation
 */