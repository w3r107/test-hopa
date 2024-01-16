import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./parentCategory.reducer";

// Initial State
const initialState = {
  isLoading: true,
  loaded: false,
  allParentCategories: [],
};

// Create Slice
export const parentCategorySlice = createSlice({
  name: "parentCategory",
  initialState,
  reducers: {
    reset: () => initialState,

    // update parent category
    updateParentOrderById: (state, action) => {
      const { parentCategoryId, position } = action.payload;

      const findIdx = state.allParentCategories.findIndex(
        (item) => item.id === parentCategoryId
      );

      if (findIdx !== -1) {
        state.allParentCategories[findIdx].position = position;
        const sortPC = state.allParentCategories.sort((a, b) => {
          if (a.position < b.position) {
            return -1;
          }
          if (a.position > b.position) {
            return 1;
          }
        });
        state.allParentCategories = sortPC;
      }
    },

    //
  },
  extraReducers,
});

// Exporting Actions

export const useParentCategory = () =>
  useSelector(({ parentCategory }) => parentCategory);

// Exporting the Reducer
export default parentCategorySlice.reducer;
export const parentCategoryActions = parentCategorySlice.actions;
