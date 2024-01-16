import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./order.reducer";

// Initial State
const initialState = {
    orders: [],
    orderHistory: [],
    loaded: false,
    orderHistoryLoaded: false
};

// Create Slice
export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        reset: () => initialState,
        addOrder: (state, action) => {
            const oId = action.payload?.id;
            console.log("OId", oId);
            const getOrder = state.orders.find(o => o.id === oId);
            console.log("getOrder", getOrder);

            if(!getOrder){
                state.orders = [action.payload, ...state.orders];
            }
        }
    },
    extraReducers,
});

// Exporting Actions
export const useOrder = () => useSelector(({ order }) => order);

// Exporting the Reducer
export default orderSlice.reducer;
export const orderActions = orderSlice.actions;
