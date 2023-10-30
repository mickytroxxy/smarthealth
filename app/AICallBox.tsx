import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableRipple, Switch } from 'react-native-paper';
import TextArea from "../components/ui/TextArea";
import { showToast } from "../helpers/methods";
import { BusinessServicesType, LocationType, PrivacyType } from "../constants/Types";
import { useDispatch } from "react-redux";
import { setModalState } from "../state/slices/modalState";
import { Stack, useRouter } from "expo-router";
import { colors } from "../constants/Colors";
import Icon from "../components/ui/Icon";
import useAudioRecording from "../hooks/useAudioRecording";
import { Button } from "../components/ui/Button";
import useAuth from "../hooks/useAuth";

const AICallBox = () => {
  const dispatch = useDispatch();
  const {accountInfo} = useAuth();
  const { prepareMessage,stopCall, isRecording, startRecording, stopRecording, onWhisperTranscribe } = useAudioRecording();
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    prepareMessage(`Hello there, I'm ${accountInfo.fname}, please respond as Doctor SOFT AI`)
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1000);
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Function to format time as minutes and seconds
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient colors={["#000", "#fff", "#fff", "#000"]} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ width: 260, height: 260, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center', borderRadius: 200 }}>
        <View style={{ width: 240, overflow: 'hidden', height: 240, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 200 }}>
          <Image style={{ width: '100%', aspectRatio: 1 }} source={{ uri: 'https://img.freepik.com/free-photo/fun-3d-cartoon-illustration-indian-doctor_183364-114487.jpg' }} />
        </View>
      </View>
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontFamily: 'fontBold', fontSize: 18 }}>CALLING DR SOFT AI...</Text>
        <Text style={{ fontFamily: 'fontBold', fontSize: 18, textAlign:'center' }}>{formatTime(time)}</Text>
      </View>
      <View style={{marginTop:20}}>
        <Button 
            btnInfo={{styles:{borderRadius:15,paddingVertical:10,borderColor:colors.green,width:200,backgroundColor:'#fff',padding:5}}} 
            textInfo={{text:isRecording ? 'SUBMIT AUDIO' : 'TALK NOW',color:isRecording ? colors.orange : colors.green}} 
            iconInfo={{type: 'MaterialCommunityIcons', name: 'record-circle-outline',color:isRecording ? colors.orange : colors.green,size:30}}
            handleBtnClick={isRecording ? stopRecording : startRecording}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 100 }}>
        <TouchableOpacity onPress={stopCall}>
          <Icon name="phone" type="FontAwesome" color={"tomato"} size={80} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default AICallBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
