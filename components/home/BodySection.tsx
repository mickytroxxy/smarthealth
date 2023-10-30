import { ScrollView, TouchableOpacity, View, Text, StyleSheet, TouchableHighlight, Image, Platform, Button } from "react-native";
import { colors } from "../../constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import Icon from "../ui/Icon";
import { useEffect, useState } from "react";
import { LocationType, PrivacyType } from "../../constants/Types";
import useUsers from "../../hooks/useUsers";
import { getDistance } from "../../helpers/methods";
import { AddressButton } from "../ui/Button";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../state/slices/users";
import { getGeoPoint, updateData } from "../../helpers/api";
import UserList from "./UserList";
import useAudioRecording from "../../hooks/useAudioRecording";
export const BodySection = () =>{
    const navigation = useRouter();
    const {location,users,getServiceProviders,usersError,accountInfo} = useUsers();
    const handleBtnClick = (value:LocationType) => {
        getServiceProviders(value.latitude,value.longitude,250)
    };
    const {
        recording,
        isRecording,
        startRecording,
        stopRecording,
        onWhisperTranscribe,
      } = useAudioRecording();
    const [privacy,setPrivacy] = useState<PrivacyType[]>([
        {type:'CAN VISIT THE CLIENT',selected:true},
        {type:'CLIENT CAN VISIT',selected:true},
        {type:'CAN MEET AT HOTELS',selected:true},
        {type:'ALLOW CASH PAYMENT',selected:true},
        {type:'ALLOW CARD PAYMENT',selected:false},
    ]);
    useEffect(() => {
        // const geoHash = getGeoPoint(location.latitude,location.longitude);
        //users.map((user) => updateData("users",user.clientId || '',{field:'deleted',value:false}))
    },[])
    return(
        <LinearGradient colors={["#fff","#e8e9f5","#fff","#F6BDA7"]} style={styles.footerStyle}>
            <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                <TouchableHighlight style={{alignSelf:'center',backgroundColor:'#fff',height:30,elevation:0}} >
                    <Icon type="FontAwesome" name="ellipsis-h" color="#757575" size={30} />
                </TouchableHighlight>
            </View>
            {/* <Button
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
                onPress={isRecording ? stopRecording : startRecording}
            />
            {!recording && (
                <Button title="Play" onPress={onWhisperTranscribe} />
            )}
            {recording && <Text>Recording in progress...</Text>} */}
            <View style={{padding:5}}>
                <Text style={{fontFamily:'fontLight',fontSize:13,color:'#353434'}}>We Have Professional Doctors For You.</Text>
                <Text style={{fontFamily:'fontBold',fontSize:Platform.OS === 'android' ? 14 : 16,color:'#05375a',marginTop:10,}}>And Our Highly Trained AI Doctors</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10}}>
                <TouchableOpacity onPress={() => navigation.push({pathname:"RequestScreen",params:{}})} style={{backgroundColor : "#fff",width:'100%',borderRadius:10,padding:15,borderColor:'#63acfa',borderWidth:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontFamily:'fontBold',color:"#63acfa",fontSize:13,flex:1}}>BOOK AN APPOINTMENT NOW</Text>
                    <Icon type="FontAwesome5" name="running" color="orange" size={24} />
                </TouchableOpacity>
            </View>
            <AddressButton handleBtnClick={handleBtnClick} />
            <UserList from="main"/>
        </LinearGradient>
    )
};
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        padding: 10,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginTop:-30,
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30
    },
});