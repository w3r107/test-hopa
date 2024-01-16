import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import * as Yup from "yup";

import {
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Dialog,
  Card,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import useFormikHook from "hooks/UseFormikHook";

import {
  MDButton,
  MDSnackbar,
  MDBox,
  FormField,
  ErrorMessage,
  Loader,
} from "/components";

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
    he: Yup.string().required().label("Category Name in Hebrew"),
    en: Yup.string().label("Category Name in English"),
  }),
});

const EditCategoryForm = ({
  categoriesData,
  selectedCategory,
  open,
  handleClose
}) => {
  const { t: translate } = useTranslation();
  const languageDetectors = Cookies.get("i18next") || "he";

  const [loader, setLoader] = useState({ active: false, message: null });
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });
  const showSnackbar = (success, message) => {
    setSnackbarProps({ success, message, visible: true });
  };

  const initialValues = {
    name: {
      he: "",
      en: "",
    },
    restaurantId: categoriesData.restaurantId
      ? categoriesData.restaurantId
      : "",
  };

  const closeModal = () => handleClose();

  const submit = async (values, { resetForm }) => {
    setLoader({ ...loader, active: true, message: "Updating Category Data" });
    let restaurantId = categoriesData.id;

  };

  useEffect(() => {
    setValues({ ...selectedCategory });
  }, [selectedCategory]);

  const {
    handleChange,
    handleSubmit,
    setFieldTouched,
    setValues,
    errors,
    touched,
    values,
  } = useFormikHook(submit, validationSchema, initialValues);

  return (
    <>
      <MDSnackbar
        icon="notifications"
        title={translate("HOPATITLE")}
        content={snackbarProps.message}
        open={snackbarProps.visible}
        color={snackbarProps.success ? "success" : "error"}
        close={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        autoHideDuration={2000}
      />
      <BootstrapDialog
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth
        maxWidth={"lg"}
      >
        {loader.active && <Loader message={loader.message} />}
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {translate("CATEGORY_MODAL.TITLE")}
        </BootstrapDialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Card
              id="basic-info"
              sx={{
                overflow: "visible",
              }}
            >
              <MDBox dir={languageDetectors === "he" ? "rtl" : "ltr"} pb={3}>
                <MDBox p={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.he")}
                    onBlur={() => setFieldTouched("name.he")}
                    label={translate("PLACEHOLDER.DISHLABEL_HE")}
                    value={values?.name?.he}
                  />
                  <ErrorMessage
                    error={errors.name?.he}
                    visible={touched.name?.he}
                  />
                </MDBox>
              </MDBox>
              <MDBox dir={languageDetectors !== "he" ? "ltr" : "rtl"} pb={3}>
                <MDBox p={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.en")}
                    onBlur={() => setFieldTouched("name.en")}
                    label={translate("PLACEHOLDER.DISHLABEL_EN")}
                    value={values?.name?.en}
                  />
                  <ErrorMessage
                    error={errors.category?.en}
                    visible={touched.category?.en}
                  />
                </MDBox>
              </MDBox>
            </Card>{" "}
          </DialogContent>
          <DialogActions>
            <MDButton
              type="submit"
              variant="gradient"
              color="dark"
              size="medium"
              disabled={loader.active}
            >
              {translate("BUTTON.SAVE")}
            </MDButton>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
};

export default EditCategoryForm;
