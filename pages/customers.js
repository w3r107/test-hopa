import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Card, Backdrop, CircularProgress } from "@mui/material";
import DashboardLayout from "/layouts/DashboardLayout";
import { MDSnackbar, Loader, Header, MDBox, MDButton } from "/components";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { MDTypography } from "components";
import DataTable from "./../examples/Tables/DataTable";
import OrderList from "/components/customers/OrderList";
import { useCustomer } from "store/customer/customer.slice";
import { getAllCustomers } from "store/customer/customer.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { useDispatch } from "react-redux";

const Customers = () => {
  const { t: translate } = useTranslation();

  const { data } = useRestaurant();
  const { isLoading, loaded, customers } = useCustomer();

  const dispatch = useDispatch();


  const [isFetchingCustomers, setFetchingCustomers] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [viewModal, setViewModal] = useState(null);

  const [snackbarProps, setSnackbarProps] = useState({
    success: false,
    message: "",
    visible: false,
  });

  const showSnackbar = (success, message) => {
    setSnackbarProps({ ...snackbarProps, success, message, visible: true });
  };

  useEffect(() => {
    if (!loaded) {
      dispatch(getAllCustomers({
        restaurantId: getRestaurantId()
      }))
    }
  }, [loaded])


  const customerTableData = {
    columns: [
      { Header: translate("CUSTOMERS.CUSTOMER_ID"), accessor: "user.id" },
      { Header: translate("CUSTOMERS.CUSTOMER_NAME"), accessor: "user.name" },
      { Header: translate("CUSTOMERS.CUSTOMER_EMAIL"), accessor: "user.email" },
      // { Header: translate("CUSTOMERS.CUSTOMER_PHONE_NUMBER"), accessor: "user.phone" },
      // { Header: translate("CUSTOMERS.CUSTOMER_ADDRESS"), accessor: "user.address" },
      { Header: translate("CUSTOMERS.CUSTOMER_ORDERS"), accessor: "orderCount" },
      {
        Header: translate("CUSTOMERS.CUSTOMER_AMOUNT"),
        accessor: "total",
        Cell: ({ value }) => {
          return <>{`${data?.currency}${value}`}</>;
        },
      },
      {
        Header: translate("ORDERS.VIEW"),
        Cell: (data) => {
          return (
            <MDButton
              style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
              onClick={() => setViewModal(data.row.original)}
              variant="gradient"
              color="dark"
              size="small"
            >
              {translate("ORDERS.VIEW")}
            </MDButton>
          );
        },
      },
    ],
    rows: customers,
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
      {isLoading && <Loader message={loaderMessage} />}
      <DashboardLayout>
        <Header />
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={isFetchingCustomers}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <MDBox pb={3}>
          <Card style={{ minHeight: "calc(100vh - 120px)" }}>
            {!loaded || customers.length > 0 ? (
              <>
                <MDBox p={3} lineHeight={1}>
                  <MDTypography variant="h5" fontWeight="medium">
                    {translate("CUSTOMERS.CUSTOMER_LIST")}
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    {translate("CUSTOMERS.CUSTOMER_LIST_DETAIL")}
                  </MDTypography>
                </MDBox>
                <DataTable table={customerTableData} canSearch />
              </>
            ) : (
              <MDBox
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                py={10}
              >
                <p style={{ width: "70%" }}>
                  {translate("FEATURE_NOT_AVAILABLE")}
                </p>
              </MDBox>
            )}
          </Card>
        </MDBox>
        <OrderList open={viewModal} onClose={() => setViewModal(null)} />
      </DashboardLayout>
    </>
  );
};

Customers.auth = true;

export default Customers;
