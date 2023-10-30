import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
  android: {
    extension: ".mp3",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
const OPEN_AI_KEY = "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";
const ELEVEN_LABS_API = "e09eaa27f3857c21e7879567bfeff795"


const useAudioRecording = () => {
  const [recording, setRecording] = useState();
  const router = useRouter();
  const [messages,setMessages] = useState([
    {role: "system", "content": `You are an AI medical doctor, please respond as a doctor, ask question, make sure you provide accurate information, you can diagonise, give prescriptions at the end of the call. Treat this conversation as a consultant call`},
  ])
  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) {return}
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({allowsRecordingIOS: false});
      setRecording(undefined);
      onWhisperTranscribe();
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };
  const onWhisperTranscribe = async () => {
    if (!recording) {return}
    try {
      const uri = recording.getURI();
      const filetype = uri.split('.').pop();
      const filename = uri.split('/').pop();
  
      const formData = new FormData();
      formData.append('file', {uri, type: `audio/${filetype}`, name: filename});
      formData.append('language', 'en')
      formData.append('model', 'whisper-1');
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions',formData,{headers: {'Authorization': 'Bearer '+OPEN_AI_KEY,'Content-Type': 'multipart/form-data'}});
  
      const transcript = response.data.text;
      prepareMessage(transcript)
    } catch (err) {
      console.error('Whisper transcription failed', err);
    }
  };
  const prepareMessage = async(transcript) => {
    const newMessage = [...messages,{role: 'user', content: transcript }]
    const doctorResponse = await generateContent(newMessage);
    setMessages([...newMessage,{role: 'assistant', content: doctorResponse }])
    Speech.speak(doctorResponse,{voice:'com.apple.voice.compact.en-GB.Daniel',rate:0.9,pitch:0.8});
  }
  const generateContent = async(messages) => {
    const headers = {
        'Authorization': `Bearer ${OPEN_AI_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        model: 'gpt-3.5-turbo',
        messages
    };
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
      console.log(response.data?.choices[0]?.message.content)
      return response.data?.choices[0]?.message.content
    } catch (error) {

      return null
    }
  }
  useEffect(() => {
    getVoices();
  },[])
  const getVoices = async() =>{
    const voices = await Speech.getAvailableVoicesAsync()
    //console.log(voices)
  }
  const stopCall = () => {
    Speech.stop();
    router.back();
  }
  return {recording,stopCall,prepareMessage,isRecording: !!recording,startRecording,stopRecording,onWhisperTranscribe};
};

export default useAudioRecording;