// React Imports
import React, { useState, useEffect } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

// MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  IconButton,
  Grid,
  Tooltip,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Local Package Imports
import {
  MDButton,
  MDBox,
  MDTypography,
  MDSnackbar,
  ErrorMessage,
  FormField,
  DishImageCroper,
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
  dish: Yup.object().shape({
    he: Yup.string().label("Dish Name in Hebrew*"),
    en: Yup.string().label("Dish Name in English"),
  }),
  dishDescription: Yup.object().shape({
    he: Yup.string().label("Description in Hebrew*"),
    en: Yup.string().label("Description in English"),
  }),

  price: Yup.string().label("Price"),
});

const EditModalForm = ({
  open,
  handleClose,
  selectedEditItem,
  close,
  categoriesData,
  onSuccessfulSave,
  currency,
}) => {
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [toast, setToast] = useState(false);

  const { t: translate } = useTranslation();

  const uploadFiletoFirebaseStorage = async (file) => {
    setIsLoading(true);
    setLoadingText("Uploading Image...");

    // upload file to firebase storage 
  };

  const initialValues = {
    dish: {
      he: "",
      en: "",
    },
    dishDescription: {
      he: "",
      en: "",
    },
    price: "",
    currencyValue: "",
    dishId: "",
  };

  const closeModal = () => {
    handleClose();
    setToast(true);
  };

  const submit = (values, { resetForm }) => {
    setIsLoading(true);
    setLoadingText("Uploading Categories Data...");

    let id = categoriesData.id;
    const data1 = {
      ...values,
      image,
      currencyValue: currency,
      dishId: selectedEditItem.dishId,
    };

    categoriesData &&
      categoriesData?.data?.categories?.map((value, index) => {
        if (value.dishes) {
          return value?.dishes.map((x, index) => {
            if (x.dishId === selectedEditItem.dishId) {
              value.dishes[index] = data1;
            }
            return {
              ...x,
            };
          });
        } else {
          return { ...value };
        }
      });


    onSuccessfulSave();
    setIsLoading(false);
    setLoadingText(null);
    setToast(true);
    setTimeout(() => {
      resetForm;
    }, 2000);
  };
  useEffect(() => {
    setValues({ ...selectedEditItem });
    if (selectedEditItem?.image != "") {
      setImage(selectedEditItem?.image);
    }
  }, [selectedEditItem]);

  const {
    handleChange,
    handleSubmit,
    setFieldTouched,
    errors,
    touched,
    values,
    setValues,
  } = useFormik({ initialValues, onSubmit: submit, validationSchema });

  return (
    <>
      {toast && (
        <MDSnackbar
          icon="notifications"
          title={translate("HOPATITLE")}
          content={translate("TOAST.EDIT_DISH_SUCCESS")}
          open={true}
          color={"success"}
          close={() => setToast(false)}
          autoHideDuration={2000}
        />
      )}
      {isLoading && <Loader message={loadingText} />}
      <BootstrapDialog
        open={open}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={close}>
          {translate("EDITMODAL.EDIT_TITLE")}
        </BootstrapDialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Card
              id="basic-info"
              sx={{
                overflow: "visible",
              }}
            >
              <DishImageCroper
                onSave={(e) => {
                  uploadFiletoFirebaseStorage(e);
                }}
                onBlur={() => setFieldTouched("image")}
                value={values?.image}
                ratio={1 / 1}
              />

              <MDBox p={2}>
                <MDTypography variant="h5">
                  {translate("EDITMODAL.SUBTITLE_2")}
                </MDTypography>
              </MDBox>
              <MDBox pb={3}>
                <MDBox p={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("dish.he")}
                    onBlur={() => setFieldTouched("dish.he")}
                    label={translate("EDITMODAL.DISHLABEL_HE")}
                    value={values?.dish?.he}
                  />
                  <ErrorMessage
                    error={errors.values?.dish?.he}
                    visible={touched.values?.dish?.he}
                  />
                  <MDBox pt={2}>
                    <FormField
                      type="text"
                      onChange={handleChange("dish.en")}
                      onBlur={() => setFieldTouched("dish.en")}
                      label={translate("EDITMODAL.DISHLABEL_EN")}
                      value={values?.dish?.en}
                    />
                  </MDBox>

                  <Grid container mt={1} spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        onChange={handleChange("price")}
                        onBlur={() => setFieldTouched("price")}
                        type="number"
                        label={translate("EDITMODAL.PRICE")}
                        value={values.price}
                      />
                      <ErrorMessage
                        error={errors.price}
                        visible={touched.price}
                      />
                    </Grid>
                  </Grid>
                  <MDBox mt={3} mb={1} mr={0} lineHeight={0}></MDBox>
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
                        onChange={handleChange("dishDescription.he")}
                        onBlur={() => setFieldTouched("dishDescription.he")}
                        label={translate("EDITMODAL.DESCRIPTION_HE")}
                        value={values?.dishDescription?.he}
                        rows={4}
                        multiline
                      />
                      <ErrorMessage
                        error={errors.dishDescription?.he}
                        visible={touched.dishDescription?.he}
                      />
                    </MDBox>
                    <MDBox
                      sx={{
                        width: { xs: "100%", md: "50%" },
                        py: { xs: 1 },
                        px: { xs: 0, md: 1 },
                      }}
                    >
                      <FormField
                        type="text"
                        onChange={handleChange("dishDescription.en")}
                        onBlur={() => setFieldTouched("dishDescription.en")}
                        label={translate("EDITMODAL.DESCRIPTION_EN")}
                        value={values?.dishDescription?.en}
                        rows={4}
                        multiline
                      />
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>{" "}
          </DialogContent>
          <DialogActions>
            {isLoading ? (
              <Tooltip title={translate("BUTTON.PLEASE_WAIT")} placement="top">
                <MDButton
                  onClick={isLoading ? () => { } : handleClose}
                  type="submit"
                  variant="gradient"
                  color="dark"
                  size="medium"
                >
                  {translate("BUTTON.SAVE")}
                </MDButton>
              </Tooltip>
            ) : (
              <MDButton
                onClick={handleClose}
                type="submit"
                variant="gradient"
                color="dark"
                size="medium"
                disabled={isLoading}
              >
                {translate("BUTTON.SAVE")}
              </MDButton>
            )}
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
};

export default EditModalForm;
