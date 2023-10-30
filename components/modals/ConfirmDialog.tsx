import React, { memo } from "react";
import { StyleSheet, Text, View, Modal , TouchableOpacity} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmDialog } from '../../state/slices/ConfirmDialog';
import { colors } from '../../constants/Colors';
import { RootState } from "../../state/store";

const ConfirmDialog = () => {
    const confirmDialog = useSelector((state: RootState) => state.ConfirmDialog);
    const dispatch = useDispatch()
    return(
        <Modal animationType="slide" transparent={true} visible={confirmDialog.isVisible} onRequestClose={() => {dispatch(setConfirmDialog({isVisible:false}))}}>
            <View style={{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor: 'rgba(52, 52, 52, 0.5)'}}>
                <View style={styles.centeredView}>
                    <Text style={{fontFamily:'fontLight',fontSize:15}}>{confirmDialog.text}</Text>
                    <View style={{flexDirection:'row',borderTopWidth:0.7,marginTop:15,paddingTop:10,borderTopColor:'#AFB1B1'}}>
                        <View style={{width:'50%',alignContent:'center',alignItems:'center'}}>
                            <TouchableOpacity onPress={() => {
                                dispatch(setConfirmDialog({isVisible:false}))
                                confirmDialog.response(false)
                            }} style={{padding:15,borderRadius:10,borderWidth:1,borderColor:confirmDialog.severity ? 'orange' : '#0e75b3'}}><Text style={{fontFamily:'fontBold',color:confirmDialog.severity ? 'orange' : '#0e75b3',fontSize:11}}>{confirmDialog.cancelBtn}</Text></TouchableOpacity></View>
                        <View style={{width:'50%',alignContent:'center',alignItems:'center'}}>
                            <TouchableOpacity onPress={() => {
                                dispatch(setConfirmDialog({isVisible:false}))
                                confirmDialog.response(true)
                        }} style={{padding:15,borderRadius:10,borderWidth:1,borderColor:'#0e75b3'}}><Text style={{fontFamily:'fontBold',color:'#0e75b3',fontSize:11}}>{confirmDialog.okayBtn}</Text></TouchableOpacity></View>
                    </View>
                    {confirmDialog.hasHideModal && <TouchableOpacity onPress={() => dispatch(setConfirmDialog({isVisible:false}))} style={{alignItems:'center',marginTop:10}}><Text style={{fontFamily:'fontLight',color:colors.tomato,fontSize:11}}>Hide modal</Text></TouchableOpacity>}
                </View>
            </View>
        </Modal>
    )
}
export default memo(ConfirmDialog);
const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: -5,

        padding:5,
    },
    ProfileFooterHeader:{
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        borderBottomWidth:1,
        borderColor:'#D2D6D8',
        height:70
    },
    centeredView:{
        width:'90%',
        backgroundColor:'#fff',
        borderRadius:10,
        padding:15,
        justifyContent:'center',
        elevation:10,shadowOffset: { width: 0,height: 2},shadowColor: "#000",shadowOpacity: 0.1,marginBottom:15,
    },
});