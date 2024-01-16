import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./badge.reducer";

// Initial State
const initialState = {
  badges: [],
  isLoading: false,
  loaded: false,
};

// Create Slice
export const badgeSlice = createSlice({
  name: "badge",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers,
});

// Exporting Actions
export const useBadge = () => useSelector(({ badge }) => badge);

// Exporting the Reducer
export default badgeSlice.reducer;
export const badgeActions = badgeSlice.actions;
