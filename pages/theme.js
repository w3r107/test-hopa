import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, RadioGroup, Tooltip } from "@mui/material";
import DashboardLayout from "/layouts/DashboardLayout";
import { MDSnackbar, MDButton, Loader, Header, MDBox } from "/components";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";;
import { useDispatch } from "react-redux";
import { MDTypography } from "components";
import FontDropdown from "components/theme/FontDropdown";
import { useRouter } from "next/router";
import { getRestaurantId } from "utils/getRestuarantId";

import { useRestaurant, updateRestaurantInfo } from "store/restaurant/restaurant.slice";

const initialValues = {
  theme: "",
  font: "",
};

// Yup Validation Schema for useFormik Hook
const validationSchema = Yup.object().shape({
  theme: Yup.string(),
  font: Yup.string(),
});

const fonts = [
  {
    id: 1,
    label: "Open Sans",
    value: "open-sans",
  },
  {
    id: 2,
    label: "Rubik",
    value: "rubik",
  },
  {
    id: 3,
    label: "Heebo",
    value: "heebo",
  },
  {
    id: 4,
    label: "Arimo",
    value: "arimo",
  },
  {
    id: 5,
    label: "Verela Round",
    value: "varela-round",
  },
  {
    id: 6,
    label: "Tinos",
    value: "tinos",
  },
  {
    id: 7,
    label: "Assistant",
    value: "assistant",
  },
];

const Theme = () => {
  const router = useRouter()
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
    setValues(data);
    setFieldValue('theme', data?.theme || 'dark')
    if (data?.font) {

      const fontFound = fonts.find((item) => String(item.value).toLowerCase() === String(data?.font).toLowerCase());
      setFieldValue('font', fontFound)
    } else {
      setFieldValue('font', fonts[0])
    }

  }, [data])


  // on save 
  const onSubmit = (values) => {
    setLoaderMessage("SETTINGMODAL.SAVING_RESTAURANT_INFO")
    dispatch(updateRestaurantInfo({
      restaurantId: getRestaurantId(),
      data: {
        font: values?.font?.value,
        theme: values?.theme
      }
    }))
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.RESTAURANT_INFO_UPDATED_SUCCESS"))
      })
      .catch(() => {
        showSnackbar(true, translate("TOAST.RESTAURANT_INFO_UPDATED_FAILURE"))
      })
  };

  const { setValues, setFieldValue, values } = useFormik({
    initialValues,
    onSubmit,
    validationSchema
  });

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
      {isLoading && <Loader message={translate(loaderMessage)} />}
      <DashboardLayout>
        <Header />
        <Card
          id="basic-info"
          sx={{
            overflow: "visible",
          }}
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          <MDBox>
            <MDBox p={2}>
              <MDTypography variant="h4">
                {translate("THEME.MANAGE_MENU_THEME")}
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox p={2}>
            <MDTypography variant="h6">
              {translate("THEME.CHOOSE_THEME")}
            </MDTypography>
            <MDBox py={2}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={values?.theme}
                onChange={(e) => setFieldValue("theme", e.target.value)}
              >
                <FormControlLabel
                  value="light"
                  control={<Radio />}
                  label={translate("THEME.LIGHT")}
                />
                <FormControlLabel
                  value="dark"
                  control={<Radio />}
                  label={translate("THEME.DARK")}
                />
              </RadioGroup>
            </MDBox>
          </MDBox>
          <MDBox p={2}>
          <MDTypography variant="h6" py={2}>
              {translate("THEME.CHOOSE_MENU_FONT")}
            </MDTypography>
            <FontDropdown
              fonts={fonts}
              onChange={setFieldValue}
              label={translate("THEME.CHOOSE_FONT")}
              value={values?.font}
            />
          </MDBox>

          <MDBox px={2} py={4} style={{ width: "80%", alignSelf: "center" }}>
            <MDTypography variant="p" className={`${values?.font?.value || "rubik"}`}>
              {translate("THEME.SAMPLE_TEXT")}
            </MDTypography>
          </MDBox>

          {isLoading ? (
            <Tooltip title={translate("BUTTON.PLEASE_WAIT")} placement="top">
              <MDButton
                style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
                onClick={() => { }}
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

Theme.auth = true;

export default Theme;
