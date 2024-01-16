// Next Imports
import { useRouter } from "next/router";
import { useFormik } from "formik";

// External Package Imports
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

// MUI Imports
import Card from "@mui/material/Card";

// Local Component Imports
import {
  Loader,
  MDBox,
  MDTypography,
  MDInput,
  MDButton,
  ErrorMessage,
} from "/components";

// Layout Imports
import CoverLayout from "/layouts/CoverLayout";

// Asset Imports
import bgImage from "/assets/images/bg-sign-in-cover.jpeg";

// Redux Imports
import { useDispatch } from "react-redux";
import { useRestaurant, restaurantActions } from "store/restaurant/restaurant.slice";

import Checkbox from "@mui/material/Checkbox";

import FormControlLabel from "@mui/material/FormControlLabel";
import { loginWithEmailPassword } from "store/auth/auth.action";
import { toast } from "react-toastify";

// Yup Validations for Form
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().label("Password"),
  rememberMe: Yup.boolean().required().label("Remember me"),
});

const Signin = () => {
  // Get the translate manager from react-i18next hook
  const { t: translate } = useTranslation();

  // Get the Next Router from the hook
  const router = useRouter();

  // Routes from the Redux Store
  const dispatch = useDispatch();
  const { isLoading } = useRestaurant();

  // Form Submit Handler
  const onSubmit = async (values) => {
    const loginAction = await dispatch(loginWithEmailPassword(values))
    const { success, message, data } = loginAction.payload;

    if (!success) {
      toast.error("SOMETHING_WENT_WRONG")
    } else {
      toast.success(translate("LOGIN_SUCCESSFUL"))
      localStorage.setItem("restaurantId", data?.restaurantId)
      localStorage.setItem("idToken", data?.idToken);
      localStorage.setItem("rfToken", data?.idToken);

      dispatch(restaurantActions.setRole({ role: data?.role }))

      if (data?.role === "RESTAURANT_ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/orders");
      }
    }
  };

  // Using the useFormik Hook for form
  const {
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    setFieldTouched,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit,
    validationSchema,
  });

  return (
    <CoverLayout image={bgImage}>
      {isLoading && <Loader />}
      <Card>
        <MDBox
          variant="gradient"
          bgColor="dark"
          borderRadius="lg"
          coloredShadow="dark"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            {translate("SIGNIN.TITLE")}
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            {translate("SIGNIN.SUBHEADING")}
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label={translate("SIGNIN.EMAIL")}
                variant="standard"
                fullWidth
                onChange={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                placeholder="john@example.com"
                InputLabelProps={{ shrink: true }}
              />
              <ErrorMessage error={errors.email} visible={touched.email} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label={translate("SIGNIN.PASSWORD")}
                variant="standard"
                fullWidth
                onChange={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <ErrorMessage error={errors.password} visible={touched.password} />

            <MDBox>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values?.rememberMe}
                    onChange={(e) =>
                      setFieldValue("rememberMe", e.target.checked)
                    }
                  />
                }
                label={translate("SIGNIN.REMEMBER_ME")}
                defaultChecked={values?.rememberMe}
                checked={values?.rememberMe}
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={handleSubmit}
                variant="gradient"
                color="dark"
                fullWidth
              >
                {translate("BUTTON.SIGNIN")}
              </MDButton>
            </MDBox>

            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                {translate("SIGNIN.NOT_REGISTERED")} {"  "}
                <Link href="/signup">
                  <a>
                    <MDTypography
                      variant="button"
                      color="dark"
                      fontWeight="medium"
                      textGradient
                    >
                      {translate("SIGNIN.SIGNUP")}
                    </MDTypography>
                  </a>
                </Link>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
};

export default Signin;
