import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosGet, axiosPost } from "utils/axiosConfig";

export const loginWithEmailPassword = createAsyncThunk(
  "loginWithEmailPassword",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return axiosPost(`auth/login`, { email, password })
        .then((res) => {
          const { error, message } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, data: res.data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.response.data.message,
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

export const logoutUser = createAsyncThunk(
  "logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      return axiosPost(`auth/logout`, {})
        .then((res) => {
          const { error, message } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, data: res.data };
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

export const signupRestaurant = createAsyncThunk(
  "signupRestaurant",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPost(`restaurant/addRestaurant`, data)
        .then((res) => {
          const { error, message } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, data: res.data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.response.data.message,
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

export const checkLogin = createAsyncThunk(
  "checkLogin",
  async (data, { rejectWithValue }) => {
    try {
      return axiosPost(`auth/check-login`)
        .then((res) => {
          const { error, loggedIn, message } = res.data;
          if (!loggedIn) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, loggedIn, data: res.data };
        })
        .catch((error) => {
          return rejectWithValue({
            success: false,
            message: error.response.data.message,
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
