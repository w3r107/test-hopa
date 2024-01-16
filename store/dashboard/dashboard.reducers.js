import {
  allTimeTotalVisitors,
  getGraphData,
  getTotalBadgeCount,
  getTotalCategoryCount,
  getTotalDishCount,
  getTotalLanguages,
  getTotalVisitorsCount,
} from "./dashboard.action";
import { pending, rejected, fulfilled } from "store/utils";

// Get Menu
const GET_TOTAL_VISITORS_COUNT = [
  { action: getTotalVisitorsCount.pending, callback: pending },
  { action: getTotalVisitorsCount.rejected, callback: rejected },
  {
    action: getTotalVisitorsCount.fulfilled,
    callback: (state, { payload }) => {
      state.totalVisitors = payload.data?.totalVisitors;
      fulfilled(state);
    },
  },
];

// Get Menu
const GET_TOTAL_LANGUAGES = [
  { action: getTotalLanguages.pending, callback: pending },
  { action: getTotalLanguages.rejected, callback: rejected },
  {
    action: getTotalLanguages.fulfilled,
    callback: (state, { payload }) => {
      state.totalLanguages = payload.data?.totalLanguages;
      fulfilled(state);
    },
  },
];

// Get Menu
const GET_TOTAL_DISH_COUNT = [
  { action: getTotalDishCount.pending, callback: pending },
  { action: getTotalDishCount.rejected, callback: rejected },
  {
    action: getTotalDishCount.fulfilled,
    callback: (state, { payload }) => {
      state.totalDishes = payload.data?.totalDishes;
      fulfilled(state);
    },
  },
];

const GET_TOTAL_BADGE_COUNT = [
  { action: getTotalBadgeCount.pending, callback: pending },
  { action: getTotalBadgeCount.rejected, callback: rejected },
  {
    action: getTotalBadgeCount.fulfilled,
    callback: (state, { payload }) => {
      state.totalBadges = payload.data?.totalBadges;
      fulfilled(state);
    },
  },
];

const GET_TOTAL_CATEGORY_COUNT = [
  { action: getTotalCategoryCount.pending, callback: pending },
  { action: getTotalCategoryCount.rejected, callback: rejected },
  {
    action: getTotalCategoryCount.fulfilled,
    callback: (state, { payload }) => {
      state.totalCategories = payload.data?.totalCategories;
      fulfilled(state);
    },
  },
];

const GET_GRAPH_DATA = [
  { action: getGraphData.pending, callback: pending },
  { action: getGraphData.rejected, callback: rejected },
  {
    action: getGraphData.fulfilled,
    callback: (state, { payload }) => {
      const { data, scale } = payload;
      if (scale === "day") {
        state.dayData = data;
        state.dayData.loaded = true;
      } else if (scale === "week") {
        state.weekData = data;
        state.weekData.loaded = true;
      } else if (scale === "month") {
        state.monthData = data;
        state.monthData.loaded = true;
      }
      fulfilled(state);
    },
  },
];

const ALL_TIME_TOTAL_VISITORS = [
  { action: allTimeTotalVisitors.pending, callback: pending },
  { action: allTimeTotalVisitors.rejected, callback: rejected },
  {
    action: allTimeTotalVisitors.fulfilled,
    callback: (state, { payload }) => {
      const { data } = payload;
      state.allTimeVisitors = data?.totalVisitorsOfAllTime
      fulfilled(state);
    },
  },
];

const extraReducers = ({ addCase }) => {
  const addToReducers = (arr) => {
    arr.forEach(({ action, callback }) => addCase(action, callback));
  };

  addToReducers(GET_TOTAL_VISITORS_COUNT);
  addToReducers(GET_TOTAL_LANGUAGES);
  addToReducers(GET_TOTAL_DISH_COUNT);
  addToReducers(GET_TOTAL_BADGE_COUNT);
  addToReducers(GET_TOTAL_CATEGORY_COUNT);
  addToReducers(GET_GRAPH_DATA);
  addToReducers(ALL_TIME_TOTAL_VISITORS);
};

export default extraReducers;
