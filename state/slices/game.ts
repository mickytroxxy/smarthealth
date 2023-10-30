import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GamblingItemsType } from "../../constants/Types";

const initialState: { bettingAmount: number;packages:GamblingItemsType[]; gameStarted:boolean; mainBalance:any; gamblingItems:GamblingItemsType[]; gameTypes:any[]} = {
    bettingAmount: 450,
    mainBalance: 30000,
    gamblingItems:[],
    packages:[],
    gameStarted:false,
    gameTypes:[{category:'LUCKY CARD',selected:true},{category:'WHEEL OF FORTUNE',selected:false}]
};

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setBettingAmount: (state, action: PayloadAction<number>) => {
        state.bettingAmount = action.payload;
    },
    setMainBalance: (state, action: PayloadAction<number>) => {
        state.mainBalance = action.payload;
    },
    setGamblingItems: (state, action: PayloadAction<any[]>) => {
        state.gamblingItems = action.payload;
    },
    setGameType: (state, action: PayloadAction<any[]>) => {
        state.gameTypes = action.payload;
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
        state.gameStarted = action.payload;
    },
    setPackages: (state, action: PayloadAction<GamblingItemsType[]>) => {
        state.packages = action.payload;
    }
  },
});

export const { setBettingAmount,setGameStarted,setPackages,setMainBalance,setGamblingItems,setGameType } = gameSlice.actions;
export default gameSlice.reducer;
