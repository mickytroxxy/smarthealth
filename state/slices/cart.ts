import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PharmacyType, ProductType } from "../../hooks/useCart";

const initialState: { pharmacies: PharmacyType[]; products:ProductType[], cartItems:ProductType[]} = {
    pharmacies: [],
    products: [],
    cartItems:[]
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    setPharmacies: (state, action: PayloadAction<PharmacyType[]>) => {
        state.pharmacies = action.payload;
    },
    setProducts: (state, action: PayloadAction<ProductType[]>) => {
        state.products = action.payload;
    },
    setCartItems: (state, action: PayloadAction<ProductType[]>) => {
        state.cartItems = action.payload;
    }
  },
});

export const { setPharmacies,setProducts, setCartItems  } = cartSlice.actions;
export default cartSlice.reducer;
