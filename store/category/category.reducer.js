import { pending, rejected, fulfilled } from "store/utils";
import { addNewCategory, deleteCategory, getAllCategory, getRestaurantCategories, updateCategory, updateCategoryOrder } from "./category.action";

const GET_ALL_CATEGORY = [
  { action: getAllCategory.pending, callback: pending },
  { action: getAllCategory.rejected, callback: rejected },
  {
    action: getAllCategory.fulfilled,
    callback: (state, { payload }) => {
      const { data, parentCategoryId } = payload;
      state.categories[parentCategoryId] = {
        items: data?.categories,
        loaded: true,
      };
      fulfilled(state);
    },
  },
];

const ADD_NEW_CATEGORY = [
  { action: addNewCategory.pending, callback: pending },
  { action: addNewCategory.rejected, callback: rejected },
  {
    action: addNewCategory.fulfilled,
    callback: (state, { payload }) => {

      const { category } = payload.data;
      const { parentCategoryId } = category;

      if (parentCategoryId in state.categories) {
        state.categories[parentCategoryId].items = [...state.categories[parentCategoryId].items, category];
      } else {
        state.categories[parentCategoryId] = {
          items: [category],
          loaded: true
        }
      }

      state.allCategories = [...state.allCategories, category]
      fulfilled(state);
    },
  },
];

const DELETE_CATEGORY = [
  { action: deleteCategory.pending, callback: pending },
  { action: deleteCategory.rejected, callback: rejected },
  {
    action: deleteCategory.fulfilled,
    callback: (state, { payload }) => {
      const { data } = payload;
      const deletedCategory = data.category;

      const parentCategoryId = deletedCategory.parentCategoryId;
      const categoryId = deletedCategory.categoryId;

      if (parentCategoryId in state.categories) {
        state.categories[parentCategoryId].items = state.categories[parentCategoryId]?.items?.filter((item) => item.id !== categoryId);
      }

      fulfilled(state);
    },
  },
];

const UPDATE_CATEGORY = [
  { action: updateCategory.pending, callback: pending },
  { action: updateCategory.rejected, callback: rejected },
  {
    action: updateCategory.fulfilled,
    callback: (state, { payload }) => {
      const { data } = payload;

      const { category: updatedCategory, isParentCategoryChanged, oldParentCategory } = data;

      const parentCategoryId = updatedCategory.parentCategoryId;
      const categoryId = updatedCategory.id;

      if (isParentCategoryChanged === true) {
        // remove from old p category 
        const removeCat = state?.categories[oldParentCategory]?.items?.filter((i) => i.id !== categoryId);
        state.categories[oldParentCategory].items = removeCat;

        // add to new p category
        if (parentCategoryId in state.categories) {

          state.categories[parentCategoryId].items = [
            ...state.categories[parentCategoryId].items,
            updatedCategory
          ]
        } else {
          state.categories[parentCategoryId] = {
            items: [updatedCategory],
            loaded: false
          }
        }

      } else {
        // just update the data 
        if (parentCategoryId in state.categories) {
          const findIndex = state.categories[parentCategoryId].items.findIndex((item) => item.id === categoryId);
          if (findIndex !== -1) {
            state.categories[parentCategoryId].items[findIndex] = updatedCategory
          }
        }
      }


      fulfilled(state);
    },
  },
];

const UPDATE_CATEGORY_ORDER = [
  { action: updateCategoryOrder.pending, callback: pending },
  { action: updateCategoryOrder.rejected, callback: rejected },
  {
    action: updateCategoryOrder.fulfilled,
    callback: (state, { payload }) => {

      fulfilled(state);
    },
  },
];

const ALL_RESTAURANT_CATEGORIES = [
  { action: getRestaurantCategories.pending, callback: pending },
  { action: getRestaurantCategories.rejected, callback: rejected },
  {
    action: getRestaurantCategories.fulfilled,
    callback: (state, { payload }) => {

      state.allCategories = payload.data.categories
      state.allCategoriesLoaded = true
      fulfilled(state);
    },
  },
];




const extraReducers = ({ addCase }) => {
  const addToReducers = (arr) => {
    arr.forEach(({ action, callback }) => addCase(action, callback));
  };

  addToReducers(GET_ALL_CATEGORY);
  addToReducers(ADD_NEW_CATEGORY);
  addToReducers(DELETE_CATEGORY);
  addToReducers(UPDATE_CATEGORY);
  addToReducers(UPDATE_CATEGORY_ORDER);
  addToReducers(ALL_RESTAURANT_CATEGORIES);
};

export default extraReducers;
