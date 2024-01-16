import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Tooltip } from "@mui/material";
import DashboardLayout from "/layouts/DashboardLayout";
import Checkbox from "@mui/material/Checkbox";
import {
  MDSnackbar,
  MDButton,
  Loader,
  Header,
  MDBox,
} from "/components";

import FormControlLabel from '@mui/material/FormControlLabel';
import { useMaterialUIController } from "/context";
import { useDispatch } from "react-redux";
import {
  useRestaurant,
  getRestaurantInfo,
  setRestaurantInfo,
} from "store/restaurant/restaurant.slice";
import { MDTypography } from "components";
import { updateRestaurantInfo } from "store/restaurant/restaurant.slice";
import { getRestaurantId } from "utils/getRestuarantId";
const initialValues = {
  showLanguages: {
    he: true,
    en: false,
    ru: false,
    ar: false,
    es: false,
    fr: false,
  }
};

// Yup Validation Schema for useFormik Hook
const validationSchema = Yup.object().shape({
  showLanguages: Yup.object().shape({
    he: Yup.boolean(),
    en: Yup.boolean(),
    es: Yup.boolean(),
    ar: Yup.boolean(),
    ru: Yup.boolean(),
    fr: Yup.boolean()
  })
});

const Languages = () => {
  const router = useRouter();
  const { t: translate } = useTranslation();

  // Managing Loader State
  const [loaderMessage, setLoaderMessage] = useState("");

  // Managing Snackbar State/ Props
  const [snackbarProps, setSnackbarProps] = useState({
    success: false,
    message: "",
    visible: false,
  });
  const showSnackbar = (success, message) => {
    setSnackbarProps({ ...snackbarProps, success, message, visible: true });
  };

  const dispatch = useDispatch();
  const { isLoading, data } = useRestaurant();

  useEffect(() => {
    if (data.loaded) {
      setValues({
        showLanguages: data.showLanguages
      })
    }
  }, [data.loaded]);

  const onSubmit = (values) => {
    setLoaderMessage(translate("SETTINGMODAL.SAVING_RESTAURANT_INFO"));
    dispatch(updateRestaurantInfo({
      restaurantId: getRestaurantId(),
      data: {
        showLanguages: values.showLanguages
      }
    })).then(({ payload }) => {
      if (payload.success) {
        showSnackbar(true, translate("TOAST.PROFILE_SUCCESS"));
        setLoaderMessage("");
      } else {
        showSnackbar(false, translate("TOAST.PROFILE_FAILURE"));
        setLoaderMessage("");
      }
    });
  };

  const { setValues, setFieldValue, values } =
    useFormik({ initialValues, onSubmit, validationSchema });


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
          <MDBox pb={3}>
            <MDBox p={2}>
              <MDTypography my={2} ml={1} variant="h5">
                {translate("SETTINGMODAL.SELECT_LANGUAGE_TO_SHOW")}
              </MDTypography>
              <MDBox ml={3}>
                <FormControlLabel
                  disabled
                  control={<Checkbox disabled defaultChecked={true} checked={true} onChange={(e) => setFieldValue('showLanguages.he', e.target.checked)} />}
                  label={translate('SETTINGMODAL.HEBREW')}
                  defaultChecked={values?.showLanguages?.he}
                  checked={values?.showLanguages?.he}
                />
                <FormControlLabel
                  control={<Checkbox checked={values?.showLanguages?.en} defaultChecked={values?.showLanguages?.en} onChange={(e) => setFieldValue('showLanguages.en', e.target.checked)} />}
                  label={translate('SETTINGMODAL.ENGLISH')}
                  checked={values?.showLanguages?.en}
                  defaultChecked={values?.showLanguages?.en}
                />
                <FormControlLabel
                  control={<Checkbox checked={values?.showLanguages?.ru} defaultChecked={values?.showLanguages?.ru} onChange={(e) => setFieldValue('showLanguages.ru', e.target.checked)} />}
                  label={translate('SETTINGMODAL.RUSSIAN')}
                  checked={values?.showLanguages?.ru}
                  defaultChecked={values?.showLanguages?.ru}
                />
                <FormControlLabel
                  control={<Checkbox checked={values?.showLanguages?.es} defaultChecked={values?.showLanguages?.es} onChange={(e) => setFieldValue('showLanguages.es', e.target.checked)} />}
                  label={translate('SETTINGMODAL.SPANISH')}
                  checked={values?.showLanguages?.es}
                  defaultChecked={values?.showLanguages?.es}
                />
                <FormControlLabel
                  control={<Checkbox checked={values?.showLanguages?.ar} defaultChecked={values?.showLanguages?.ar} onChange={(e) => setFieldValue('showLanguages.ar', e.target.checked)} />}
                  label={translate('SETTINGMODAL.ARABIC')}
                  checked={values?.showLanguages?.ar}
                  defaultChecked={values?.showLanguages?.ar}
                />
                <FormControlLabel
                  control={<Checkbox checked={values?.showLanguages?.fr} defaultChecked={values?.showLanguages?.fr} onChange={(e) => setFieldValue('showLanguages.fr', e.target.checked)} />}
                  label={translate('SETTINGMODAL.FRENCH')}
                  checked={values?.showLanguages?.fr}
                  defaultChecked={values?.showLanguages?.fr}
                />
              </MDBox>
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

Languages.auth = true;

export default Languages;
