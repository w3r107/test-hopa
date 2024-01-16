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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";

// Local Component Imports
import { MDBox, MDButton, ErrorMessage, FormField } from "/components";
import { MDTypography } from "components";

// Firebase Imporst
import { useDispatch } from "react-redux";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { addNewCategory, updateCategory } from "store/category/category.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { useMenuCtx } from "context/menuContext";
import { toast } from "react-toastify";
import DishParentCategoryDropdown from "../dishParentCategoryDropdown.js";
import { useChanges } from "store/changes/changes.slice.js";
import ChangesDropdown from "components/changes/ChangesDropdown/index.js";

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
  name: Yup.object().shape({
    he: Yup.string().required("Required").label("Category Name in Hebrew"),
    en: Yup.string().label("Category Name in English"),
    es: Yup.string().label("Category Name in Spanish"),
    ru: Yup.string().label("Category Name in Russian"),
    ar: Yup.string().label("Category Name in Arabic"),
  }),
  description: Yup.object().shape({
    he: Yup.string().label("Category description in Hebrew"),
    en: Yup.string().label("Category description in English"),
    es: Yup.string().label("Category description in Spanish"),
    ru: Yup.string().label("Category description in Russian"),
    ar: Yup.string().label("Category description in Arabic"),
  }),
});

const initialValues = {
  parentCategoryId: "",
  categoryId: "",
  name: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
  },
  description: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
  },
};

