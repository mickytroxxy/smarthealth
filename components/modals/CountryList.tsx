import React, { memo, useCallback, useState } from 'react'
import { View, TouchableOpacity,Platform, Text,ScrollView, FlatList } from 'react-native'
import { countries } from '../../constants/countries';
import TextArea from '../ui/TextArea';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { setCountryData } from '../../state/slices/location';
import { colors } from '../../constants/Colors';
const CountryList = memo(() => {
    const [filteredList,setFilteredList] = useState(countries);
    const dispatch = useDispatch();
    const router = useRouter();
    const handleChange = useCallback((field:string,value:string) => {
        value.length > 2 ? setFilteredList(countries.filter(country => country.name.toUpperCase().includes(value.toUpperCase()))) : setFilteredList(countries)
    },[])
    return (
        <View style={{padding:10}}>
            <TextArea attr={{field:'search',icon:{name:'search',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Search...',color:'#009387',handleChange}} />
            <View style={{marginTop:10}}>
                <FlatList
                    data={filteredList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                        return(
                            <TouchableOpacity key={item.dialCode + index} onPress={()=>{
                                dispatch(setCountryData({name:item.name,dialCode:item.dialCode,flag:item.flag}))
                                router.back();
                            }} style={{backgroundColor:colors.faintGray,padding:12,borderRadius:5,flexDirection:'row',marginBottom:5}}>
                                <Text style={{flex:1,marginLeft:10,fontFamily:'fontBold',bottom:2}}>{item.dialCode}</Text>
                                <Text style={{fontFamily:'fontLight',bottom:2}}>{item.name.slice(0,36)}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>
    )
})

export default CountryList