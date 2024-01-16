import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { MDSnackbar, MDBox, MDButton, Loader, ErrorMessage } from "/components";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ChromePicker } from "react-color";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

const validationSchema = Yup.object().shape({
  title: Yup.string().label("Enter status title").required(),
  color: Yup.string().label("Enter color").required(),
  type: Yup.object().label("Enter type").required(),
});

const initialValues = {
  title: "",
  color: "#000000",
  type: { id: 2, label: "Open", value: "open" },
};

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

const AddStatus = ({ isOpen, setOpen, onSubmitStatus }) => {
  const { t: translate } = useTranslation();
  const [loading, setLoading] = useState({
    visible: false,
    messge: "",
  });
  const [snackbarProps, setSnackbarProps] = useState({
    success: false,
    message: "",
    visible: false,
  });

  const showSnackbar = (success, message) => {
    setSnackbarProps({ ...snackbarProps, success, message, visible: true });
  };

  const onSubmit = async (values) => {
    setOpen(false);
    onSubmitStatus({
      value: values.title,
      color: values.color,
      type: values.type?.value
    });
    setValues(initialValues)
  };

  const {
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    setValues,
    errors,
    touched,
    values
  } = useFormik({ initialValues, onSubmit, validationSchema });

  return (
    <>
      {loading.visible && <Loader message={loading.messge} />}
      <MDSnackbar
        icon="notifications"
        title={translate("HOPATITLE")}
        content={snackbarProps.message}
        open={snackbarProps.visible}
        color={snackbarProps.success ? "success" : "error"}
        close={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        autoHideDuration={300}
      />
      <BootstrapDialog
        open={isOpen}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth
        maxWidth={"md"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
        >
          {translate("STATUSES.ADD_STATUS")}
        </BootstrapDialogTitle>

        <MDBox px={4}>
          <form onSubmit={handleSubmit}>
            <MDBox>
              <MDBox>
                <TextField
                  type="text"
                  onChange={handleChange("title")}
                  onBlur={() => setFieldTouched("title")}
                  label={translate("STATUSES.ENTER_TITLE")}
                  value={values?.title}
                  fullWidth
                />
              </MDBox>
              <ErrorMessage error={errors.title} visible={touched.title} />
            </MDBox>
            <MDBox pt={2}>
              <Autocomplete
                id="country-select-demo"
                sx={{ width: "100%" }}
                options={[
                  { id: 1, label: "Open", value: "open" },
                  { id: 2, label: "Close", value: "close" },
                ]}
                disableClearable
                autoHighlight
                onChange={(event, newValue) => {
                  setFieldValue("type", newValue);
                }}
                value={values.type}
                isOptionEqualToValue={(op, val) => op.id === val.id}
                getOptionLabel={(option) => option?.label || ""}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <h4>{option?.label}</h4>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={translate("STATUSES.ENTER_TYPE")}
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            </MDBox>
            <MDBox pt={2}>
              <ChromePicker
                color={values.color}
                onChange={(newColor) => setFieldValue("color", newColor.hex)}
              />
            </MDBox>
            <DialogActions>
              <MDButton
                type="submit"
                variant="gradient"
                color="dark"
                size="medium"
              >
                {translate("BUTTON.SAVE")}
              </MDButton>
            </DialogActions>
          </form>
        </MDBox>
      </BootstrapDialog>
    </>
  );
};

export default AddStatus;
