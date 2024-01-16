import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";

export const getAllDishes = createAsyncThunk(
  "getAllDishes",
  async ({ restaurantId, categoryId }, { rejectWithValue }) => {
    try {
      return axiosGet(`dish/allDishes/${restaurantId}/${categoryId}`)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, categoryId, data: data };
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

export const getParentDishes = createAsyncThunk(
  "getParentDishes",
  async ({ restaurantId, parentCategoryId }, { rejectWithValue }) => {
    try {
      return axiosGet(`dish/getParentDishes/${restaurantId}/${parentCategoryId}`)
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

export const addNewDish = createAsyncThunk(
  "addNewDish",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPost(`dish/addDish`, data)
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

export const updateDish = createAsyncThunk(
  "updateDish",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(`dish/updateDish`, data)
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

export const deleteDish = createAsyncThunk(
  "deleteDish",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosDelete(`dish/deleteDish`, data)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return {
            success: true,
            data: data
          };
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


export const updateDishOrder = createAsyncThunk(
  "updateDishOrder",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(`dish/dishOrderUpdate`, data)
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

export const moveDishes = createAsyncThunk(
  "moveDishes",
  async ({ data }, { rejectWithValue }) => {
    try {
      return axiosPatch(`dish/moveDishes`, data)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return {
            success: true,
            data: data
          };
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
