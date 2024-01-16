import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "utils/axiosConfig";

export const getAllChanges = createAsyncThunk(
    "getAllChanges",
    async ({ restaurantId }, { rejectWithValue }) => {
        try {
            return axiosGet(`changes/all/${restaurantId}`)
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

export const addOptionToChanges = createAsyncThunk(
    "addOptionToChanges",
    async ({ data }, { rejectWithValue }) => {
        try {
            return axiosPost(`changes/addChangesOption`, data)
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

export const removeChangesOption = createAsyncThunk(
    "removeChangesOption",
    async ({ data }, { rejectWithValue }) => {
        try {
            return axiosDelete(`changes/removeChangesOption`, data)
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

export const updateOption = createAsyncThunk(
    "updateOption",
    async ({ data }, { rejectWithValue }) => {
        try {
            return axiosPatch(`changes/updateOption`, data)
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

export const updateOptionOrder = createAsyncThunk(
    "updateOptionOrder",
    async ({ data }, { rejectWithValue }) => {
        try {
            return axiosPatch(`changes/updateOption`, data)
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


export const addChanges = createAsyncThunk(
    "addChanges",
    async ({ data }, { rejectWithValue }) => {
        try {
            return axiosPost(`changes/addChanges`, data)
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

export const updateChanges = createAsyncThunk(
    "updateChanges",
    async ({ data }, { rejectWithValue }) => {
        try {
            return axiosPatch(`changes/updateChanges`, data)
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

export const deleteChanges = createAsyncThunk(
    "deleteChanges",
    async ({ data }, { rejectWithValue }) => {
        try {
            return axiosDelete(`changes/deleteChanges`, data)
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



