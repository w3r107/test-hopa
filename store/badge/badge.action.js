import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";

export const getAllBadges = createAsyncThunk(
  "getAllBadges",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`badge/allBadges/${restaurantId}`)
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

export const updateBadgeById = createAsyncThunk(
  "upateBadgesById",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(`badge/updateBadge`, data)
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

export const addNewBadge = createAsyncThunk(
  "addNewBadge",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPost(`badge/addBadge`, data)
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

export const deleteBadgeById = createAsyncThunk(
  "deleteBadgeById",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosDelete(`badge/deleteBadge`, data)
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

