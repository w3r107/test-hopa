import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";

export const getAllImages = createAsyncThunk(
    "getAllImages",
    async ({ restaurantId }, { rejectWithValue }) => {
        try {
            return axiosGet(`library/allImages/${restaurantId}`)
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
