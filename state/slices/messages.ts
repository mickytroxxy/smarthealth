import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { messages: any[]; allMessages:any} = {
    messages: [],
    allMessages: []
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<any[]>) => {
        state.messages = action.payload;
    },
    setAllMessages: (state, action: PayloadAction<any[]>) => {
        state.allMessages = action.payload;
    }
  },
});

export const { setMessages,setAllMessages } = messageSlice.actions;
export default messageSlice.reducer;
