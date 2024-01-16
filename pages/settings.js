// React Imports
import React, { useState, useEffect } from "react";
// External Package Imports
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
// MUI Imports
import { Card, Grid, Tooltip } from "@mui/material";
// Layout Imports
import DashboardLayout from "/layouts/DashboardLayout";
// Local Component Imports
import {
  ErrorMessage,
  ImageCroper,
  MDSnackbar,
  LogoImage,
  FormField,
  MDButton,
  Loader,
  Header,
  MDBox,
} from "/components";
import { DeleteSettingLogoAndImageModal } from "/components/setting";

// Redux Imports
import { useDispatch } from "react-redux";
import { MDTypography } from "components";
import { getRestaurantId } from "utils/getRestuarantId";
import { updateRestaurantInfo } from "store/restaurant/restaurant.actions";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// Initial Values for useFormik Hook
const initialValues = {
  name: {
    he: "",
    en: "",
    ru: "",
    ar: "",
    es: "",
    fr: "",
  },
  description: {
    he: "",
    en: "",
    ru: "",
    ar: "",
    es: "",
    fr: "",
  },
  bottom_description: {
    he: "",
    en: "",
    ru: "",
    ar: "",
    es: "",
    fr: "",
  },
  image: "",
  logo: "",
  orderNumber: 0,
  AdminCode: 0,
};

// Yup Validation Schema for useFormik Hook
const validationSchema = Yup.object().shape({
  name: Yup.object().shape({
    he: Yup.string().required().label("Restaurant Name in Hebrew is required"),
    en: Yup.string().label("Restaurant Name in English"),
    es: Yup.string().label("Restaurant Name in Spanish"),
    ar: Yup.string().label("Restaurant Name in Arabic"),
    ru: Yup.string().label("Restaurant Name in Russian"),
    fr: Yup.string().label("Restaurant Name in French"),
  }),
  description: Yup.object().shape({
    he: Yup.string().required().label("Description in Hebrew"),
    en: Yup.string().label("Description in English"),
    es: Yup.string().label("Description in Spanish"),
    ar: Yup.string().label("Description in Arabic"),
    ru: Yup.string().label("Description in Russian"),
    fr: Yup.string().label("Description in French"),
  }),
  bottom_description: Yup.object().shape({
    he: Yup.string().required().label("Description in Hebrew"),
    en: Yup.string().label("Description in English"),
    es: Yup.string().label("Description in Spanish"),
    ar: Yup.string().label("Description in Arabic"),
    ru: Yup.string().label("Description in Russian"),
    fr: Yup.string().label("Description in French"),
  }),
  orderNumber: Yup.number().label("Order number"),
});

