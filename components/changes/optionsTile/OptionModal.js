// React Imports
import React, { useEffect, useState } from "react";

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

import { useChangesCtx } from "context/changesContext";
import { addOptionToChanges, updateOption } from "store/changes/changes.action";
import { getRestaurantId } from "utils/getRestuarantId";
import EnterOptionTypeDropDown from "./EnterOptionTypeDropDown";
// import EnterOptionTypeDropDown from "./EnterOptionTypeDropdown";

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
  content: Yup.object().shape({
    he: Yup.string().required("Required").label("option Name in Hebrew"),
    en: Yup.string().label("option Name in English"),
    es: Yup.string().label("option Name in Spanish"),
    ru: Yup.string().label("option Name in Russian"),
    ar: Yup.string().label("option Name in Arabic"),
    fr: Yup.string().label("option Name in French"),
  }),
});

const initialValues = {
  changesId: "",
  content: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
    fr: "",
  },
  optionType: 1,
};


const OptionModels = () => {
  const { t: translate } = useTranslation();
  const language = Cookies.get("i18next") || "he";


  const optionTypeArray = [
    { label: translate("CHANGES.NONE"), value: 1 },
    { label: translate("CHANGES.LIGHT"), value: 2 },
    { label: translate("CHANGES.EXTRA"), value: 3 },
    { label: translate("CHANGES.WITH"), value: 4 },
    { label: translate("CHANGES.WITHOUT"), value: 5 },
    { label: translate("CHANGES.INSTEAD"), value: 6 },
    { label: translate("CHANGES.ONLY"), value: 7 },
    { label: translate("CHANGES.ON_THE_SIDE"), value: 8 },
  ];


  const dispatch = useDispatch();
  const { data } = useRestaurant();

  const {
    optionFormData,
    setOptionFormOpened,
    optionFormOpened,
    showSnackbar,
    showLoader,
  } = useChangesCtx();

  useEffect(() => {
    if (optionFormOpened === "edit") {
      const getData = optionTypeArray.find((ot) => ot.value === (optionFormData?.optionType || 0))

      setOptionTypeState(getData);
      setValues(optionFormData);
    } else if (optionFormOpened === "add") {
      const { changesId } = optionFormData;
      setValues({
        ...initialValues,
        changesId,
      });
    }
  }, [optionFormOpened]);

  const onSubmit = (values) => {
    if (!values.changesId) return showSnackbar("changes id not found");
    // add option
    if (optionFormOpened === "add") {

      const tempValue = values;
      tempValue["optionType"] = optionTypeState?.value;

      showLoader(true, translate("LOADING.ADDING_OPTION"));

      dispatch(
        addOptionToChanges({
          data: {
            restaurantId: getRestaurantId(),
            ...tempValue,
            // ...values,
          },
        })
      )
        .unwrap()
        .then(() => {
          showSnackbar(true, translate("TOAST.ADD_OPTION_SUCCESS"));
        })
        .catch(() => {
          showSnackbar(false, translate("TOAST.ADD_OPTION_FAILURE"));
        })
        .finally(() => {
          showLoader(false);
          setOptionFormOpened("");
        });

      // for edit parent options
    } else if (optionFormOpened === "edit") {
      const tempValue = values;
      tempValue["optionType"] = optionTypeState;
      console.log(tempValue);
      const updateData = {
        restaurantId: getRestaurantId(),
        optionId: tempValue.id || tempValue.optionId,
        changesId: tempValue.changesId,
        price: tempValue.price,
        content: tempValue.content,
        optionType: tempValue.optionType?.value,
      };

      showLoader(true, translate("LOADING.UPDATING_OPTION"));

      dispatch(updateOption({ data: updateData }))
        .unwrap()
        .then(() => {
          showSnackbar(true, translate("TOAST.EDIT_OPTION_SUCCESS"));
        })
        .catch(() => {
          showSnackbar(false, translate("TOAST.EDIT_OPTION_FAILURE"));
        })
        .finally(() => {
          showLoader(false);
          setOptionFormOpened("");
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
  } = useFormik({ initialValues, onSubmit, validationSchema });

  const [optionTypeState, setOptionTypeState] = useState({
    label: "None",
    value: 0,
  });

  return (
    <BootstrapDialog
      open={optionFormOpened === "add" || optionFormOpened === "edit"}
      onClose={() => setOptionFormOpened("")}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth
      maxWidth={"lg"}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => setOptionFormOpened("")}
      >
        {translate("CHANGES.ADD_NEW_OPTION")}
      </BootstrapDialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Card
            id="basic-info"
            sx={{
              overflow: "visible",
            }}
          >
            {/* enter option name */}
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("CHANGES.ENTER_OPTION_NAME")}
            </MDTypography>
            <MDBox
              dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
              pb={3}
            >
              <MDBox p={2}>
                <FormField
                  type="text"
                  onChange={handleChange("content.he")}
                  onBlur={() => setFieldTouched("content.he")}
                  label={translate("PLACEHOLDER.OPTION_LABEL_HE")}
                  value={values?.content?.he || ""}
                />
                <ErrorMessage
                  error={errors?.content?.he}
                  visible={touched?.content?.he}
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
                    onChange={handleChange("content.en")}
                    onBlur={() => setFieldTouched("content.en")}
                    label={translate("PLACEHOLDER.OPTION_LABEL_EN")}
                    value={values?.content?.en || ""}
                  />
                  <ErrorMessage
                    error={errors.content?.en}
                    visible={touched.content?.en}
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
                    onChange={handleChange("content.es")}
                    onBlur={() => setFieldTouched("content.es")}
                    label={translate("PLACEHOLDER.OPTION_LABEL_ES")}
                    value={values?.content?.es || ""}
                  />
                  <ErrorMessage
                    error={errors.content?.es}
                    visible={touched.content?.es}
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
                    onChange={handleChange("content.ru")}
                    onBlur={() => setFieldTouched("content.ru")}
                    label={translate("PLACEHOLDER.OPTION_LABEL_RU")}
                    value={values?.content?.ru || ""}
                  />
                  <ErrorMessage
                    error={errors.content?.ru}
                    visible={touched.content?.ru}
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
                    onChange={handleChange("content.ar")}
                    onBlur={() => setFieldTouched("content.ar")}
                    label={translate("PLACEHOLDER.OPTION_LABEL_AR")}
                    value={values?.content?.ar || ""}
                  />
                  <ErrorMessage
                    error={errors.content?.ar}
                    visible={touched.content?.ar}
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
                    onChange={handleChange("content.fr")}
                    onBlur={() => setFieldTouched("content.fr")}
                    label={translate("PLACEHOLDER.OPTION_LABEL_FR")}
                    value={values?.content?.fr || ""}
                  />
                  <ErrorMessage
                    error={errors.content?.fr}
                    visible={touched.content?.fr}
                  />
                </MDBox>
              </MDBox>
            )}

            {/* enter option type */}
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("CHANGES.SELECT_OPTION_TYPE")}
            </MDTypography>
            <MDBox p={2}>
              <EnterOptionTypeDropDown
                // onChange={handleChange("optionType")}
                // onBlur={() => setFieldTouched("price")}
                label={translate("CHANGES.SELECT_OPTION_TYPE")}
                value={optionTypeState}
                setOptionTypeState={setOptionTypeState}
              />
            </MDBox>

            {/*enter option price. */}
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("CHANGES.ENTER_OPTION_PRICE")}
            </MDTypography>

            <MDBox
              dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
              pb={3}
            >
              <MDBox p={2}>
                <FormField
                  type="text"
                  onChange={handleChange("price")}
                  onBlur={() => setFieldTouched("price")}
                  label={translate("PLACEHOLDER.OPTION_PRICE")}
                  value={values?.price || 0}
                />
                <ErrorMessage error={errors.price} visible={touched.price} />
              </MDBox>
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

export default OptionModels;
