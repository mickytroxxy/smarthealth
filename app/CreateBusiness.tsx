
import React, {useState } from "react";
import { StyleSheet, View,ScrollView,TouchableOpacity,Text} from "react-native";
import {AntDesign, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import {TouchableRipple,Switch} from 'react-native-paper';
import { RadioButton } from 'react-native-paper';
import TextArea from "../components/ui/TextArea";
import CountrySelector from "../components/ui/CountrySelector";
import { showToast } from "../helpers/methods";
import { BusinessServicesType, LocationType, PrivacyType } from "../constants/Types";
import { useDispatch } from "react-redux";
import { setModalState } from "../state/slices/modalState";
import { Stack } from "expo-router";
import { colors } from "../constants/Colors";
import { AddressButton } from "../components/ui/Button";
import useAuth from "../hooks/useAuth";

const CreateBusiness = () =>{
    const dispatch = useDispatch();
    const {createServiceProviderAccount,accountInfo} = useAuth();
    const [isSelf,setIsSelf] = useState(true);
    const [formData,setFormData] = useState({phoneNumber:'',practitionerNumber:'',fname:'',gender:'MALE',password:''});

    const [businessServices,setBusinessServices] = useState<BusinessServicesType[]>([
        { type: 'ANY', selected: true },
        { type: 'GENERAL PRACTITIONER', selected: false },
        { type: 'PEDIATRICIAN', selected: false },
        { type: 'GYNECOLOGIST', selected: false },
        { type: 'SURGEON', selected: false },
        { type: 'CARDIOLOGIST', selected: false },
        { type: 'DERMATOLOGIST', selected: false },
        { type: 'ORTHOPEDIC SURGEON', selected: false },
        { type: 'NEUROLOGIST', selected: false },
        { type: 'PSYCHIATRIST', selected: false },
        { type: 'ANESTHESIOLOGIST', selected: false },
        { type: 'RADIOLOGIST', selected: false },
        { type: 'OPHTHALMOLOGIST', selected: false },
        { type: 'ENT SPECIALIST', selected: false },
        { type: 'UROLOGIST', selected: false },
        { type: 'ENDOCRINOLOGIST', selected: false },
        { type: 'GASTROENTEROLOGIST', selected: false },
        { type: 'NEPHROLOGIST', selected: false },
        { type: 'RHEUMATOLOGIST', selected: false }
    ]);
    const [privacy,setPrivacy] = useState<PrivacyType[]>([
        {type:'CAN VISIT THE PATIENT',selected:true},
        {type:'THE PATIENT CAN VISIT',selected:true},
        {type:'ALLOW CASH PAYMENT',selected:true},
        {type:'ALLOW CARD PAYMENT',selected:true},
    ]);

    const updatePrices = (service:any,fees:any) => setBusinessServices(businessServices.map(item => item.type === service ? {...item,fees} : {...item,fees:null}))
    const handlePrivacy = (data:PrivacyType) => setPrivacy(privacy.map(item => item.type === data.type ? {...item,selected:!data.selected} : item))
    const handleChange = (field:string, value:string | LocationType) => setFormData(v =>({...v, [field] : value}));
    const createAccount = () => {
        const services = businessServices.filter(item => item?.fees);
        if(services.length > 0 && formData.practitionerNumber !== ''){
            const data = {...formData,gender:(isSelf ? accountInfo.gender : formData.gender),services,privacy}
            createServiceProviderAccount(data,isSelf)
        }else{
            showToast("Select at least one service to proceed")
        }
    }
    return(
        <View style={styles.container}>
            <Stack.Screen options={{title: "CREATE DOCTORS ACCOUNT", headerTitleStyle:{fontFamily:'fontBold',fontSize:12} }} />
            <LinearGradient colors={["#fff","#fff","#fff","#f1f7fa"]} style={{flex:1,paddingTop:10,borderRadius:10,padding:10}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{backgroundColor:'#eae6e8',borderRadius:5,marginTop:20,marginBottom:20,padding:20}}><Text style={{fontFamily:'fontBold',color:'#0e75b4',fontSize:11}}>CREATE A doctors ACCOUNT</Text></View>
                    <Text style={{fontFamily:'fontBold',marginBottom:15}}>When registering as a doctor, you will be required to perform the services you select below. You have the opportunity to state your rate per hour. This entire process takes less than 5 minutes.</Text>
                    <Text style={{fontFamily:'fontBold',marginBottom:15,color:'orange'}}>NOTE: We will add 15% on top of your charges and that will be our commission</Text>

                    <View style={{marginTop:15}}>
                        <Text style={{fontFamily:'fontBold',color:'#757575'}}>What Would You Like To Offer?</Text>
                        <View style={{marginTop:15,flexDirection:'row',display: 'flex',flexWrap: 'wrap'}}>
                            {businessServices?.map((item,i) => {
                                if(item.type !== "ANY"){
                                    return(
                                        <TouchableOpacity onPress={() => dispatch(setModalState({isVisible:true,attr:{headerText:'SETUP YOUR RATES',service:item.type,updatePrices}}))} key={item.type + i} style={{flexDirection:'row',padding:6,borderRadius:10,borderWidth:1,borderColor:item.fees ? "green" : "#757575",justifyContent:'center',alignItems:'center',margin:10}}>
                                            <Text style={{fontFamily:'fontLight',fontSize:11,marginRight:5}}>{item.type}</Text>
                                            {item.fees ? <AntDesign name='checkcircleo' color="green" size={20} /> : <AntDesign name='closecircleo' color="tomato" size={20} />}
                                        </TouchableOpacity>
                                    )
                                }
                            })}
                        </View>
                    </View>
                    <View style={{marginTop:15}}>
                        <TextArea attr={{field:'practitionerNumber',icon:{name:'list' ,type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder: 'What`s your practitioner number?',color:'#009387',handleChange}} />
                        <AddressButton placeholder='What`s your work address?' handleBtnClick={(value:LocationType) => handleChange('address',value)} />
                    </View>
                    <View style={{marginTop:30}}>
                        <Text style={{fontFamily:'fontBold',color:'#757575',marginBottom:30}}>Privacy & Rules</Text>
                        {privacy?.map((item,i) => (
                            <View key={item.type + i} style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                                <View style={{width:30,justifyContent:'center'}}>
                                    <AntDesign name="Safety" size={30} color="#0e75b4"/>
                                </View>
                                <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                                    <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:11}}>{item.type}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                    <TouchableRipple onPress={() => handlePrivacy(item)}>
                                        <View>
                                            <View pointerEvents="none">
                                                <Switch value={item.selected} color={colors.green} />
                                            </View>
                                        </View>
                                    </TouchableRipple>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={{alignItems:'center',marginTop:15}}>
                        <TouchableOpacity onPress={createAccount}>
                            <FontAwesome name='check-circle' size={120} color="#14678B"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    )
};

export default CreateBusiness;
const styles = StyleSheet.create({
    searchInputHolder:{
        height:40,
        borderRadius:10,
        flexDirection:'row',
        borderWidth:0.5,
        borderColor:'#a8a6a5'
    },
    container: {
        flex: 1,
        backgroundColor: "blue",
        marginTop:5,
        borderRadius:10,
        elevation:5
    },
    myBubble:{
        backgroundColor:'#7ab6e6',
        padding:5,
        minWidth:100,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});