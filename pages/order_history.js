import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Card, Backdrop, CircularProgress } from "@mui/material";
import DashboardLayout from "/layouts/DashboardLayout";
import { MDSnackbar, Header, MDBox, MDButton } from "/components";
import { useDispatch } from "react-redux";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { Loader, MDTypography } from "components";
import DataTable from "./../examples/Tables/DataTable";

import OrderModal from "/components/orders/OrderModal";
import moment from "moment";

import { useOrder } from "store/order/order.slice";
import { getOrderHistory } from "store/order/order.action";
import { getRestaurantId } from "utils/getRestuarantId";

const statusOptions = [
    { value: "processing", color: "#ff8c00", typ: "open" },
    { value: "ready", color: "#b3c100", typ: "open" },
    { value: "delivered", color: "#0e6ba8", typ: "open" },
];


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

const Orders = () => {

    const { t: translate } = useTranslation();
    const dispatch = useDispatch();

    const { data } = useRestaurant();

    const [viewModal, setViewModal] = useState(null);
    const [loaderMessage, setLoaderMessage] = useState("");

    const [snackbarProps, setSnackbarProps] = useState({
        success: false,
        message: "",
        visible: false,
    });

    const { isLoading, orderHistoryLoaded, orderHistory } = useOrder()

    const showSnackbar = (success, message) => {
        setSnackbarProps({ ...snackbarProps, success, message, visible: true });
    };


    const getOrderAndSetModal = (order) => {
        setViewModal(order)
    }

    useEffect(() => {
        if (!orderHistoryLoaded) {
            setLoaderMessage(translate("LOADING.ORDER_HISTORY_LOADING"))
            dispatch(getOrderHistory({
                restaurantId: getRestaurantId()
            }))
        }
    }, [orderHistoryLoaded])

    const getStatusColor = (value) => {
        const mergedOptions = [...statusOptions, ...data.statuses];
        return mergedOptions.find(s => String(s.value).toLowerCase() === String(value).toLowerCase()).color;
    }

    const customerTableData = {
        columns: [
            { Header: translate("ORDERS.CUSTOMER_NAME"), accessor: "user.name" },
            {
                Header: translate("ORDERS.PHONE_NUMBER"),
                accessor: "user.email",
                Cell: ({ value }) => (
                    <div style={{ direction: "ltr" }}>
                        {value}
                    </div>
                ),
            },
            {
                Header: translate("ORDERS.ORDER_PRICE"),
                accessor: "total",
                Cell: ({ value }) => {
                    return <>{`${data?.currency} ${value}`}</>;
                },
            },
            {
                Header: translate("ORDERS.ORDER_TIMESTAMP"),
                accessor: "date",
                Cell: ({ value }) => {
                    return <div>
                        {moment(value).locale("he").fromNow()}
                    </div>;
                },
            },
            {
                Header: translate("ORDERS.ORDER_TABLE"),
                accessor: "order.table",
            },
            {
                Header: translate("ORDERS.STATUS"),
                accessor: "status",
                Cell: ({ value }) => {
                    return <Status color={getStatusColor(value)} text={value} />;
                },
            },
            {
                Header: translate("ORDERS.PAYMENT_STATUS"),
                accessor: "paymentStatus",
                Cell: ({ value }) => {
                    return <Status color="#4BB543" text="Success" />;
                },
            },
            {
                Header: translate("ORDERS.ACTION"),
                Cell: (data) => {
                    return (
                        <MDButton
                            style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
                            onClick={() => getOrderAndSetModal(data.row.original)}
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
        rows: orderHistory,
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
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <MDBox pb={3}>
                    <Card style={{ minHeight: "calc(100vh - 120px)" }}>
                        {true ? (
                            <>
                                <MDBox p={3} lineHeight={1}>
                                    <MDTypography variant="h5" fontWeight="medium">
                                        {translate("ORDERS.ORDER_LIST")}
                                    </MDTypography>
                                    <MDTypography variant="button" color="text">
                                        {translate("ORDERS.ORDER_LIST_DETAIL")}
                                    </MDTypography>
                                </MDBox>
                                <DataTable table={customerTableData} canSearch addAction />
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
                <OrderModal
                    open={viewModal}
                    type="no_update"
                    onClose={() => setViewModal(null)}
                />
            </DashboardLayout>
        </>
    );
};

Orders.auth = true;

export default Orders;
