import { useCallback, useEffect, useState } from 'react';
import { createData, getAllMessages, getMessagesData, getUserById } from '../helpers/api';
import useUsers from './useUsers';
import { GiftedChat} from 'react-native-gifted-chat'
import useRequests from './useRequests';
import { sendPushNotification, showToast } from '../helpers/methods';
import { UserProfile } from '../constants/Types';

const phoneNoRegex = /(?:[-+() ]*\d){5,13}/gm;
const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
const numInLetters = ["zero", "two", "three","four","five","six","seven","eight"];

const useMessages = () => {
    const {activeUser,accountInfo,profileOwner,users} = useUsers();
    const {lastRequest} = useRequests();
    const [messages,setMessages] = useState<any[]>([]);
    const [allMessages,setAllMessages] = useState<any[]>([]);
    const unSeenMessages = allMessages?.filter(item => item.status === 0 && item.toUser === accountInfo?.clientId);
    const appendMessages = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, []);

    const appendAllMessages = useCallback(async (messages = []) => {
        setAllMessages((prevMessages) => {
            const mergedMessages = [...prevMessages];
            messages.forEach((newMessage:any) => {
                const existingMessageIndex = mergedMessages.findIndex((message) => message._id === newMessage._id);
                if (existingMessageIndex !== -1) {
                    mergedMessages[existingMessageIndex] = newMessage;
                } else {
                    mergedMessages.push(newMessage);
                }
            });

            const uniqueUsers: any = [];
            const lastMessages: any = [];
        
            mergedMessages.forEach((item: any) => {
                const user = item.fromUser === accountInfo?.clientId ? item.toUser : item.fromUser;
                if (!uniqueUsers[user] || item.createdAt > uniqueUsers[user].createdAt) {
                    uniqueUsers[user] = item;
                }
            });
        
            for (const user in uniqueUsers) {
                let userDetails: UserProfile[] = users.filter((item) => item.clientId === user);
                if (userDetails.length === 0) {
                    getUserData();
                }
                async function getUserData () {
                    userDetails = await getUserById(user);
                }
                lastMessages.push({ ...uniqueUsers[user], userDetails: userDetails?.[0] });
            }
            return lastMessages;
        });
    }, [allMessages]);
    
    const onSend = async(message:any) => {
        const {text,_id} = message[0];
        const createdAt = new Date();
        const fromUser = accountInfo?.clientId;
        const toUser = activeUser?.clientId;
        const fromToArray = [fromUser,toUser];
        const connectionId = fromUser+toUser;
        const status = 0;
        if((messages.length < 8) || lastRequest?.status === "INTERESTED"){
            if((text.match(phoneNoRegex) === null && text.match(emailRegex) === null && (!numInLetters.some(v => text.toLowerCase().includes(v))))){
                const obj = {_id,text,createdAt,status,fromUser,toUser,fromToArray,connectionId,user:{_id:fromUser,}};
                await createData("chats",_id,obj);
                const {services,photos,...rest} = accountInfo;
                sendPushNotification(activeUser?.notificationToken,accountInfo?.fname,text,rest);
            }else{
                showToast("You are not allowed to share contact info")
            }
        }else{
            showToast("You are limited to sending only seven (7) free messages until you place a request.")
        }
    }
    useEffect(() => {
        getMessagesData(accountInfo?.clientId,activeUser?.clientId || '',appendMessages);
        getAllMessages(accountInfo?.clientId,appendAllMessages);
    },[])
    return {activeUser,profileOwner,accountInfo,messages,setMessages,onSend,allMessages,unSeenMessages};
};

export default useMessages;
