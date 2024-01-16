import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./dashboard.reducers";

// Exporting Actions
export * from "./dashboard.action";

const initialState = {
  totalVisitors: 0,
  totalLanguages: 0,
  totalDishes: 0,
  totalBadges: 0,
  allTimeVisitors: 0,
  totalCategories: 0,
  dayData: {
    labels: [],
    data: [],
    loaded: false,
  },
  weekData: {
    labels: [],
    data: [],
    loaded: false,
  },
  monthData: {
    labels: [],
    data: [],
    loaded: false,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: extraReducers,
});

export const useDashboard = () => useSelector(({ dashboard }) => dashboard);
// Exporting the Reducer
export default dashboardSlice.reducer;

export const dashboardActions = dashboardSlice.actions;
