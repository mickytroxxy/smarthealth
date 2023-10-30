import {Dimensions, ScrollView, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TextArea from '../components/ui/TextArea';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import useCart from '../hooks/useCart';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';

export default function Pharmacy() {
    const {width} = Dimensions.get("screen");
    const router = useRouter()
    const dispatch = useDispatch();
    const {pharmacies,uniqueCategories,products,handleCartAction,cartItems,selectedPharmacy,total,setPharmacies} = useCart();
    return (
        <View style={{flex: 1,padding:20,paddingBottom:100}}>
            <StatusBar style='light' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={{color:'#FFAEA2',fontFamily:'fontBold',fontSize:16}}>NEAR BY PHARMACIES</Text>
                    <View>
                        <TextArea attr={{field:'money',icon:{name:'search',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'numeric',placeholder:'Search for pharmacies...',color:'#009387',handleChange:(field:any,value:any) => {
                            
                        }}} />
                    </View>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                        <View style={{gap:10,flexDirection:'row',paddingVertical:10}}>
                            {pharmacies?.map((pharmacy,i:number) => 
                                <TouchableOpacity key={i} style={styles.pharmacyCard} onPress={() => dispatch(setPharmacies(pharmacies.map(item => item.id === pharmacy.id ? {...item,selected:true} : {...item,selected:false})))}>
                                    <Image style={styles.cardImage} source={{ uri: pharmacy.image }} />
                                    <Text numberOfLines={1} style={styles.cardTitle}>{pharmacy.name}</Text>
                                    <Text numberOfLines={1} style={{fontFamily:'fontLight',alignSelf:'flex-start',color:'green'}}>{`Distance: ${pharmacy.distance_km} km`}</Text>
                                    <Text numberOfLines={2} style={{fontFamily:'fontLight',alignSelf:'flex-start'}}>{pharmacy.description}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </View>
                <View>
                    <LinearGradient colors={["#FFAEA2","#f3f9fe","#faf8fa","#f7f3d0"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{backgroundColor:'#f9f1ed',elevation:20,justifyContent:'center',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{justifyContent:'center'}}>
                                <Icon name='local-pharmacy' type='MaterialIcons' size={90} color={colors.primary} />
                            </View>
                            <View style={{flex:1,marginLeft:12,justifyContent:'center'}}>
                                <Text style={{fontFamily:'fontBold'}}>{selectedPharmacy?.name.toUpperCase()}</Text>
                                <Text style={{fontFamily:'fontBold'}}>{selectedPharmacy?.distance_km}km away</Text>
                                <Text style={{fontFamily:'fontLight'}} numberOfLines={1}>{selectedPharmacy?.description}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                    <View style={{marginTop:12}}>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                            <View style={{gap:10,flexDirection:'row'}}>
                                {uniqueCategories?.map((item,i) => 
                                    <TouchableOpacity key={i} style={{padding:12,borderColor:'#FFAEA2',borderWidth:2,borderRadius:30}}>
                                        <Text style={{fontFamily:'fontBold',color:colors.primary,fontSize:11}}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:12}}>
                        {products?.map((product,i:number) => 
                            <View style={styles.productCard} key={i}>
                                <Image style={styles.productImage} source={{ uri: product.image as any }} />
                                <Text numberOfLines={1} style={styles.cardTitle}>{product.product_name}</Text>
                                <Text numberOfLines={3} style={{fontFamily:'fontLight',alignSelf:'flex-start'}}>{product.description}</Text>
                                <View style={{flexDirection:'row',marginTop:6}}>
                                    <View style={{justifyContent:'center',flex:1}}><Text numberOfLines={1} style={{fontFamily:'fontBold',alignSelf:'flex-start',color:'green'}}>R{product.price}</Text></View>
                                    <TouchableOpacity onPress={() => handleCartAction(product,'remove')} style={{marginRight:10}}><Icon name='minuscircleo' type='AntDesign' size={30} color='tomato'/></TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleCartAction(product,'add')}><Icon name='pluscircleo' type='AntDesign' size={30} color='green'/></TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={{paddingHorizontal:30,height:60,flex:1,flexDirection:'row',justifyContent:'center',position:'absolute',bottom:0,width:width,backgroundColor:colors.faintGray}}>
                <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:'green',fontSize:20}}>R{total?.toFixed(2)}</Text></View>
                <View style={{justifyContent:'center'}}>
                    <TouchableOpacity onPress={() => router.push('Cart')} disabled = {cartItems?.length === 0} style={{backgroundColor: cartItems?.length > 0 ?colors.green : 'tomato',padding:15,borderRadius:5}}>
                        <Text style={{fontFamily:'fontLight',fontSize:12,color:'white'}}>MY CART</Text>
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
      fontSize: 16,
      fontFamily:'fontBold',
      color:'white',
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




