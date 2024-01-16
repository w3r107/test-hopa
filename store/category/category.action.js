import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";

export const getAllCategory = createAsyncThunk(
  "getAllCategory",
  async ({ restaurantId, parentCategoryId }, { rejectWithValue }) => {
    try {
      return axiosGet(
        `category/allCategories/${restaurantId}/${parentCategoryId}`
      )
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, parentCategoryId, data: data };
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

export const addNewCategory = createAsyncThunk(
  "addNewCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPost(
        `category/addCategory`, data
      )
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

export const deleteCategory = createAsyncThunk(
  "deleteCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosDelete(
        `category/deleteCategory`, data
      )
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

export const updateCategory = createAsyncThunk(
  "updateCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(
        `category/updateCategory`, data
      )
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

export const getRestaurantCategories = createAsyncThunk(
  "getRestaurantCategories",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(
        `category/allCategory/${restaurantId}`,
      )
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

export const updateCategoryOrder = createAsyncThunk(
  "updateCategoryOrder",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(`category/categoryOrderUpdate`, data)
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