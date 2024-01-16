import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./auth.reducers";

// Exporting Actions
export * from "./auth.action";

const initialState = {
  uid: "",
  restaurantId: "",
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: extraReducers,
});

export const useAuth = () => useSelector(({ auth }) => auth);
// Exporting the Reducer
export default authSlice.reducer;

export const authActions = authSlice.actions;
