import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosGet, axiosPost } from "utils/axiosConfig";

export const getTotalVisitorsCount = createAsyncThunk(
  "getTotalVisitorsCount",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/totalVisitors/${restaurantId}`)
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

export const getTotalLanguages = createAsyncThunk(
  "getTotalLanguages",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/totalLanguages/${restaurantId}`)
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

export const getTotalDishCount = createAsyncThunk(
  "getTotalDishCount",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/totalDishes/${restaurantId}`)
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

export const getTotalBadgeCount = createAsyncThunk(
  "getTotalBadgeCount",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/totalBadges/${restaurantId}`)
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

export const getTotalCategoryCount = createAsyncThunk(
  "getTotalCategoryCount",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/totalCategories/${restaurantId}`)
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

export const getGraphData = createAsyncThunk(
  "getGraphData",
  async ({ restaurantId, scale }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/visitors/${restaurantId}?scale=${scale}`)
        .then((res) => {
          const { error, data } = res.data;
          if (error) {
            return rejectWithValue({
              success: false,
              message: message,
            });
          }

          return { success: true, scale, data: data };
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

export const getTapsPerDishes = createAsyncThunk(
  "getTapsPerDishes",
  async ({ restaurantId, data }, { rejectWithValue }) => {
    try {
      return axiosPost(`analytics/tapsPerDishes/${restaurantId}`, data)
        .then((res) => {
          const { error, data, message } = res.data;
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


export const getDishesAvgViewTime = createAsyncThunk(
  "getDishesAvgViewTime",
  async ({ restaurantId, data }, { rejectWithValue }) => {
    try {
      return axiosPost(`analytics/dishesAvgViewTime/${restaurantId}`, data)
        .then((res) => {
          const { error, data, message } = res.data;
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

export const getDishesIds = createAsyncThunk(
  "getDishesIds",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/getDishesIds/${restaurantId}`)
        .then((res) => {
          const { error, data, message } = res.data;
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

export const allTimeTotalVisitors = createAsyncThunk(
  "allTimeTotalVisitors",
  async ({ restaurantId }, { rejectWithValue }) => {
    try {
      return axiosGet(`analytics/allTimeTotalVisitors/${restaurantId}`)
        .then((res) => {
          const { error, data, message } = res.data;
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


