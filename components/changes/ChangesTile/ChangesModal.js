// React Imports
import React, { useEffect } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";

// material UI Components
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    IconButton,
    TextField,
    Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";

// Local Component Imports
import { MDBox, MDButton, ErrorMessage, FormField } from "/components";
import { MDTypography } from "components";

// Firebase Imporst
import { useDispatch } from "react-redux";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { useMenuCtx } from "context/menuContext";
import { useChangesCtx } from "context/changesContext";
import { addChanges, addOptionToChanges, updateChanges, updateOption } from "store/changes/changes.action";
import { getRestaurantId } from "utils/getRestuarantId";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

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



const initialValues = {
    id: "",
    title: {
        he: "",
        en: "",
        es: "",
        ru: "",
        ar: "",
        fr: ""
    }
};

const ChangesModal = () => {
    const { t: translate } = useTranslation();
    const language = Cookies.get("i18next") || "he";

    const dispatch = useDispatch();
    const { data } = useRestaurant();

    const validationSchema = Yup.object().shape({
        title: Yup.object().shape({
            he: Yup.string().label("Change Name in Hebrew"),
            en: Yup.string().label("Change Name in English"),
            es: Yup.string().label("Change Name in Spanish"),
            ru: Yup.string().label("Change Name in Russian"),
            ar: Yup.string().label("Change Name in Arabic"),
            fr: Yup.string().label("Change Name in French"),
        }),
        description: Yup.object().shape({
            he: Yup.string().label("Change Description in Hebrew"),
            en: Yup.string().label("Change Description in English"),
            es: Yup.string().label("Change Description in Spanish"),
            ru: Yup.string().label("Change Description in Russian"),
            ar: Yup.string().label("Change Description in Arabic"),
            fr: Yup.string().label("Change Description in French"),
        }),
        maxChoices: Yup.number()
            .min(0, "Max choices must be greater than or equal to 0")
            .nullable()
            .transform((value, originalValue) => (originalValue === "" || originalValue === 0 ? null : value)),
    
        minChoices: Yup.number()
            .min(0, "Min choices must be greater than or equal to 0")
            .nullable()
            .transform((value, originalValue) => (originalValue === "" || originalValue === 0 ? null : value))
            .when("maxChoices", (maxChoices, schema) =>
                maxChoices != null ? schema.max(maxChoices, translate("CHANGES.MIN_GREATER_THAN_MAX")) : schema
            ),
    });

    const {
        changesFormOpened, setChangesFormOpened,
        changesFormData, showSnackbar, showLoader
    } = useChangesCtx();

    useEffect(() => {
        if (changesFormOpened === "edit") {

            setValues(changesFormData);
        } else if (changesFormOpened === "add") {
            const { id } = changesFormData;
            setValues({
                ...initialValues,
                id
            });
        }
    }, [changesFormOpened]);

    const onSubmit = (values) => {
        if (changesFormOpened === "add") {
            showLoader(true, translate("LOADING.ADDING_CHANGES"))
            dispatch(addChanges({
                data: {
                    restaurantId: getRestaurantId(),
                    title: values?.title,
                    description: values?.description,
                    maxChoices: values?.maxChoices,
                    minChoices: values?.minChoices,
                }
            }))
                .unwrap()
                .then(() => {
                    showSnackbar(true, translate("TOAST.ADD_CHANGES_SUCCESS"))
                })
                .catch(() => {
                    showSnackbar(false, translate("TOAST.ADD_CHANGES_FAILURE"))
                })
                .finally(() => {
                    setChangesFormOpened("")
                    showLoader(false)
                })
            // for edit parent category 
        } else if (changesFormOpened === "edit") {
            const updateData = {
                restaurantId: getRestaurantId(),
                changesId: values?.id,
                title: values?.title,
                description: values?.description,
                maxChoices: values?.maxChoices,
                minChoices: values?.minChoices,
            }
            showLoader(true, translate("LOADING.UPDATING_CHANGES"))

            dispatch(updateChanges({ data: updateData }))
                .unwrap()
                .then(() => {
                    showSnackbar(true, translate("TOAST.EDIT_CHANGES_SUCCESS"))
                })
                .catch(() => {
                    showSnackbar(false, translate("TOAST.EDIT_CHANGES_FAILURE"))
                })
                .finally(() => {
                    setChangesFormOpened("")
                    showLoader(false)
                })
        }
    };

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
            open={changesFormOpened === "add" || changesFormOpened === "edit"}
            onClose={() => setChangesFormOpened("")}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            fullWidth
            maxWidth={"lg"}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setChangesFormOpened("")}>
                {changesFormOpened === "add" ? translate("CHANGES.ADD_NEW_CHANGES") : translate("CHANGES.EDIT_CHANGE") }
            </BootstrapDialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Card
                        id="basic-info"
                        sx={{
                            overflow: "visible",
                        }}
                    >
                        <MDTypography mt={2} ml={3} variant="h5">
                            {translate("CHANGES.ENTER_CHANGES_NAME")}
                        </MDTypography>
                        <MDBox
                            dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
                            pb={3}
                        >
                            <MDBox p={2}>
                                <FormField
                                    type="text"
                                    onChange={handleChange("title.he")}
                                    onBlur={() => setFieldTouched("title.he")}
                                    label={translate("PLACEHOLDER.CHANGES_LABEL_HE")}
                                    value={values?.title?.he || ""}
                                />
                                <ErrorMessage
                                    error={errors?.title?.he}
                                    visible={touched?.title?.he}
                                />
                            </MDBox>
                        </MDBox>
                        {data?.showLanguages?.en && (
                            <MDBox
                                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                                pb={3}
                            >
                                <MDBox p={2}>
                                    <FormField
                                        type="text"
                                        onChange={handleChange("title.en")}
                                        onBlur={() => setFieldTouched("title.en")}
                                        label={translate("PLACEHOLDER.CHANGES_LABEL_EN")}
                                        value={values?.title?.en || ""}
                                    />
                                    <ErrorMessage
                                        error={errors.title?.en}
                                        visible={touched.title?.en}
                                    />
                                </MDBox>
                            </MDBox>
                        )}
                        {data?.showLanguages?.es && (
                            <MDBox
                                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                                pb={3}
                            >
                                <MDBox p={2}>
                                    <FormField
                                        type="text"
                                        onChange={handleChange("title.es")}
                                        onBlur={() => setFieldTouched("title.es")}
                                        label={translate("PLACEHOLDER.CHANGES_LABEL_ES")}
                                        value={values?.title?.es || ""}
                                    />
                                    <ErrorMessage
                                        error={errors.title?.es}
                                        visible={touched.title?.es}
                                    />
                                </MDBox>
                            </MDBox>
                        )}
                        {data?.showLanguages?.ru && (
                            <MDBox
                                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                                pb={3}
                            >
                                <MDBox p={2}>
                                    <FormField
                                        type="text"
                                        onChange={handleChange("title.ru")}
                                        onBlur={() => setFieldTouched("title.ru")}
                                        label={translate("PLACEHOLDER.CHANGES_LABEL_RU")}
                                        value={values?.title?.ru || ""}
                                    />
                                    <ErrorMessage
                                        error={errors.title?.ru}
                                        visible={touched.title?.ru}
                                    />
                                </MDBox>
                            </MDBox>
                        )}
                        {data?.showLanguages?.ar && (
                            <MDBox
                                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                                pb={3}
                            >
                                <MDBox p={2}>
                                    <FormField
                                        type="text"
                                        onChange={handleChange("title.ar")}
                                        onBlur={() => setFieldTouched("title.ar")}
                                        label={translate("PLACEHOLDER.CHANGES_LABEL_AR")}
                                        value={values?.title?.ar || ""}
                                    />
                                    <ErrorMessage
                                        error={errors.title?.ar}
                                        visible={touched.title?.ar}
                                    />
                                </MDBox>
                            </MDBox>
                        )}
                        {data?.showLanguages?.fr && (
                            <MDBox
                                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                                pb={3}
                            >
                                <MDBox p={2}>
                                    <FormField
                                        type="text"
                                        onChange={handleChange("title.fr")}
                                        onBlur={() => setFieldTouched("title.fr")}
                                        label={translate("PLACEHOLDER.CHANGES_LABEL_FR")}
                                        value={values?.title?.fr || ""}
                                    />
                                    <ErrorMessage
                                        error={errors.title?.fr}
                                        visible={touched.title?.fr}
                                    />
                                </MDBox>
                            </MDBox>
                        )}
                        {/* CHANGES DESCRIPTION */}

                        <MDTypography mt={2} ml={3} variant="h5">
                            {translate("CHANGES.ENTER_CHANGES_DESCRIPTION")}
                        </MDTypography>

                        <MDBox
                            sx={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                            }}
                        >
                            <MDBox
                                sx={{
                                    width: { xs: "100%", md: "50%" },
                                    py: { xs: 1 },
                                    px: { xs: 0, md: 1 },
                                }}
                            >
                                <TextField
                                    type="text"
                                    onChange={handleChange("description.he")}
                                    onBlur={() => setFieldTouched("description.he")}
                                    label={translate("EDITMODAL.CHANGE_DESCRIPTION_HE")}
                                    value={values?.description?.he}
                                    rows={4}
                                    multiline
                                    fullWidth
                                />
                                <ErrorMessage
                                    error={errors.description?.he}
                                    visible={touched.description?.he}
                                />
                            </MDBox>
                            {data?.showLanguages?.en && (
                                <MDBox
                                    sx={{
                                        width: { xs: "100%", md: "50%" },
                                        py: { xs: 1 },
                                        px: { xs: 0, md: 1 },
                                    }}
                                >
                                    <TextField
                                        type="text"
                                        onChange={handleChange("description.en")}
                                        onBlur={() => setFieldTouched("description.en")}
                                        label={translate("EDITMODAL.CHANGE_DESCRIPTION_EN")}
                                        value={values?.description?.en}
                                        rows={4}
                                        multiline
                                        fullWidth
                                    />
                                </MDBox>
                            )}
                            {data?.showLanguages?.es && (
                                <MDBox
                                    sx={{
                                        width: { xs: "100%", md: "50%" },
                                        py: { xs: 1 },
                                        px: { xs: 0, md: 1 },
                                    }}
                                >
                                    <TextField
                                        type="text"
                                        onChange={handleChange("description.es")}
                                        onBlur={() => setFieldTouched("description.es")}
                                        label={translate("EDITMODAL.CHANGE_DESCRIPTION_ES")}
                                        value={values?.description?.es}
                                        rows={4}
                                        multiline
                                        fullWidth
                                    />
                                </MDBox>
                            )}
                            {data?.showLanguages?.ru && (
                                <MDBox
                                    sx={{
                                        width: { xs: "100%", md: "50%" },
                                        py: { xs: 1 },
                                        px: { xs: 0, md: 1 },
                                    }}
                                >
                                    <TextField
                                        type="text"
                                        onChange={handleChange("description.ru")}
                                        onBlur={() => setFieldTouched("description.ru")}
                                        label={translate("EDITMODAL.CHANGE_DESCRIPTION_RU")}
                                        value={values?.description?.ru}
                                        rows={4}
                                        multiline
                                        fullWidth
                                    />
                                </MDBox>
                            )}
                            {data?.showLanguages?.ar && (
                                <MDBox
                                    sx={{
                                        width: { xs: "100%", md: "50%" },
                                        py: { xs: 1 },
                                        px: { xs: 0, md: 1 },
                                    }}
                                >
                                    <TextField
                                        type="text"
                                        onChange={handleChange("description.ar")}
                                        onBlur={() => setFieldTouched("description.ar")}
                                        label={translate("EDITMODAL.CHANGE_DESCRIPTION_AR")}
                                        value={values?.description?.ar}
                                        rows={4}
                                        multiline
                                        fullWidth
                                    />
                                </MDBox>
                            )}
                            {data?.showLanguages?.fr && (
                                <MDBox
                                    sx={{
                                        width: { xs: "100%", md: "50%" },
                                        py: { xs: 1 },
                                        px: { xs: 0, md: 1 },
                                    }}
                                >
                                    <TextField
                                        type="text"
                                        onChange={handleChange("description.fr")}
                                        onBlur={() => setFieldTouched("description.fr")}
                                        label={translate("EDITMODAL.CHANGE_DESCRIPTION_FR")}
                                        value={values?.description?.fr}
                                        rows={4}
                                        multiline
                                        fullWidth
                                    />
                                </MDBox>
                            )}
                        </MDBox>


                        <Grid container mt={1} spacing={3}>
                            {/* Max choices block */}
                            <Grid item xs={12} sm={6}>
                                <MDTypography mt={2} ml={3} variant="h5">
                                    {translate("CHANGES.MAX_CHOICES")}
                                </MDTypography>
                                <MDTypography mt={1} px={2} variant="subtitle2" fontSize="small">
                                    {translate("CHANGES.MAX_INDICATOR")}
                                </MDTypography>
                                <MDTypography px={2} variant="subtitle2" fontSize="small">
                                    {translate("CHANGES.MAX_WARNING")}
                                </MDTypography>
                                <MDBox dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"} pb={3} sx={{ width: "50%" }}>
                                    <MDBox p={2}>
                                        <FormField
                                            type="number"
                                            onChange={handleChange("maxChoices")}
                                            onBlur={() => setFieldTouched("maxChoices")}
                                            label={translate("CHANGES.MAX_CHOICES")}
                                            value={values?.maxChoices || ""}
                                        />
                                        <ErrorMessage
                                            error={errors.maxChoices}
                                            visible={touched.maxChoices}
                                        />
                                    </MDBox>
                                </MDBox>
                            </Grid>

                            {/* Min choices block */}
                            <Grid item xs={12} sm={6}>
                                <MDTypography mt={2} ml={3} variant="h5">
                                    {translate("CHANGES.MIN_CHOICES")}
                                </MDTypography>
                                <MDTypography mt={1} px={2} variant="subtitle2" fontSize="small">
                                    {translate("CHANGES.MIN_INDICATOR")}
                                </MDTypography>
                                <MDTypography px={2} variant="subtitle2" fontSize="small">
                                    {translate("CHANGES.MIN_WARNING")}
                                </MDTypography>
                                <MDBox dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"} pb={3} sx={{ width: "50%" }}>
                                    <MDBox p={2}>
                                        <FormField
                                            type="number"
                                            onChange={handleChange("minChoices")}
                                            onBlur={() => setFieldTouched("minChoices")}
                                            label={translate("CHANGES.MIN_CHOICES")}
                                            value={values?.minChoices || ""}
                                        />
                                        <ErrorMessage
                                            error={errors.minChoices}
                                            visible={touched.minChoices}
                                        />
                                    </MDBox>
                                </MDBox>
                            </Grid>
                        </Grid>







                    </Card>
                </DialogContent>
                <DialogActions>
                    <MDButton type="submit" variant="gradient" color="dark" size="medium">
                        {translate("BUTTON.SAVE")}
                    </MDButton>
                </DialogActions>
            </form>
        </BootstrapDialog>
    );
};

export default ChangesModal;
