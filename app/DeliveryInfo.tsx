import {Dimensions, ScrollView, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TextArea from '../components/ui/TextArea';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import useCart from '../hooks/useCart';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import { AddressButton } from '../components/ui/Button';
import { LocationType } from '../constants/Types';
import { showToast } from '../helpers/methods';

export default function DeliveryInfo() {
    const {height,width} = Dimensions.get("screen");
    const dispatch = useDispatch();
    const router = useRouter();

    const {handleCartAction,cartItems,selectedPharmacy,total,handlePurchase,formData,handleChange} = useCart();
    return (
        <View style={{flex: 1,padding:20,paddingBottom:100}}>
            <StatusBar style='light' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{color:'#757575',fontFamily:'fontLight',fontSize:12}}>Phone number</Text>
                <View style={{gap:12}}>
                    <TextArea attr={{field:'phoneNumber',value:formData.phoneNumber,icon:{name:'phone',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'Enter your contact number',color:'#009387',handleChange}} />
                    <TextArea attr={{field:'otherNumber',icon:{name:'phone',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'Alternative number',color:'#009387',handleChange}} />
                    <AddressButton handleBtnClick={(value:LocationType) => handleChange("address",value as any)} />
                    <TextArea attr={{field:'notes',multiline:true,icon:{name:'list',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Additional notes',color:'#009387',handleChange}} />
                </View>
            </ScrollView>
            <View style={{paddingHorizontal:30,height:60,flex:1,flexDirection:'row',justifyContent:'center',position:'absolute',bottom:0,width:width,backgroundColor:colors.faintGray}}>
                <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:'green',fontSize:20}}>R{total?.toFixed(2)}</Text></View>
                <View style={{justifyContent:'center'}}>
                    <TouchableOpacity onPress={() => {
                        if(formData.address !== ""){
                            if(formData.phoneNumber !== ""){
                                dispatch(setConfirmDialog({isVisible: true,text: `You are about to purchase medication for R${total.toFixed(2)}, The total amount will be deducted from your wallet balance\nIf you don't have this amount in your wallet, please load your wallet to proceed!\n\nYour delivery address is ${formData.address.text}\n\nTo continue please press the PROCEED button`,okayBtn: 'PROCEED',cancelBtn: 'Cancel',severity: true,response: async(res:boolean) => {
                                    if (res) {
                                        handlePurchase();
                                    }
                                }}));
                            }else{
                                showToast('Please enter a valid phone number')
                            }
                        }else{
                            showToast('Please select your delivery address')
                        }
                    }} disabled = {cartItems?.length === 0} style={{backgroundColor: cartItems?.length > 0 ?colors.green : 'tomato',padding:15,borderRadius:5}}>
                        <Text style={{fontFamily:'fontLight',fontSize:12,color:'white'}}>PROCEED TO CHECKOUT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    header: {
      backgroundColor: 'blue',
      padding: 15,
    },
    headerText: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
    },
    container: {
      flexDirection: 'row',
    },
    pharmacyList: {
      flex: 1,
    },
    pharmacyCard: {
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      width: 180,
      alignItems: 'center',
      elevation:100,
      shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
    },
    cardImage: {
      width: 165,
      height: 100,
      borderWidth:5,
      borderColor:'#FFAEA2',
      borderRadius: 10,
    },
    cardTitle: {
      fontSize: 12,
      fontFamily:'fontBold',
      alignSelf:'flex-start'
    },
    productList: {
      flex: 2,
      padding: 10,
    },
    productCard: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: colors.white,
      borderRadius: 10,
      width:'48%',
      elevation:100,
      shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
    },
    productImage: {
      width: '100%',
      height: 120,
      borderRadius: 10,
      borderWidth:2,
      borderColor:'#FFAEA2',
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });