import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setBettingAmount, setGamblingItems, setGameStarted, setGameType, setPackages } from '../state/slices/game';
import { GamblingItemsType } from '../constants/Types';
import { showToast } from '../helpers/methods';
import { setModalState } from '../state/slices/modalState';
import useUpdates from './useUpdates';
import { createData, getMyWins } from '../helpers/api';
import { setActiveUser } from '../state/slices/users';
const items:GamblingItemsType[] = [
    { id: 1, class: 'VIP JACKPOT', duration: 3, totalCost: 4500, selected: false, items: ["doctors", "HENNESSY", "6 PACK RED BULLS", "FREE DINNER", "TRANSPORT", "SECURITY"], description: "Experience the ultimate VIP jackpot with a variety of exclusive rewards! This package includes services such as a dedicated doctors, premium Hennessy drinks, a 6 pack of Red Bulls, a free dinner, transportation, and enhanced security" },
    { id: 2, class: 'FLIRTATIOUS WIN', duration: 3, totalCost: 3000, selected: false, items: ["doctors", "HENNESSY", "FREE DINNER", "TRANSPORT"], description: "Enjoy a flirtatious win with exciting prizes and surprises! This package includes services such as a dedicated doctors, Hennessy drinks, a free dinner, and transportation." },
    { id: 3, class: 'PARTY NIGHT', duration: 2, totalCost: 1200, selected: false, items: ["doctors", "TEQUILA", "12 PACK BEERS"], description: "Have a blast at the party night with drinks and entertainment! This package includes services such as a dedicated doctors, Tequila shots, and a 12 pack of beers." },
    { id: 4, class: 'DINNER NIGHT', duration: 2, totalCost: 1200, selected: false, items: ["doctors", "FREE DINNER"], description: "Indulge in a delightful dinner night with a complimentary meal! This package includes services such as a dedicated doctors and a free dinner." },
    { id: 5, class: 'HANGOUT', duration: 1, totalCost: 400, selected: false, items: ["doctors"], description: "This package includes a dedicated doctors for personalized assistance." },
];
const UNFORTUNATE_CLASS = "UNFORTUNATE"
const useGames = () => {
    const dispatch = useDispatch();
    const {handleChange} = useUpdates();
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const {bettingAmount,mainBalance,gamblingItems,gameTypes,gameStarted} = useSelector((state: RootState) => state.game);
    const isGameOver = gamblingItems.filter(item => item.selected)?.length > 0;
    const gameType = gameTypes.filter(item => item.selected)[0]
    const getGamblingItems = () => {
        const amountToBet = bettingAmount > 44 ? bettingAmount : 45
        const possibleWins = items.filter(item => (item.totalCost || 0) <= amountToBet * 10);
        let losingItemsCount = 8;
        if(mainBalance > amountToBet * 50){losingItemsCount = 7}
        if(mainBalance > amountToBet * 100){losingItemsCount = 6}
    
        const losingItems = Array.from({ length: losingItemsCount }, (_, index) => ({ id: index + 6, class: UNFORTUNATE_CLASS, selected: false }));
        const remainingItemsCount = 9 - losingItems.length;

        const remainingItems = [];
        while (remainingItems.length < remainingItemsCount) {
            const randomIndex = Math.floor(Math.random() * possibleWins.length);
            const selectedItem = possibleWins[randomIndex];
            remainingItems.push(selectedItem);
            possibleWins.splice(randomIndex, 1);
            possibleWins.push({ id:Math.floor(Math.random() * 1000 + 10000), class: UNFORTUNATE_CLASS, selected: false })
        }
        const randomizedItems = [...remainingItems, ...losingItems].sort(() => Math.random() - 0.5);
        dispatch(setGamblingItems(randomizedItems))
        return randomizedItems;
    };
    const getMyWonPackages = async() => {
        try {
            const response:GamblingItemsType[] = await getMyWins(accountInfo?.clientId)
            if(response.length > 0){
                dispatch(setPackages(response))
            }
        } catch (error) {
            console.log("Error while trying to get packages")
        }
    }
    const handleWinUpdates = async(selectedItem:GamblingItemsType,success:boolean) => {
        const balance = accountInfo.balance - bettingAmount;
        const transactionId:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
        const date = Date.now();
        const obj = {...selectedItem,bettingAmount,transactionId,success,clientId:accountInfo?.clientId,date,status:0};
        await createData("transactions",transactionId,{transactionId,status:"PENDING",date,fromUser:accountInfo?.clientId,fromToArray:[accountInfo?.clientId],toUser:"",amount:bettingAmount,isCash:false,category:'BETTING',type:selectedItem.class,commission:0});
        await createData("bettings",transactionId,obj)
        if(selectedItem.class !== UNFORTUNATE_CLASS){
            dispatch(setModalState({isVisible:true,attr:{headerText:'WON PACKAGE',status:true,packages:[obj]}}));
        }
        handleChange("balance",balance)
        getGamblingItems();
        getMyWonPackages();
    }
    const handleShowPackages = () => dispatch(setModalState({isVisible:true,attr:{headerText:'SHOW PACKAGES',status:false,packages:items}}))
    const flipCard = (selectedItem: GamblingItemsType) => {
        if(gameStarted){
            if(!isGameOver || gameType.category !== "LUCKY CARD"){
                if(gameType.category === "LUCKY CARD"){dispatch(setGamblingItems(gamblingItems.map((item:GamblingItemsType) => item.id === selectedItem.id ? {...item,selected:true} : item)))}
                if(selectedItem.class === UNFORTUNATE_CLASS){
                    showToast("Unfortunately you didn't make it this time, please try again!");
                    handleWinUpdates(selectedItem,false);
                }else{
                    showToast("Congratulations on your "+selectedItem.class+" win, You can claim this anytime...");
                    handleWinUpdates(selectedItem,true);
                }
            }

        }else{
            showToast("Please start the game to proceed!")
        }
    };
    useEffect(() => {
        dispatch(setGameStarted(false))
        dispatch(setBettingAmount(0));
        dispatch(setActiveUser(accountInfo))
    },[])

    useEffect(() => {
        getGamblingItems();
    },[bettingAmount])
    return {bettingAmount,getMyWonPackages,isGameOver,getGamblingItems,handleShowPackages,mainBalance,flipCard,gameTypes,gamblingItems,gameType,accountInfo,gameStarted};
};

export default useGames;
