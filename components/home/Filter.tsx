import 'react-native-gesture-handler';
import { Text, View, StyleSheet, Image, ScrollView,TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialIcons,FontAwesome, Foundation } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { memo, useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants'
import * as Animatable from 'react-native-animatable';
import { colors } from '../../constants/Colors';
import { Button } from '../ui/Button';
import { useRouter } from 'expo-router';
import { setActiveUser } from '../../state/slices/users';
import Icon from '../ui/Icon';
import { Notifications, registerForPushNotificationsAsync, showToast } from '../../helpers/methods';
import useMessages from '../../hooks/useMessages';
import { GamblingItemsType } from '../../constants/Types';
import { getMyWins } from '../../helpers/api';
import { setModalState } from '../../state/slices/modalState';
import useGames from '../../hooks/useGames';

const Filter = () =>{
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const {packages} = useSelector((state: RootState) => state.game);
    const {unSeenMessages} = useMessages();
    const {getMyWonPackages} = useGames();
    const dispatch = useDispatch();
    const router = useRouter();
    const requestPreference = [
        { category: 'ANY', selected: true },
        { category: 'GENERAL PRACTITIONER', selected: false },
        { category: 'PEDIATRICIAN', selected: false },
        { category: 'GYNECOLOGIST', selected: false },
        { category: 'SURGEON', selected: false },
        { category: 'CARDIOLOGIST', selected: false },
        { category: 'DERMATOLOGIST', selected: false },
        { category: 'ORTHOPEDIC SURGEON', selected: false },
        { category: 'NEUROLOGIST', selected: false },
        { category: 'PSYCHIATRIST', selected: false },
        { category: 'ANESTHESIOLOGIST', selected: false },
        { category: 'RADIOLOGIST', selected: false },
        { category: 'OPHTHALMOLOGIST', selected: false },
        { category: 'ENT SPECIALIST', selected: false },
        { category: 'UROLOGIST', selected: false },
        { category: 'ENDOCRINOLOGIST', selected: false },
        { category: 'GASTROENTEROLOGIST', selected: false },
        { category: 'NEPHROLOGIST', selected: false },
        { category: 'RHEUMATOLOGIST', selected: false }
    ];
    const [preferenceTypes,setPreferenceTypes] = useState(requestPreference)

    const [mainCategories,setMainCategories] = useState([{category:'REQUEST',selected:true},{category:'PHARMACY',selected:false}])
    const mainCategory = mainCategories.filter(item => item.selected === true)[0].category;

    const notificationListener:any = useRef();
    const responseListener:any = useRef();
    
    useEffect(() => {
        getMyWonPackages();
        registerForPushNotificationsAsync(accountInfo?.clientId);
        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    },[])
    return(
        <View style={{position:'absolute',width:'100%',zIndex:1000,padding:10,top: Constants.statusBarHeight}}>
            <View style={Platform.OS === 'ios' ? styles.interestViewIos : styles.interestView}>
                <LinearGradient colors={["#f9f1ed","#f3f9fe","#faf8fa","#f7f3d0"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{backgroundColor:'#f9f1ed',justifyContent:'center',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                    <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around'}}>
                        <View style={{flex:1}}>
                            <Button 
                                btnInfo={{styles:{borderRadius:5,borderColor:colors.orange,width:'99%',backgroundColor:'#F9B030',padding:5}}} 
                                textInfo={{text:'DOCTORS',color: colors.white}} 
                                iconInfo={{type: 'MaterialIcons', name: 'location-history',color:colors.white,size:30}}
                                handleBtnClick={() => {}}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <Button 
                                btnInfo={{styles:{borderRadius:5,borderColor:colors.orange,width:'99%',backgroundColor:colors.white,padding:5}}} 
                                textInfo={{text:'PHARMACIES',color: '#F9B030'}} 
                                iconInfo={{type: 'Foundation', name: 'social-game-center',color:'#F9B030',size:30}}
                                handleBtnClick={() => {router.push('Pharmacy')}}
                            />
                        </View>
                    </View>
                </LinearGradient>
                <View style={{flexDirection:'row'}}>
                    <View style={{width:50,backgroundColor:'#fff',justifyContent:'center',alignContent:'center',alignItems:'center',borderRadius:10}}>
                        {unSeenMessages.length > 0 && <Text style={{position:'absolute',right:2,top:5,fontFamily:'fontBold',color:colors.tomato}}>{unSeenMessages.length}</Text>}
                        <TouchableOpacity onPress={() => {
                            dispatch(setActiveUser(accountInfo));
                            router.push("MessageList");
                        }}>
                            <Icon type='Ionicons' name='chatbubble-ellipses-outline' size={40} color='#63acfa'/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,padding:10}}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                               preferenceTypes.map((item,i)=>(
                                    <View key={i} style={{height:40,width:240,borderRadius:5,overflow:'hidden',marginRight:10}}>
                                        <LinearGradient colors={["#e44528","#63acfa","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:240,height:40,alignItems:'center',justifyContent:'center'}}>  
                                            <TouchableOpacity onPress={() => {
                                                setPreferenceTypes(preferenceTypes.map(data => data.category === item.category ? {...data,selected:true} : {...data,selected:false}))
                                            }} style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:item.selected ? '#FECE79' : '#fff',height:38,width:238,borderRadius:5,display:'flex',flexDirection:'row'}}>
                                                {mainCategory === 'REQUEST' && <FontAwesome name="heart" size={18} color={item.selected ? "#fff" : "#f9896d"} />}
                                                {mainCategory === 'PLAY & WIN' && <Foundation name="social-game-center" size={24} color={item.selected ? "#fff" : "#63acfa"} />}
                                                <Text numberOfLines={1} style={{fontFamily:'fontBold',color:item.selected ? "#fff" : "#757575"}}> {item.category}</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            </View>
            <Animatable.View animation="zoomIn" duration={2000} useNativeDriver={true} style={{position:'absolute',left:10,top:'120%',backgroundColor:'rgba(0, 0, 0, 0.5)',borderTopRightRadius:30,borderBottomLeftRadius:30,alignItems:'center',padding:5,paddingBottom:30}}>
                <TouchableOpacity onPress={() => {
                    dispatch(setActiveUser(accountInfo));
                    router.push("Profile");
                }} style={{backgroundColor:"#63acfa",borderRadius:100,height: Platform.OS === 'ios' ? 75 : 65,width:Platform.OS === 'ios' ? 75 : 65,justifyContent:'center',alignItems:'center'}}>
                    {accountInfo?.avatar === "" && <Icon type='EvilIcons' name='user' size={Platform.OS === 'ios' ? 75 : 65} color={colors.white}/>}
                    {accountInfo?.avatar !== "" && <Image source={{uri:accountInfo?.avatar}} style={{width:Platform.OS === 'ios' ? 65 : 55,height:Platform.OS === 'ios' ? 65 : 55,borderRadius:100}} />}
                </TouchableOpacity>
            </Animatable.View>
            
        </View>
    )
};
const styles = StyleSheet.create({
    interestView:{
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        borderTopLeftRadius:10,borderTopRightRadius:10,
        elevation: Platform.OS === 'ios' ? 0 : 30,
    },
    interestViewIos:{
        backgroundColor: '#fff',
        borderTopLeftRadius:10,borderTopRightRadius:10,
        borderColor:'#F9B030',
        borderWidth:1
        
    },
    interestListItem:{
        justifyContent:'center',alignContent:'center',
        alignItems:'center',marginLeft:10,marginRight:10,
        padding:7,backgroundColor:'pink',
        borderRadius:30,display:'flex',flexDirection:'row'
    },
    lowerInterestList:{
        height:10,
        width:'100%',borderTopRightRadius:30,
        borderTopLeftRadius:30,

        borderTopWidth:0.5,
        borderRightWidth:0.7,
        borderLeftWidth:0.7,
        borderTopColor:'#dcdbd8',
        borderLeftColor:'#dcdbd8',
        borderRightColor:'#dcdbd8',
    }
});
export default memo(Filter);
