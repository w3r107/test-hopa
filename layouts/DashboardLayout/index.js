// React Imports
import { useEffect, useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Next Imports
import { useRouter } from "next/router";

// MUI Imports
// import { Icon } from "@mui/material";

// Local Component Imports
import { MDBox, Loader } from "/components";

// Context Imports
import { useMaterialUIController, setLayout } from "/context";

// Firebase Imports
// import { logout } from "Api/firebase";
import { useDispatch } from "react-redux";
import { useRestaurant, getRestaurantInfo } from "store/restaurant/restaurant.slice";
import { getRestaurantId } from "utils/getRestuarantId";

const DashboardLayout = ({ children }) => {
  const dispatcher = useDispatch();
  const router = useRouter();


  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [dispatch, router.pathname]);

  const { data: { loaded } } = useRestaurant()

  useEffect(() => {
    if (!loaded) {
      dispatcher(getRestaurantInfo({ restaurantId: getRestaurantId() }))
        .unwrap()
        .catch(() => {
          router.push("/signin")
        })
    }
  }, [dispatcher])

  return (
    <>
      {!loaded && <Loader message={"Loading Restaurant Info..."} />}
      <MDBox
        suppressHydrationWarning={true}
        sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
          p: 3,
          position: "relative",

          [breakpoints.up("xl")]: {
            marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
            transition: transitions.create(["margin-left", "margin-right"], {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.standard,
            }),
          },
        })}
      >
        {/* <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <MDButton
            onClick={handleLogout}
            variant="gradient"
            color="dark"
            size="medium"
          >
            <Icon>logout</Icon>&nbsp;
            {t("LOGOUT")}
          </MDButton>
        </div> */}
        {children}
      </MDBox>
    </>
  );
};

export default DashboardLayout;
