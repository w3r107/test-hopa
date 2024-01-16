import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./library.reducer";

// Initial State
const initialState = {
    images: [],
    isLoading: false,
    loaded: false,
};

// Create Slice
export const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers,
});

// Exporting Actions
export const useLibrary = () => useSelector(({ library }) => library);

// Exporting the Reducer
export default librarySlice.reducer;
export const libraryActions = librarySlice.actions;
