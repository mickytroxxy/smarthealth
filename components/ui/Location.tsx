import React, { memo, useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import axios from 'axios';
import TextArea from './TextArea';
import useLocation from '../../hooks/useLocation';
import Icon from './Icon';
import { useDispatch } from 'react-redux';
import { setConfirmDialog } from '../../state/slices/ConfirmDialog';
import { setModalState } from '../../state/slices/modalState';

const Location = memo((props:any) => {
    const {locationWithText} = useLocation();
    const {attr:{cb,placeHolder,field}} : any = props;
    const dispatch = useDispatch();
    const [predictions, setPredictions] = useState<{ predictionsArray: any[] | null, showPredictions: boolean }>({
        predictionsArray: null,
        showPredictions: false,
    });
    const {showPredictions,predictionsArray} = predictions;
    const handleChange = (field:string,key_word:string) => {
        if(key_word.length > 2){
            const {latitude,longitude} = locationWithText;
            axios.request({method: 'post',url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyB_Yfjca_o4Te7-4Lcgi7s7eTjrmer5g5Y&input=${key_word}&location=${latitude},${longitude}&radius=1000000`}).then((response) => {
                setPredictions({...predictions, predictionsArray:response.data.predictions,showPredictions:true});
            }).catch((e) => {
                alert(e.response);
            });
        }else{
            setPredictions({...predictions, predictionsArray:null,showPredictions:false});
        }
    };
    const getPlaceGeo = (place_id:string,text:string) =>{
        setPredictions({...predictions, predictionsArray:null,showPredictions:false});
        axios.request({method: 'post',url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=AIzaSyB_Yfjca_o4Te7-4Lcgi7s7eTjrmer5g5Y`,}).then((response) => {
            const {lat,lng} = response.data.result.geometry.location;
            cb(field,{latitude:lat,longitude:lng,text});
            dispatch(setModalState({isVisible:false}));
        }).catch((e) => {
            alert(e);
        });
    }
    const getCurrentLocation = () => {
        const showModal = () => {
            const {text,longitude,latitude} = locationWithText;
            dispatch(setConfirmDialog({isVisible:true,text:`Confirm if ${text} is the address you would like to meet!`,okayBtn:'CONFIRM',cancelBtn:'Retry',response:(res:boolean) => { 
                if(res){
                    cb(field,{latitude,longitude,text})
                    Platform.OS !=='ios' && dispatch(setModalState({isVisible:false}));
                }else{
                    getCurrentLocation();
                }
            }}))
        }
        if(Platform.OS === 'ios'){
            dispatch(setModalState({isVisible:false}))
            setTimeout(() => {
                showModal();
            }, 100);
        }else{
            showModal()
        }
    }
    return (
        <View style={{padding:10}}>
            <TextArea attr={{field:'address',icon:{name:'location-outline',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:'default',placeholder:placeHolder,color:'#009387',handleChange}} />
            <View style={{marginTop:15}}>
                <TouchableOpacity onPress={() => getCurrentLocation()} style={{marginTop:5,flexDirection:'row',borderBottomWidth:0.6,borderBottomColor:'#D9D9DF',paddingBottom:7}}>
                    <Icon name='ios-location-outline' size={24} color='green' type='Ionicons' />
                    <Text numberOfLines={1} style={{fontFamily:'fontBold',marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14,marginTop:5}}>GET CURRENT LOCATION</Text>
                </TouchableOpacity>
                {showPredictions && predictionsArray?.map((item:any,i:number) => 
                    <TouchableOpacity key={i} onPress={() => getPlaceGeo(item.place_id,item.description.slice(0,70))} style={{marginTop:5,flexDirection:'row',borderBottomWidth:0.6,borderBottomColor:'#D9D9DF',paddingBottom:7}}>
                        <Icon name='ios-location-outline' size={24} color='green' type='Ionicons' />
                        <Text numberOfLines={1} style={{fontFamily:'fontLight',marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14,marginTop:5}}>{item.description.slice(0,60)}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
})

export default Location