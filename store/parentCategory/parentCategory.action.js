import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";

export const getAllParentCategory = createAsyncThunk(
  "getAllParentCategoryId",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`parentCategory/allParentCategories/${restaurantId}`)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, data: data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.message,
          });
        });
    } catch (error) {
      return rejectWithValue({
        error: true,
        message: error,
      });
    }
  }
);

export const updateParentCategoryOrder = createAsyncThunk(
  "updateParentCategoryOrder",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(`/parentCategory/parentCategoryOrderUpdate`, data)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, data: data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.message,
          });
        });
    } catch (error) {
      return rejectWithValue({
        error: true,
        message: error,
      });
    }
  }
);

export const addParentCategory = createAsyncThunk(
  "addParentCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPost(`/parentCategory/addParentCategory`, data)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, data: data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.message,
          });
        });
    } catch (error) {
      return rejectWithValue({
        error: true,
        message: error,
      });
    }
  }
);

export const deleteParentCategory = createAsyncThunk(
  "deleteParentCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosDelete(`/parentCategory/deleteParentCategory`, data)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, parentCategoryId: data.parentCategoryId, data: data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.message,
          });
        });
    } catch (error) {
      return rejectWithValue({
        error: true,
        message: error,
      });
    }
  }
);

export const updateParentCategory = createAsyncThunk(
  "updateParentCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(`parentCategory/updateParentCategory`, data)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, parentCategoryId: data.parentCategoryId, data: data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.message,
          });
        });
    } catch (error) {
      return rejectWithValue({
        error: true,
        message: error,
      });
    }
  }
);


