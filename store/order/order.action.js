import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";

export const getAllOrders = createAsyncThunk(
    "getAllOrders",
    async ({ restaurantId }, { rejectWithValue }) => {
        try {
            return axiosGet(`order/getOrders/${restaurantId}`)
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

export const getOrderHistory = createAsyncThunk(
    "getOrderHistory",
    async ({ restaurantId }, { rejectWithValue }) => {
        try {
            return axiosGet(`order/getOrderHistory/${restaurantId}`)
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

export const getOrderById = createAsyncThunk(
    "getOrderById",
    async ({
        restaurantId,
        data
    }, { rejectWithValue }) => {
        try {
            return axiosGet(`order/getOrderById/${restaurantId}`, data)
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

export const updateOrderStatus = createAsyncThunk(
    "updateOrderStatus",
    async ({
        restaurantId,
        data
    }, { rejectWithValue }) => {
        try {
            return axiosPatch(`order/updateOrderStatus/${restaurantId}`, data)
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