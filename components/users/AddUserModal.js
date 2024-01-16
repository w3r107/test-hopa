import React from 'react'


// material UI Components
import {
    Dialog,
    DialogTitle,
    DialogActions,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";

// Local Component Imports
import { MDBox, MDButton, ErrorMessage, FormField } from "/components";
import { MDTypography } from "components";
import { useTranslation } from 'react-i18next';


import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { addRestaurantUser, updateRestaurantUser } from 'store/restaurant/restaurant.actions';
import { useRestaurant } from 'store/restaurant/restaurant.slice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = ({ children, onClose, ...other }) => {
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").label("Employee Name"),
    email: Yup.string().label("Employee Email"),
    password: Yup.string().label("Employee Password"),
});


const initialValues = {
    name: "",
    email: "",
    password: "",
};

const AddUserModal = ({ modalState, modalData, onClose, showLoader }) => {
    const { t: translate } = useTranslation();
    const language = Cookies.get("i18next") || "he";

    const dispatch = useDispatch();
    const { data } = useRestaurant();

    useEffect(() => {
        if (modalState === "edit") {
            console.log(modalData);
            setValues(modalData)
        }
    }, [modalState])

    const onSubmit = () => {
        if (modalState === "add") {
            showLoader(true, "ADDING_RESTAURANT_USER")
            dispatch(addRestaurantUser({
                ...values,
                restaurantId: data?.id
            }))
                .unwrap()
                .then((res) => {
                    toast.success(translate("USER.RESTAURANT_USER_ADDED_SUCCESS"))
                    setValues(initialValues)
                    onClose()
                })
                .catch((err) => {
                    toast.error(translate("USER.RESTAURANT_USER_ADDED_FAILED"))
                }).finally(() => {
                    showLoader(false)
                })
        } else if (modalState === "edit") {
            showLoader(true, "UPDATING_RESTAURANT_USER")
            dispatch(updateRestaurantUser({
                ...values,
                userId: values?.userId,
                restaurantId: data?.id
            }))
                .unwrap()
                .then((res) => {
                    toast.success(translate("USER.RESTAURANT_USER_UPDATE_SUCCESS"))
                    setValues(initialValues)
                    onClose()
                })
                .catch((err) => {
                    toast.error(translate("USER.RESTAURANT_USER_UPDATE_FAILED"))
                }).finally(() => {
                    showLoader(false)
                })
        }
    }

    const {
        handleChange,
        handleSubmit,
        setFieldTouched,
        setValues,
        values,
        errors,
        touched,
    } = useFormik({ initialValues, onSubmit, validationSchema });

    return (
        <BootstrapDialog
            open={modalState === "add" || modalState === "edit"}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            fullWidth
            maxWidth={"lg"}
        >
            <BootstrapDialogTitle id="customized-dialog-title"
                onClose={onClose}
            >
                {translate("CHANGES.ADD_NEW_CHANGES")}
            </BootstrapDialogTitle>

            <form onSubmit={handleSubmit}>
                <MDTypography mt={2} ml={3} variant="h5">
                    {translate("USER.USER_NAME")}
                </MDTypography>
                <MDBox
                    dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
                >
                    <MDBox p={2}>
                        <FormField
                            type="text"
                            onChange={handleChange("name")}
                            onBlur={() => setFieldTouched("name")}
                            label={translate("PLACEHOLDER.USER_NAME")}
                            value={values?.name || ""}
                        />
                        <ErrorMessage
                            error={errors?.name}
                            visible={touched?.name}
                        />
                    </MDBox>
                </MDBox>
                <MDTypography mt={2} ml={3} variant="h5">
                    {translate("USER.USER_EMAIL")}
                </MDTypography>
                <MDBox
                    dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
                >
                    <MDBox p={2}>
                        <FormField
                            type="text"
                            onChange={handleChange("email")}
                            onBlur={() => setFieldTouched("email")}
                            label={translate("PLACEHOLDER.USER_EMAIL")}
                            value={values?.email || ""}
                        />
                        <ErrorMessage
                            error={errors?.email}
                            visible={touched?.email}
                        />
                    </MDBox>
                </MDBox>
                {modalState === "add" && (
                    <>
                        <MDTypography mt={2} ml={3} variant="h5">
                            {translate("USER.USER_PASSWORD")}
                        </MDTypography>
                        <MDBox
                            dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
                        >
                            <MDBox p={2}>
                                <FormField
                                    type="password"
                                    onChange={handleChange("password")}
                                    onBlur={() => setFieldTouched("password")}
                                    label={translate("PLACEHOLDER.USER_PASSWORD")}
                                    value={values?.password || ""}
                                />
                                <ErrorMessage
                                    error={errors?.password}
                                    visible={touched?.password}
                                />
                            </MDBox>
                        </MDBox>
                    </>
                )}
                <DialogActions>
                    <MDButton type="submit" variant="gradient" color="dark" size="medium">
                        {translate("BUTTON.SAVE")}
                    </MDButton>
                </DialogActions>
            </form>

        </BootstrapDialog>
    )
}

export default AddUserModal