import React, { useState, useEffect, useRef } from "react";

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

import { orderActions, useOrder } from "store/order/order.slice";
import { getAllOrders, updateOrderStatus } from "store/order/order.action";
import { getRestaurantId } from "utils/getRestuarantId";
import OrdersActions from "components/orders/OrdersActions";
import { WSURL } from "utils/axiosConfig";



const statusOptions = [
  { value: "processing", color: "#ff8c00", typ: "open" },
  { value: "pending", color: "#ff8c00", typ: "open" },
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

  const { isLoading, loaded, orders } = useOrder()

  const showSnackbar = (success, message) => {
    setSnackbarProps({ ...snackbarProps, success, message, visible: true });
  };

  const socketRef = useRef(null);
  const reconnectTimeout = useRef(1000);




  const getOrderAndSetModal = (order) => {
    setViewModal(order)
  }

  useEffect(() => {
    if (!loaded) {
      setLoaderMessage(translate("LOADING.ORDERS_LOADING"))
      dispatch(getAllOrders({
        restaurantId: getRestaurantId()
      }))
    }
  }, [loaded])


  const getStatusColor = (value) => {

    const mergedOptions = [...statusOptions, ...data.statuses];
    return mergedOptions.find(s => String(s.value).toLowerCase() === String(value).toLowerCase())?.color;
  }

  const connectWebSocket = () => {
    socketRef.current = new WebSocket(`${WSURL}/v1/ws/orders`);
    // const ws=new WebSocket();

    // if(!localStorage.getItem("restaurantId")) return;
    console.log("Instance Created");

    console.log(socketRef.current.readyState);

    socketRef.current.addEventListener("open", (ev) => {
      if (socketRef.current.readyState !== socketRef.current.OPEN) return;
      console.log("Connection Opened");
      socketRef.current.send(JSON.stringify({
        type: "connect",
        clientId: localStorage.getItem("restaurantId")
      }))
    })


    socketRef.current.addEventListener("message", (message) => {
      if (socketRef.current.readyState !== socketRef.current.OPEN) return;
      console.log("message", message);
      const { type, data } = JSON.parse(message?.data);
      if (type === "newOrder") {
        dispatch(orderActions.addOrder(data));

      }
    })



    socketRef.current.addEventListener('close', () => {
      console.log('WebSocket connection closed');

      // Attempt to reconnect using exponential backoff
      setTimeout(() => { // Exponential backoff
        connectWebSocket();
      }, reconnectTimeout.current);
    });

  };

  useEffect(() => {
    connectWebSocket();

    // Clean up the WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);


  const formatPhoneNumber = (value) => {
    if (value.startsWith('+972')) {
      return '0' + value.substring(4);
    } else if (value.startsWith('972')) {
      return '0' + value.substring(3);
    }
    return value;
  }

  const updateStatus = (orderData) => {
		setLoaderMessage("LOADING.UPDATING_ORDER_STATUS")
		dispatch(updateOrderStatus({
			restaurantId: getRestaurantId(),
			data: {
				orderId: orderData?.id,
				status: 'delivered',
				userId: orderData?.userId
			}
		}))
			.unwrap()
			.then(() => {
				showSnackbar(true, translate("TOAST.ORDER_STATUS_UPDATE_SUCCESS"))
			})
			.catch(() => {
				showSnackbar(false, translate("TOAST.ORDER_STATUS_UPDATE_FAILURE"))
			})
			.finally(() => {
				setLoaderMessage("")
			})
	}

  const formatDateTime = (value) => {
    const date = new Date(value);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const day = date.getDate();
    const month = date.getMonth() + 1;

    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    const formattedDate = `${day}/${month}`;

    return `${formattedTime} , ${formattedDate}`;
  }


  const customerTableData = {
    columns: [
      { 
        Header: translate("ORDERS.CUSTOMER_NAME"), 
        accessor: "user", 
        Cell: ({ value }) => (
          <div style={{ direction: "ltr" }}>
            {value?.firstName} {value?.lastName}
          </div>
        ),
    },
      
      {
        Header: translate("ORDERS.PHONE_NUMBER"),
        accessor: "phoneNo",
        Cell: ({ value }) => (
          <div style={{ direction: "ltr" }}>
            {formatPhoneNumber(value)}
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
            {formatDateTime(value)}
            {/* {moment(value).locale("he").fromNow()} */}
          </div>;
        },
      },
      // {
      //   Header: translate("ORDERS.ORDER_TABLE"),
      //   accessor: "order.table",
      // },
      {
        Header: translate("ORDERS.STATUS"),
        accessor: "status",
        Cell: ({ value }) => {
          return <Status color={getStatusColor(value)} text={value} />;
        },
      },
      // {
      //   Header: translate("ORDERS.PAYMENT_STATUS"),
      //   accessor: "paymentStatus",
      //   Cell: ({ value }) => {
      //     return <Status color="#4BB543" text="Success" />;
      //   },
      // },
      {
        Header: translate("ORDERS.ACTION"),
        Cell: (data) => {
          return (<>
            <MDButton
              style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
              onClick={() => getOrderAndSetModal(data.row.original)}
              variant="gradient"
              color="dark"
              size="small"
            >
              {translate("ORDERS.VIEW")}
            </MDButton>
            <MDButton
              style={{ width: "10%", alignSelf: "center", marginBottom: 10, marginLeft: 10 ,marginRight: 10 }}
              onClick={() => updateStatus(data.row.original)}
              variant="gradient"
              color="dark"
              size="small"
            >
              {translate("ORDERS.DONE")}
            </MDButton>
          </>
          );
        },
      },
      {
        Header: translate("ORDERS.OTHER_ACTIONS"),
        Cell: (data) => {
          return (<>
            <MDButton
              style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
              variant="gradient"
              color="error"
              size="small"
            >
              {translate("CANCEL")}
            </MDButton>
          </>
          );
        },

      }
    ],
    rows: orders,
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
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <OrdersActions />
        <MDBox pb={3}>
          <Card style={{ minHeight: "calc(100vh - 120px)" }}>
            {true
              ?
              (
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
          showSnackbar={showSnackbar}
          open={viewModal}
          onClose={() => setViewModal(null)}
          setLoaderMessage={setLoaderMessage}
        />
      </DashboardLayout>
    </>
  );
};

Orders.auth = true;

export default Orders;
