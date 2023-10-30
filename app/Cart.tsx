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

export default function Cart() {
    const {height,width} = Dimensions.get("screen");
    const router = useRouter();
    const dispatch = useDispatch();
    const {handleCartAction,cartItems,selectedPharmacy,total,setPharmacies} = useCart();
    return (
        <View style={{flex: 1,padding:20,paddingBottom:100}}>
            <StatusBar style='light' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={{color:'green',fontFamily:'fontBold',fontSize:12,textAlign:'center'}}>REVIEW YOUR CART ITEMS</Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:12}}>
                        {cartItems?.length > 0 ? cartItems?.map((product,i:number) => 
                            <View style={styles.productCard} key={i}>
                                <Image style={styles.productImage} source={{ uri: product.image as any }} />
                                <Text numberOfLines={1} style={styles.cardTitle}>{product.product_name}</Text>
                                <Text numberOfLines={3} style={{fontFamily:'fontLight',alignSelf:'flex-start'}}>{product.description}</Text>
                                <View style={{flexDirection:'row',marginTop:6}}>
                                    <View style={{justifyContent:'center',flex:1}}><Text numberOfLines={1} style={{fontFamily:'fontBold',alignSelf:'flex-start',color:'green'}}>R{product.price} * {product.quantity}</Text></View>
                                    <TouchableOpacity onPress={() => handleCartAction(product,'remove')} style={{marginRight:10}}><Icon name='minuscircleo' type='AntDesign' size={30} color='tomato'/></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleCartAction(product,'add')}><Icon name='pluscircleo' type='AntDesign' size={30} color='green'/></TouchableOpacity>
                                </View>
                            </View>
                        ):
                            <View style={{flex:1,justifyContent:'center',marginTop:350}}><Text style={{color:'tomato',fontFamily:'fontBold',fontSize:12,textAlign:'center'}}>You have no items in your cart!</Text></View>
                        }
                    </View>
                </View>
                <View style={{alignItems:'center',marginTop:30}}><TouchableOpacity onPress={() => router.push('Pharmacy')}><Icon name='add-circle' type='MaterialIcons' size={66} color='green'/></TouchableOpacity></View>
            </ScrollView>
            <View style={{paddingHorizontal:30,height:60,flex:1,flexDirection:'row',justifyContent:'center',position:'absolute',bottom:0,width:width,backgroundColor:colors.faintGray}}>
                <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:'green',fontSize:20}}>R{total?.toFixed(2)}</Text></View>
                <View style={{justifyContent:'center'}}>
                    <TouchableOpacity onPress={() => router.push('DeliveryInfo')} disabled = {cartItems?.length === 0} style={{backgroundColor: cartItems?.length > 0 ?colors.green : 'tomato',padding:15,borderRadius:5}}>
                        <Text style={{fontFamily:'fontLight',fontSize:12,color:'white'}}>CONTINUE</Text>
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




