// Redux Toolkit Imports
import { createAsyncThunk } from "@reduxjs/toolkit";


// Util Imports
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";


export const getRestaurantInfo = createAsyncThunk(
  "getRestaurantInfo",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`restaurant/getRestaurant/${restaurantId}`)
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

export const updateRestaurantInfo = createAsyncThunk(
  "updateRestaurantInfo",
  async ({ restaurantId, data }, { rejectWithValue }) => {
    try {
      console.log("data", data);
      return axiosPatch(`restaurant/updateRestaurant/${restaurantId}`, data)
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


export const updatePlaceholder = createAsyncThunk(
  "updatePlaceholder",
  async ({ restaurantId, placeholder }, { rejectWithValue }) => {
    try {
      return axiosPatch(`restaurant/updatePlaceholder`, { image: placeholder, restaurantId })
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

export const addRestaurantUser = createAsyncThunk(
  "addRestaurantUser",
  async (data, { rejectWithValue }) => {
    try {
      return axiosPost(`restaurant/addRestaurantUser`, data)
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
export const getRestaurantUsers = createAsyncThunk(
  "getRestaurantUsers",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`restaurant/getRestaurantUsers/${restaurantId}`)
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

export const deleteRestaurantUser = createAsyncThunk(
  "deleteRestaurantUser",
  async (data, { rejectWithValue }) => {
    try {
      return axiosDelete(`restaurant/deleteRestaurantUser`, data)
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
export const updateRestaurantUser = createAsyncThunk(
  "updateRestaurantUser",
  async (data, { rejectWithValue }) => {
    try {
      return axiosPatch(`restaurant/updateRestaurantUser`, data)
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