const Settings = () => {
  const { t: translate } = useTranslation();

  const [loaderMessage, setLoaderMessage] = useState("");
  const [isDeleteLogoAndImageModalOpen, setIsDeleteLogoAndImageModalOpen] = useState(false);
  const [selectedLogoAndImage, setSelectedLogoAndImage] = useState({});

  const [logo, setLogo] = useState("")
  const [background, setBackground] = useState("")

  const [snackbarProps, setSnackbarProps] = useState({
    success: false,
    message: "",
    visible: false,
  });

  const [showAdminCode, setShowAdminCode] = useState(false);
  const [adminCode, setAdminCode] = useState('');


  const showSnackbar = (success, message) => {
    setSnackbarProps({ ...snackbarProps, success, message, visible: true });
  };

  const dispatch = useDispatch();
  const { isLoading, data } = useRestaurant();

  useEffect(() => {

    if (data.loaded) {
      setLogo(data?.logo || "");
      setBackground(data?.background || "");

      setValues({
        name: data?.name,
        description: data?.description,
        bottom_description: data?.bottom_description,
        showLanguages: data?.showLanguages,
        orderNumber: data?.orderNumber || 1,
      })
      setAdminCode(data?.adminCode || '');
      // setMaskedAdminCode(data?.adminCode ? maskValue(data.adminCode) : '');
    }
  }, [data.loaded]);

  const onSubmit = (values) => {
    setLoaderMessage(translate("SETTINGMODAL.SAVING_RESTAURANT_INFO"));


    const updateData = {
      name: values?.name,
      description: values?.description,
      bottom_description: values?.bottom_description,
      orderNumber: values?.orderNumber,
      adminCode: adminCode,
      background: background || "",
      logo: logo || ""
    }

    dispatch(updateRestaurantInfo({
      restaurantId: getRestaurantId(),
      data: updateData
    }))
      .then(({ payload }) => {
        if (payload.success) {
          showSnackbar(true, translate("TOAST.PROFILE_SUCCESS"));
          setLoaderMessage("");
        } else {
          showSnackbar(false, translate("TOAST.PROFILE_FAILURE"));
          setLoaderMessage("");
        }
      });
  };

  const {
    handleChange,
    setValues,
    setFieldTouched,
    errors,
    touched,
    values
  } = useFormik({ initialValues, onSubmit });


  const removeFileFunction = (type) => {
    setSelectedLogoAndImage(type);
    setIsDeleteLogoAndImageModalOpen(true);
  };

  const removeLogoAndImage = () => {
    if (selectedLogoAndImage === "background") {
      setBackground("")
    } else if (selectedLogoAndImage === "logo") {
      setLogo("")
    }
    setIsDeleteLogoAndImageModalOpen(false);
  }


  const handleAdminCodeChange = (event) => {
    setAdminCode(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowAdminCode(!showAdminCode);
  };



  return (
    <>
      <MDSnackbar
        icon="notifications"
        title={translate("HOPATITLE")}
        content={snackbarProps.message}
        open={snackbarProps.visible}
        color={snackbarProps.success ? "success" : "error"}
        close={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        autoHideDuration={300}
      />

      <DeleteSettingLogoAndImageModal
        isOpen={isDeleteLogoAndImageModalOpen}
        handleClose={() => setIsDeleteLogoAndImageModalOpen(false)}
        onDeleteImage={removeLogoAndImage}
      />
      {isLoading && <Loader message={loaderMessage} />}
      <DashboardLayout>
        <Header />
        <Card
          id="basic-info"
          sx={{
            overflow: "visible",
          }}
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          <ImageCroper
            onSave={(file) => setBackground(file)}
            value={background}
            ratio={9 / 6}
            removeFileFunction={() => {
              removeFileFunction("background");
            }}
          />
          <LogoImage
            onSave={(file) => setLogo(file)}
            value={logo}
            ratio={1 / 1}
            circularCrop={true}
            removeFileFunction={() => {
              removeFileFunction("logo");
            }}
          />
          <MDBox pb={3}>
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("SETTINGMODAL.ENTER_RESTAURANT_NAME")}
            </MDTypography>
            <MDBox p={2}>
              <FormField
                type="text"
                onChange={handleChange("name.he")}
                onBlur={() => setFieldTouched("name.he")}
                label={translate("SETTINGMODAL.NAME_PLACEHOLDER_HE")}
                value={values?.name?.he}
              />
              <ErrorMessage
                error={errors.name?.he}
                visible={touched.name?.he}
              />
              {values?.showLanguages?.en && (
                <MDBox pt={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.en")}
                    onBlur={() => setFieldTouched("name.en")}
                    label={translate("SETTINGMODAL.NAME_PLACEHOLDER_EN")}
                    value={values?.name?.en || ""}
                  />
                </MDBox>
              )}
              {values?.showLanguages?.ru && (
                <MDBox pt={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.ru")}
                    onBlur={() => setFieldTouched("name.ru")}
                    label={translate("SETTINGMODAL.NAME_PLACEHOLDER_RU")}
                    value={values?.name?.ru || ""}
                  />
                </MDBox>
              )}
              {values?.showLanguages?.ar && (
                <MDBox pt={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.ar")}
                    onBlur={() => setFieldTouched("name.ar")}
                    label={translate("SETTINGMODAL.NAME_PLACEHOLDER_AR")}
                    value={values?.name?.ar || ""}
                  />
                </MDBox>
              )}
              {values?.showLanguages?.es && (
                <MDBox pt={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.es")}
                    onBlur={() => setFieldTouched("name.es")}
                    label={translate("SETTINGMODAL.NAME_PLACEHOLDER_ES")}
                    value={values?.name?.es || ""}
                  />
                </MDBox>
              )}
              {values?.showLanguages?.fr && (
                <MDBox pt={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.fr")}
                    onBlur={() => setFieldTouched("name.fr")}
                    label={translate("SETTINGMODAL.NAME_PLACEHOLDER_FR")}
                    value={values?.name?.es || ""}
                  />
                </MDBox>
              )}


              <MDTypography mt={2} ml={1} variant="h5">
                {translate("SETTINGMODAL.ENTER_RESTAURANT_DESCRIPTION")}
              </MDTypography>
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
                    onChange={handleChange("description.he")}
                    onBlur={() => setFieldTouched("description.he")}
                    label={translate("SETTINGMODAL.DESCRIPTION_PLACEHOLDER_HE")}
                    value={values?.description?.he}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.he}
                    visible={touched.description?.he}
                  />
                </MDBox>
                {values?.showLanguages?.en && (
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
                      onBlur={() => setFieldTouched("name.en")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_EN"
                      )}
                      value={values?.description?.en}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.ru && (
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
                      onBlur={() => setFieldTouched("name.ru")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_RU"
                      )}
                      value={values?.description?.ru}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.ar && (
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
                      onBlur={() => setFieldTouched("name.ar")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_AR"
                      )}
                      value={values?.description?.ar}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.es && (
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
                      onBlur={() => setFieldTouched("name.es")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_ES"
                      )}
                      value={values?.description?.es}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.fr && (
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
                      onBlur={() => setFieldTouched("name.fr")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_FR"
                      )}
                      value={values?.description?.fr}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
              </MDBox>

              <MDTypography mt={2} ml={1} variant="h5">
                {translate("ENTER_BOTTOM_DESCRIPTION")}
              </MDTypography>
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
                    onChange={handleChange("bottom_description.he")}
                    onBlur={() => setFieldTouched("bottom_description.he")}
                    label={translate("SETTINGMODAL.DESCRIPTION_PLACEHOLDER_HE")}
                    value={values?.bottom_description?.he}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.bottom_description?.he}
                    visible={touched.bottom_description?.he}
                  />
                </MDBox>
                {values?.showLanguages?.en && (
                  <MDBox
                    sx={{
                      width: { xs: "100%", md: "50%" },
                      py: { xs: 1 },
                      px: { xs: 0, md: 1 },
                    }}
                  >
                    <FormField
                      type="text"
                      onChange={handleChange("bottom_description.en")}
                      onBlur={() => setFieldTouched("bottom_description.en")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_EN"
                      )}
                      value={values?.bottom_description?.en}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.ru && (
                  <MDBox
                    sx={{
                      width: { xs: "100%", md: "50%" },
                      py: { xs: 1 },
                      px: { xs: 0, md: 1 },
                    }}
                  >
                    <FormField
                      type="text"
                      onChange={handleChange("bottom_description.ru")}
                      onBlur={() => setFieldTouched("bottom_description.ru")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_RU"
                      )}
                      value={values?.bottom_description?.ru}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.ar && (
                  <MDBox
                    sx={{
                      width: { xs: "100%", md: "50%" },
                      py: { xs: 1 },
                      px: { xs: 0, md: 1 },
                    }}
                  >
                    <FormField
                      type="text"
                      onChange={handleChange("bottom_description.ar")}
                      onBlur={() => setFieldTouched("bottom_description.ar")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_AR"
                      )}
                      value={values?.bottom_description?.ar}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.es && (
                  <MDBox
                    sx={{
                      width: { xs: "100%", md: "50%" },
                      py: { xs: 1 },
                      px: { xs: 0, md: 1 },
                    }}
                  >
                    <FormField
                      type="text"
                      onChange={handleChange("bottom_description.es")}
                      onBlur={() => setFieldTouched("bottom_description.es")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_ES"
                      )}
                      value={values?.bottom_description?.es}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
                {values?.showLanguages?.fr && (
                  <MDBox
                    sx={{
                      width: { xs: "100%", md: "50%" },
                      py: { xs: 1 },
                      px: { xs: 0, md: 1 },
                    }}
                  >
                    <FormField
                      type="text"
                      onChange={handleChange("bottom_description.fr")}
                      onBlur={() => setFieldTouched("bottom_description.fr")}
                      label={translate(
                        "SETTINGMODAL.DESCRIPTION_PLACEHOLDER_FR"
                      )}
                      value={values?.bottom_description?.fr}
                      rows={4}
                      multiline
                    />
                  </MDBox>
                )}
              </MDBox>
              <Grid container mt={1} spacing={3}>
                <Grid item xs={12} sm={6}>
                  <MDTypography mt={2} ml={1} variant="h5">
                    {translate("ENTER_ORDER_NUMBER")}
                  </MDTypography>
                  <MDBox mt={3} mb={1} mr={0} lineHeight={0}></MDBox>

                  <FormField
                    type="number"
                    onChange={handleChange("orderNumber")}
                    onBlur={() => setFieldTouched("orderNumber")}
                    label={translate("SETTINGMODAL.ORDER_NUMBER")}
                    value={values?.orderNumber}
                  />
                  <ErrorMessage
                    error={errors.orderNumber}
                    visible={touched.orderNumber}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MDTypography mt={2} ml={1} variant="h5">
                    {translate("SETTINGMODAL.ADMIN_CODE")}
                  </MDTypography>
                  <MDBox mt={3} mb={1} mr={0} lineHeight={0} ></MDBox>

                  <FormField
                    type={showAdminCode ? "text" : "password"}
                    onChange={handleAdminCodeChange}
                    onBlur={() => setFieldTouched("adminCode")}
                    label={translate("SETTINGMODAL.ADMIN_CODE")}
                    value={adminCode}
                    autocomplete="off"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={togglePasswordVisibility}>
                          {showAdminCode ? <Visibility style={{ fontSize: 'medium' }} /> : <VisibilityOff style={{ fontSize: 'medium' }} />}
                        </IconButton>
                      ),
                    }}
                  />


                </Grid>
              </Grid>



            </MDBox>
          </MDBox>
          {isLoading ? (
            <Tooltip title={translate("BUTTON.PLEASE_WAIT")} placement="top">
              <MDButton
                style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
                onClick={isLoading ? () => { } : () => onSubmit(values)}
                variant="gradient"
                color="dark"
                size="small"
              >
                {translate("BUTTON.SAVE")}
              </MDButton>
            </Tooltip>
          ) : (
            <MDButton
              style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
              onClick={() => onSubmit(values)}
              variant="gradient"
              color="dark"
              size="small"
              disabled={isLoading}
            >
              {translate("BUTTON.SAVE")}
            </MDButton>
          )}
        </Card>{" "}
      </DashboardLayout>
    </>
  );
};

Settings.auth = true;

export default Settings;
