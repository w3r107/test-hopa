import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./category.reducer";

// Initial State
const initialState = {
  categories: {},
  categoriesLoading: "",
  allCategories: [],
  allCategoriesLoaded: false
};

// Create Slice
export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    reset: () => initialState,

    // update category order
    updateCategoryOrderById: (state, action) => {

      const { parentCategoryId, categoryId, position } = action.payload;

      const allCats = state.categories[parentCategoryId]?.items;

      const findIdx = allCats.findIndex(
        (item) => item.id === categoryId
      );

      if (findIdx !== -1) {
        state.categories[parentCategoryId].items[findIdx].position = position;

        const sortPC = state.categories[parentCategoryId].items.sort((a, b) => {
          if (a.position < b.position) {
            return -1;
          }
          if (a.position > b.position) {
            return 1;
          }
        });
        state.categories[parentCategoryId].items = sortPC;
      }
    },
  },
  extraReducers,
});

// Exporting Actions
export const useCategory = () => useSelector(({ category }) => category);

// Exporting the Reducer
export default categorySlice.reducer;
export const categoryActions = categorySlice.actions;
