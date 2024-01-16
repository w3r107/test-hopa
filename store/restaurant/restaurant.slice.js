import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./restaurant.reducers";

// Initial State
const initialState = {
  isLoading: false,
  data: {},
  role: "",
  error: "",
  searchText: "",
  loaded: false,
  users: []
};

// Create Slice
export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    reset: () => initialState,
    setRole: (state, action) => {
      const { role } = action.payload;
      state.role = role
    }
  },
  extraReducers,
});

// Hook for easy retrieval of state
export const useRestaurant = () => useSelector(({ restaurant }) => restaurant);

// Exporting Actions
export * from "./restaurant.actions";

// Exporting the Reducer
export default restaurantSlice.reducer;
export const restaurantActions = restaurantSlice.actions;
