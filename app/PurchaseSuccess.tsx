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

export default function PurchaseSuccess() {
    const {height,width} = Dimensions.get("screen");
    const dispatch = useDispatch();
    const router = useRouter();
    const {handleCartAction,cartItems,selectedPharmacy,total,setPharmacies,formData,handleChange} = useCart();
    return (
        <View style={{flex: 1,padding:20,paddingBottom:100,alignItems:'center',justifyContent:'center'}}>
            <StatusBar style='light' />
            <Icon name='check-circle' type='Feather' color='green' size={220} />
            <Text style={{marginTop:30,fontFamily:'fontBold',color:colors.grey}}>Your purchase has been received and your medication is being processed! Thank you</Text>
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