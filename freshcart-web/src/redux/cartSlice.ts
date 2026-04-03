import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  image?: string;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryCharge: number;
  finalTotal: number;
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryCharge: 50,
  finalTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item) item.quantity += 1;
      cartSlice.caseReducers.calculateTotal(state);
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item?.quantity && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    clearCart: (state) => {
      state.cartData = [];
      state.subTotal = 0;
      state.deliveryCharge = 50;
      state.finalTotal = 0;
    },
    calculateTotal: (state) => {
      ((state.subTotal = state.cartData.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      )),
        (state.deliveryCharge = state.subTotal > 100 ? 0 : 50));
      state.finalTotal = state.subTotal + state.deliveryCharge;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
