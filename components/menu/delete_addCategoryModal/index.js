// React Imports
import React from "react";

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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";

// Local Component Imports
import { MDBox, MDButton, ErrorMessage, FormField } from "/components";
import { MDTypography } from "components";

// Firebase Imporst
import { useDispatch } from "react-redux";
import { appendCategories } from "store/restaurant/restaurant.slice";
import { useRestaurant } from "store/restaurant/restaurant.slice";

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

const validationSchema = Yup.object().shape({
  category: Yup.object().shape({
    he: Yup.string().required("Required").label("Category Name in Hebrew"),
    en: Yup.string().label("Category Name in English"),
    es: Yup.string().label("Category Name in Spanish"),
    ru: Yup.string().label("Category Name in Russian"),
    ar: Yup.string().label("Category Name in Arabic"),
  }),
  category_description: Yup.object().shape({
    he: Yup.string().label("Category description in Hebrew"),
    en: Yup.string().label("Category description in English"),
    es: Yup.string().label("Category description in Spanish"),
    ru: Yup.string().label("Category description in Russian"),
    ar: Yup.string().label("Category description in Arabic"),
  }),
});

const initialValues = {
  category: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
  },
  category_description: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
  },
};

const CategoryModal = ({
  isOpen,
  handleClose,
  setLoaderMessage,
  showSnackbar,
}) => {
  const { t: translate } = useTranslation();
  const language = Cookies.get("i18next") || "he";
  const { data } = useRestaurant();

  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    setLoaderMessage(translate("CATEGORY_MODAL.UPLOADING_CATEGORY_DATA"));
    const categoryData = {
      // categoryId: uuidv4(),
      name: { ...values.category },
      description: { ...values.category_description },
    };
    setLoaderMessage(translate("CATEGORY_MODAL.ADDING_CATEOGORY"));
    dispatch(appendCategories([categoryData])).then(({ payload }) => {
      setLoaderMessage("");
      handleClose();
      if (payload.success) {
        showSnackbar(true, translate("TOAST.ADD_CATEGORY_SUCCESS"));
      }
    });
  };
  const { handleChange, handleSubmit, setFieldTouched, errors, touched } =
    useFormik({ initialValues, onSubmit, validationSchema });

  return (
    <BootstrapDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth
      maxWidth={"lg"}
    >
      {/* {JSON.stringify(language)}
      {JSON.stringify(data?.showLanguages)} */}

      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {translate("AddANewCategory")}
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
              {translate("ENTER_CATEGORY_NAME")}
            </MDTypography>
            <MDBox
              dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
              pb={3}
            >
              <MDBox p={2}>
                <FormField
                  type="text"
                  onChange={handleChange("category.he")}
                  onBlur={() => setFieldTouched("category.he")}
                  label={translate("PLACEHOLDER.DISHLABEL")}
                />
                <ErrorMessage
                  error={errors.category?.he}
                  visible={touched.category?.he}
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
                    onChange={handleChange("category.en")}
                    onBlur={() => setFieldTouched("category.en")}
                    label={translate("PLACEHOLDER.DISHLABEL_EN")}
                  />
                  <ErrorMessage
                    error={errors.category?.en}
                    visible={touched.category?.en}
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
                    onChange={handleChange("category.es")}
                    onBlur={() => setFieldTouched("category.es")}
                    label={translate("PLACEHOLDER.DISHLABEL_ES")}
                  />
                  <ErrorMessage
                    error={errors.category?.es}
                    visible={touched.category?.es}
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
                    onChange={handleChange("category.ru")}
                    onBlur={() => setFieldTouched("category.ru")}
                    label={translate("PLACEHOLDER.DISHLABEL_RU")}
                  />
                  <ErrorMessage
                    error={errors.category?.ru}
                    visible={touched.category?.ru}
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
                    onChange={handleChange("category.ar")}
                    onBlur={() => setFieldTouched("category.ar")}
                    label={translate("PLACEHOLDER.DISHLABEL_AR")}
                  />
                  <ErrorMessage
                    error={errors.category?.ar}
                    visible={touched.category?.ar}
                  />
                </MDBox>
              </MDBox>
            )}
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("ENTER_CATEGORY_DESCRIPTION")}
            </MDTypography>
            <MDBox mt={3} mb={1} mx={0} lineHeight={0}></MDBox>
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
                <FormField
                  type="text"
                  onChange={handleChange("category_description.he")}
                  onBlur={() => setFieldTouched("category_description.he")}
                  label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_HE")}
                  rows={4}
                  multiline
                />
                <ErrorMessage
                  error={errors.category_description?.he}
                  visible={touched.category_description?.he}
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
                  <FormField
                    type="text"
                    onChange={handleChange("category_description.en")}
                    onBlur={() => setFieldTouched("category_description.en")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_EN")}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.category_description?.en}
                    visible={touched.category_description?.en}
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
                  <FormField
                    type="text"
                    onChange={handleChange("category_description.es")}
                    onBlur={() => setFieldTouched("category_description.es")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_ES")}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.category_description?.es}
                    visible={touched.category_description?.es}
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
                  <FormField
                    type="text"
                    onChange={handleChange("category_description.ru")}
                    onBlur={() => setFieldTouched("category_description.ru")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_RU")}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.category_description?.ru}
                    visible={touched.category_description?.ru}
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
                  <FormField
                    type="text"
                    onChange={handleChange("category_description.ar")}
                    onBlur={() => setFieldTouched("category_description.ar")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_AR")}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.category_description?.ar}
                    visible={touched.category_description?.ar}
                  />
                </MDBox>
              )}
            </MDBox>
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

export default CategoryModal;
