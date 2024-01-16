import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./customer.reducer";

// Initial State
const initialState = {
    customers: [],
    loaded: false,
};

// Create Slice
export const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers,
});

// Exporting Actions
export const useCustomer = () => useSelector(({ customer }) => customer);

// Exporting the Reducer
export default customerSlice.reducer;
export const customerActions = customerSlice.actions;
