import React, { memo, useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesome} from "@expo/vector-icons";
import TextArea from '../ui/TextArea';
import { FeesType } from '../../constants/Types';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../state/slices/modalState';
import { showToast } from '../../helpers/methods';
type PriceTypeProps = {
    attr:{
        updatePrices:any;
        service:string;
        fees?:any;
    }
}
const Prices = memo((props:PriceTypeProps) => {
    const {updatePrices,service,fees} = props.attr;
    const dispatch = useDispatch();
    const [formData,setFormData] = useState<FeesType[]>([
        {type:'HOURLY',fee:0,name:'HOURS'}
    ]);
    const handleChange = (field:string,value:number | any) => {
        setFormData(formData.map(item => item.type === field ? {...item,fee:value} : item))
    };
    useEffect(() => {
        if(fees){setFormData(fees)}
    },[])
    return (
        <View>
            <View>
                <Text style={{fontFamily:'fontBold',color:'#757575',marginLeft:25,marginTop:15}}>SETUP YOUR {service} RATE</Text>
                <View style={{padding:20}}>
                    <Text style={{fontFamily:'fontLight',fontSize:11,top:8}}>Hourly Rate</Text>
                    <TextArea attr={{field:'HOURLY',icon:{name:'money',type:'MaterialIcons',min:5,color:'#5586cc'},value:formData[0].fee.toString(),keyboardType:'numeric',placeholder:'YOUR HOURLY RATE',color:'#009387',handleChange}} />
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>{
                            if(formData[0].fee){
                                dispatch(setModalState({isVisible:false}));
                                updatePrices(service,formData.map(item => item.fee === '' ? {...item,fee:0} : {...item,fee:parseFloat(item.fee.toString())  * 1.15}));
                            }else{
                                showToast("Hourly rate is required")
                            }
                        }}>
                            <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
})

export default Prices