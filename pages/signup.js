// Exteral Package Imports
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

// Next Imports
import Link from "next/link";
// MUI Imports
import Card from "@mui/material/Card";

// Local Component Imports
import {
  Loader,
  MDBox,
  MDTypography,
  MDButton,
  FormField,
  ErrorMessage,
} from "/components";

// Layout Imports
import CoverLayout from "/layouts/CoverLayout";

// Asset Imports
import bgImage from "/assets/images/bg-sign-up-cover.jpeg";

// Redux Imports
import { useDispatch } from "react-redux";

import router from 'next/router'
import { signupRestaurant } from "store/auth/auth.action";
import { toast } from "react-toastify";

// Initial Values for useFormik Hook
const initialValues = {
  restaurantName: "",
  email: "",
  password: "",
};

// Validation Schema for useFormik Hook
const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string()
    .required()
    .email("Please enter a valid Email")
    .label("Email"),
  password: Yup.string().required().label("Password"),
});

const Signup = () => {


  const { t: translate } = useTranslation();


  // Routes from the Redux Store
  const dispatch = useDispatch();

  // Form Submit Handler
  const onSubmit = async (values) => {
    // signup user here

    const singupAction = await dispatch(signupRestaurant({
      data: {
        ...values,
        role: "RESTAURANT_ADMIN"
      }
    }))

    const { success, message } = singupAction.payload;

    if (!success) {
      toast.error(translate(message))
    } else {
      toast.success(translate("SIGNUP_SUCCESSFUL"))
      router.push("/signin")
    }

  };

  const { handleChange, handleSubmit, setFieldTouched, errors, touched } =
    useFormik({ initialValues, onSubmit, validationSchema });

  return (
    <CoverLayout image={bgImage}>
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
            {translate("SIGNUP.TITLE")}
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            {translate("SIGNUP.SUBHEADING")}
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox role="form">
            <MDBox mb={2}>
              <FormField
                type="text"
                onChange={handleChange("name")}
                onBlur={() => setFieldTouched("name")}
                label={translate("SIGNUP.NAME")}
              />
              <ErrorMessage error={errors.name} visible={touched.name} />
            </MDBox>
            <MDBox mb={2}>
              <FormField
                type="email"
                onChange={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                label={translate("SIGNUP.EMAIL")}
              />
              <ErrorMessage error={errors.email} visible={touched.email} />
            </MDBox>
            <MDBox mb={2}>
              <FormField
                type="password"
                onChange={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                label={translate("SIGNUP.PASSWORD")}
              />
              <ErrorMessage
                error={errors.password}
                visible={touched.password}
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={handleSubmit}
                variant="gradient"
                color="dark"
                fullWidth
              >
                {translate("SIGNUP.SIGNUP")}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                {translate("SIGNUP.ALREADY_REGISTERED")}{" "}
                <Link href="/signin">
                  <a>
                    <MDTypography
                      variant="button"
                      color="dark"
                      fontWeight="medium"
                      textGradient
                    >
                      {translate("SIGNUP.SIGNIN")}
                    </MDTypography>
                  </a>
                </Link>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
};

export default Signup;
