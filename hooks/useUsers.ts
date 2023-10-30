import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { getRequestData, getUserById, getUsers } from '../helpers/api';
import { setUsers } from '../state/slices/users';
import { UserProfile } from '../constants/Types';
import Constants from 'expo-constants';
import { setAccountInfo } from '../state/slices/accountInfo';
const AI:UserProfile[] = [{
    "address": {
      "latitude": 37.785834,
      "text": "1800 Ellis St, San Francisco, CA 94115, USA",
      "longitude": -122.406417
    },
    "about": `🤖 Hello, I'm Dr SOFT AI, your friendly and knowledgeable artificial intelligence doctor! 🌟 I'm here to revolutionize the way you experience healthcare. With a blend of cutting-edge technology and medical expertise, I'm committed to providing you with top-notch healthcare guidance and support.`,
    "fname": "DR SOFT AI",
    "birthDay": "01/01/2003",
    "phoneNumber": "27658016130",
    "type": "AI_DOCTOR",
    "transactions": [],
    "photos": [],
    "services": [
      {
        "type": "GENERAL PRACTITIONER",
        "fees": [
          {
            "type": "HOURLY",
            "name": "HOURS",
            "fee": 200
          }
        ]
      }
    ],
    "rates": [],
    "accountOwner": "AI19274056AI",
    "clientId": "AI19274056AI",
    "gender": "MALE",
    "geoHash": "9q8yywdq7v",
    "isVerified": false,
    "avatar": "https://img.freepik.com/free-photo/fun-3d-cartoon-illustration-indian-doctor_183364-114487.jpg",
    "privacy": [
      {
        "type": "CAN VISIT THE PATIENT",
        "selected": false
      },
      {
        "type": "THE PATIENT CAN VISIT",
        "selected": false
      },
      {
        "type": "ALLOW CASH PAYMENT",
        "selected": false
      },
      {
        "type": "ALLOW CARD PAYMENT",
        "selected": true
      }
    ],
    "balance": 0,
    "deleted": false,
    "history": []
}]
const useUsers = () => {
    const { location } = useSelector((state: RootState) => state.location);
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const { activeUser,users } = useSelector((state: RootState) => state.users);
    const [usersError,setUsersError] = useState<any>(null);
    const profileOwner = accountInfo?.clientId === activeUser?.accountOwner;
    const [requestData,setRequestData] = useState([]);
    const dispatch = useDispatch();
    
    const getServiceProviders = async (latitude:number,longitude:number,range:number) => {
        try {
            const response : UserProfile[] = await getUsers(latitude,longitude,Constants.isDevice ? range : 30000);
            //console.log(JSON.stringify(response))
            if(response.length > 0){
                dispatch(setUsers([...AI,...response]));
                setUsersError(null);
            }else{
                setUsersError("No doctors found within the specified location")
            }
        } catch (error) {
            console.error('Error retrieving local users:', error);
        }
    }
    const getRequest = async() => {
        try {
            const response:any = await getRequestData(accountInfo?.clientId,activeUser?.clientId || '');
            setRequestData(response);
        } catch (error) {
            setRequestData([]);
            console.log(error)
        }
    }
    const updateUser = async () => {
        try {
            const response = await getUserById(accountInfo?.clientId);
            if(response.length > 0){
                dispatch(setAccountInfo(response[0]))
            }
        } catch (error) {
            
        }
    }
    useEffect(() => {
        getServiceProviders(location.latitude,location.longitude,200);
        updateUser();
    },[])
    return {activeUser,users,usersError,location,profileOwner,accountInfo,requestData,getRequest,getServiceProviders};
};

export default useUsers;
