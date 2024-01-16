import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Backdrop, CircularProgress } from "@mui/material";
import DashboardLayout from "/layouts/DashboardLayout";
import {
  MDSnackbar,
  MDButton,
  Loader,
  Header,
  MDBox,
  FormField,
} from "/components";

import { updateRestaurantInfo, useRestaurant } from "store/restaurant/restaurant.slice";
import { MDTypography } from "components";
import AddStatus from "/components/status/AddStatus";
import { useDispatch } from "react-redux";
import { getRestaurantId } from "utils/getRestuarantId";


const Status = ({ color, text }) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          padding: "2px 10px",
          backgroundColor: color,
          fontWeight: "bold",
          color: "white",
          borderRadius: "20px",
          fontSize: "12px",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Statuses = () => {
  const dispatch = useDispatch();

  const { t: translate } = useTranslation();
  const [modal, setModal] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("LOADING.FETCHING_STATUSES");
  const [loading, setLoading] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState({
    success: false,
    message: "",
    visible: false,
  });

  const showSnackbar = (success, message) => {
    setSnackbarProps({ ...snackbarProps, success, message, visible: true });
  };


  const { isLoading, data } = useRestaurant();

  const onSubmitStatus = async (statusData) => {

    setLoading(true);
    setLoaderMessage("LOADING.ADDING_STATUS")
    dispatch(updateRestaurantInfo({
      restaurantId: getRestaurantId(),
      data: {
        statuses: [
          ...data.statuses,
          statusData
        ]
      }
    }))
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("STATUSES.STATUS_SAVED_SUCCESSFULLY"));
        setLoading(false);
      })
      .catch(() => {
        showSnackbar(false, translate("STATUSES.ERROR_SAVING_STATUS"));
      })
      .finally(() => {
        setLoading(false);
      })

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
      {isLoading && <Loader message={translate(loaderMessage)} />}
      <DashboardLayout>
        <Header />
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={isLoading || loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Card
          id="basic-info"
          sx={{
            overflow: "visible",
          }}
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          <MDBox pb={3}>
            <MDBox p={2}>
              <MDBox
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <MDTypography my={2} ml={2} variant="h5">
                  {translate("STATUSES.MANAGE_ORDER_STATUSES")}
                </MDTypography>
                <MDButton
                  style={{ alignSelf: "center", marginBottom: 10 }}
                  onClick={() => setModal(true)}
                  variant="gradient"
                  color="dark"
                  size="small"
                >
                  {translate("STATUSES.ADD_STATUS")}
                </MDButton>
              </MDBox>
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
                    width: { xs: "100%", md: "100%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 2 },
                  }}
                >
                  <FormField
                    type="text"
                    disabled
                    label={translate("STATUSES.PROCESSING")}
                    value={"Processing"}
                  />
                </MDBox>
                <MDBox
                  sx={{
                    width: { xs: "100%", md: "100%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 2 },
                  }}
                >
                  <FormField
                    type="text"
                    disabled
                    label={translate("STATUSES.READY")}
                    value={"Ready"}
                  />
                </MDBox>
                <MDBox
                  sx={{
                    width: { xs: "100%", md: "100%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 2 },
                  }}
                >
                  <FormField
                    type="text"
                    disabled
                    label={translate("STATUSES.DELIVERED")}
                    value={"Delivered"}
                  />
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>
          <MDBox p={2} ml={2}>
            <MDTypography variant="body">
              {translate("STATUSES.CURRENT_STATUS_COLORS")}
            </MDTypography>
          </MDBox>
          <MDBox p={2} ml={2} style={{ display: "flex", flexWrap: "wrap" }}>
            {data?.statuses?.map((item, index) => (
              <MDBox mr={2} key={index}>
                <Status text={item.value} color={item.color} />
              </MDBox>
            ))}
          </MDBox>
        </Card>
        <AddStatus
          isOpen={modal}
          setOpen={setModal}
          onSubmitStatus={onSubmitStatus}
        />
      </DashboardLayout>
    </>
  );
};

Statuses.auth = true;

export default Statuses;