const CategoryModal = () => {
  const { t: translate } = useTranslation();
  const language = Cookies.get("i18next") || "he";

  const dispatch = useDispatch();
  const { data } = useRestaurant();
  const { loaded: changesLoaded, allchanges } = useChanges();

  const {
    showLoader,
    showSnackbar,
    setCategoryFormOpened,
    categoryFormOpened,
    categoryFormData,
  } = useMenuCtx();

  useEffect(() => {
    if (categoryFormOpened === "edit") {
      const { changes } = categoryFormData;
      const changeIds = changes ? Object.keys(changes) : [];
      const allChanges = allchanges.filter((c) => changeIds.includes(c?.id));
      const tempCategoryFormData = { ...categoryFormData };
      tempCategoryFormData["changes"] = allChanges;
      setValues(tempCategoryFormData);
      // setValues(categoryFormData);
    } else {
      const { parentCategoryId } = categoryFormData;
      setValues({
        parentCategoryId,
        name: {
          en: "",
          he: "",
          es: "",
          ar: "",
          ru: "",
          fr: "",
        },
        description: {
          en: "",
          he: "",
          es: "",
          ar: "",
          ru: "",
          fr: "",
        },
        changes: [],
      });
    }
  }, [categoryFormOpened]);

  const onSubmit = (values) => {
    if (!values.parentCategoryId)
      return showSnackbar(
        false,
        translate("TOAST.PARENT_CATEGORY_ID_REQUIRED")
      );
    // add parent category
    if (categoryFormOpened === "add") {
      showLoader(true, translate("LOADING.ADDING_CATEGORY"));
      const tempValue = values;
      const getChangesIds = {};

      values.changes.forEach((c) => {
        getChangesIds[c.id] = true;
      });
      tempValue["changes"] = getChangesIds;
      dispatch(
        addNewCategory({
          data: {
            restaurantId: getRestaurantId(),
            ...tempValue,
            // ...values,
          },
        })
      )
        .unwrap()
        .then(() => {
          setCategoryFormOpened("");
          showSnackbar(true, translate("TOAST.ADD_CATEGORY_SUCCESS"));
        })
        .catch(() => {
          showSnackbar(false, translate("TOAST.ADD_CATEGORY_FAILURE"));
        })
        .finally(() => {
          showLoader(false);
        });
      // for edit parent category
    } else if (categoryFormOpened === "edit") {
      if (!categoryFormData.id) {
        showSnackbar(false, translate("TOAST.CATEGORY_ID_REQUIRED"));
        return;
      }
      showLoader(true, translate("LOADING.UPDATING_CATEGORY"));
      const tempValue = values;
      const getChangesIds = {};

      values.changes.forEach((c) => {
        getChangesIds[c.id] = true;
      });
      tempValue["changes"] = getChangesIds;
      dispatch(
        updateCategory({
          data: {
            restaurantId: getRestaurantId(),
            categoryId: categoryFormData.id,
            ...tempValue,
            ...values,
          },
        })
      )
        .unwrap()
        .then(() => {
          setCategoryFormOpened("");
          showSnackbar(true, translate("TOAST.EDIT_CATEGORY_SUCCESS"));
        })
        .catch(() => {
          showSnackbar(false, translate("TOAST.EDIT_CATEGORY_FAILURE"));
        })
        .finally(() => {
          showLoader(false);
        });
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
    setFieldValue,
  } = useFormik({ initialValues, onSubmit, validationSchema });

  return (
    <BootstrapDialog
      open={categoryFormOpened === "add" || categoryFormOpened === "edit"}
      onClose={() => setCategoryFormOpened("")}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth
      maxWidth={"lg"}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => setCategoryFormOpened("")}
      >
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
                  onChange={handleChange("name.he")}
                  onBlur={() => setFieldTouched("name.he")}
                  label={translate("PLACEHOLDER.DISHLABEL")}
                  value={values?.name?.he || ""}
                />
                <ErrorMessage
                  error={errors?.name?.he}
                  visible={touched?.name?.he}
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
                    onChange={handleChange("name.en")}
                    onBlur={() => setFieldTouched("name.en")}
                    label={translate("PLACEHOLDER.DISHLABEL_EN")}
                    value={values?.name?.en || ""}
                  />
                  <ErrorMessage
                    error={errors.name?.en}
                    visible={touched.name?.en}
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
                    onChange={handleChange("name.es")}
                    onBlur={() => setFieldTouched("name.es")}
                    label={translate("PLACEHOLDER.DISHLABEL_ES")}
                    value={values?.name?.es || ""}
                  />
                  <ErrorMessage
                    error={errors.name?.es}
                    visible={touched.name?.es}
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
                    onChange={handleChange("name.ru")}
                    onBlur={() => setFieldTouched("name.ru")}
                    label={translate("PLACEHOLDER.DISHLABEL_RU")}
                    value={values?.name?.ru || ""}
                  />
                  <ErrorMessage
                    error={errors.name?.ru}
                    visible={touched.name?.ru}
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
                    onChange={handleChange("name.ar")}
                    onBlur={() => setFieldTouched("name.ar")}
                    label={translate("PLACEHOLDER.DISHLABEL_AR")}
                    value={values?.name?.ar || ""}
                  />
                  <ErrorMessage
                    error={errors.name?.ar}
                    visible={touched.name?.ar}
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
                    onChange={handleChange("name.fr")}
                    onBlur={() => setFieldTouched("name.fr")}
                    label={translate("PLACEHOLDER.DISHLABEL_FR")}
                    value={values?.name?.fr || ""}
                  />
                  <ErrorMessage
                    error={errors.name?.fr}
                    visible={touched.name?.fr}
                  />
                </MDBox>
              </MDBox>
            )}

            {categoryFormOpened === "edit" && (
              <>
                <MDBox p={2}>
                  <MDTypography variant="h5">
                    {translate("EDITMODAL.SELECT_PARENT_CATEGORY")}
                  </MDTypography>
                </MDBox>
                <MDBox p={2}>
                  <DishParentCategoryDropdown
                    parentCategoryId={values?.parentCategoryId}
                    onChange={setFieldValue}
                    onCategoryChange={(val) => console.log(val)}
                    label={translate("EDITMODAL.SELECT_PARENT_CATEGORY")}
                  />
                </MDBox>
              </>
            )}
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("ENTER_CHANGES")}
            </MDTypography>
            <MDBox p={2}>
              <ChangesDropdown
                changes={(() => {
                  return allchanges.map((el) => {
                    return {
                      id: el.id,
                      title: el.title,
                    };
                  });
                })()}
                onChange={setFieldValue}
                label={translate("EDITMODAL.SELECT_CHANGES")}
                value={values?.changes}
              />
            </MDBox>

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
                  onChange={handleChange("description.he")}
                  onBlur={() => setFieldTouched("description.he")}
                  label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_HE")}
                  value={values?.description?.he || ""}
                  rows={4}
                  multiline
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
                  <FormField
                    type="text"
                    onChange={handleChange("description.en")}
                    onBlur={() => setFieldTouched("description.en")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_EN")}
                    value={values?.description?.en || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.en}
                    visible={touched.description?.en}
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
                    onChange={handleChange("description.es")}
                    onBlur={() => setFieldTouched("description.es")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_ES")}
                    value={values?.description?.es || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.es}
                    visible={touched.description?.es}
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
                    onChange={handleChange("description.ru")}
                    onBlur={() => setFieldTouched("description.ru")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_RU")}
                    value={values?.description?.ru || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.ru}
                    visible={touched.description?.ru}
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
                    onChange={handleChange("description.ar")}
                    onBlur={() => setFieldTouched("description.ar")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_AR")}
                    value={values?.description?.ar || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.ar}
                    visible={touched.description?.ar}
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
                  <FormField
                    type="text"
                    onChange={handleChange("description.fr")}
                    onBlur={() => setFieldTouched("description.fr")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_FR")}
                    value={values?.description?.fr || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.fr}
                    visible={touched.description?.fr}
                  />
                </MDBox>
              )}
            </MDBox>
          </Card>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <MDButton type="submit" variant="gradient" color="dark" size="medium">
            {translate("BUTTON.SAVE")}
          </MDButton>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
};

export default CategoryModal;
