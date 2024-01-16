import { pending, rejected, fulfilled } from "store/utils";
import {
  addParentCategory,
  deleteParentCategory,
  getAllParentCategory,
  updateParentCategory,
  updateParentCategoryOrder,
} from "./parentCategory.action";

const GET_ALL_PARENT_CATEGORY = [
  { action: getAllParentCategory.pending, callback: () => { } },
  { action: getAllParentCategory.rejected, callback: rejected },
  {
    action: getAllParentCategory.fulfilled,
    callback: (state, { payload }) => {
      const { data } = payload;
      state.loaded = true;
      state.allParentCategories = data?.parentCategories;
      fulfilled(state);
    },
  },
];

const UPDATE_PARENT_CATEGORY_ORDER = [
  {
    action: updateParentCategoryOrder.pending,
    callback: () => { },
  },
  {
    action: updateParentCategoryOrder.rejected,
    callback: rejected,
  },
  {
    action: updateParentCategoryOrder.fulfilled,
    callback: (state, action) => {
      fulfilled(state);
    },
  },
];

const ADD_PARENT_CATEGORY = [
  {
    action: addParentCategory.pending,
    callback: () => { },
  },
  {
    action: addParentCategory.rejected,
    callback: rejected,
  },
  {
    action: addParentCategory.fulfilled,
    callback: (state, { payload }) => {
      const { parentCategory } = payload.data;
      const id = parentCategory.parentCategoryId;
      delete parentCategory.parentCategoryId;

      state.allParentCategories = [...state.allParentCategories, { ...parentCategory, id }];

      fulfilled(state);
    },
  },
];

const UPDATE_PARENT_CATEGORY = [
  {
    action: updateParentCategory.pending,
    callback: () => { },
  },
  {
    action: updateParentCategory.rejected,
    callback: rejected,
  },
  {
    action: updateParentCategory.fulfilled,
    callback: (state, { payload }) => {
      const { parentCategory } = payload.data;
      const id = parentCategory.id;

      const findIdx = state.allParentCategories.findIndex((item) => item.id === id);
      if (findIdx !== -1) {
        state.allParentCategories[findIdx] = parentCategory;
      }

      fulfilled(state);
    },
  },
];

const DELETE_PARENT_CATEGORY = [
  {
    action: deleteParentCategory.pending,
    callback: () => { },
  },
  {
    action: deleteParentCategory.rejected,
    callback: rejected,
  },
  {
    action: deleteParentCategory.fulfilled,
    callback: (state, { payload }) => {
      const { parentCategoryId } = payload.data;
      const filterPCategoryies = state.allParentCategories.filter((item) => item.id != parentCategoryId)
      state.allParentCategories = filterPCategoryies

      fulfilled(state);
    },
  },
];

const extraReducers = ({ addCase }) => {
  const addToReducers = (arr) => {
    arr.forEach(({ action, callback }) => addCase(action, callback));
  };

  addToReducers(GET_ALL_PARENT_CATEGORY);
  addToReducers(UPDATE_PARENT_CATEGORY_ORDER);
  addToReducers(ADD_PARENT_CATEGORY);
  addToReducers(DELETE_PARENT_CATEGORY);
  addToReducers(UPDATE_PARENT_CATEGORY);
};

export default extraReducers;
