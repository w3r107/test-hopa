import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { MDBox, MDTypography } from "/components";

import moment from "moment";
import { useRestaurant } from "store/restaurant/restaurant.slice";

const statusOptions = [
  { value: "processing", color: "#ff8c00", typ: "open" },
  { value: "payment-pending", color: "#ff8c00", typ: "open" },
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const findOption = (statuses, value) => {
  const totalStatuses = configureStatusOptions(statuses);
  return totalStatuses.find(
    (item) => item?.value?.toLowerCase() === value?.toLowerCase()
  );
};

const OrderModal = ({ open, onClose }) => {
  const { t: translate } = useTranslation();

  const { data } = useRestaurant();

  const getStatusColor = (value) => {
    const mergedOptions = [...statusOptions, ...data.statuses];
    return mergedOptions.find(s => String(s.value).toLowerCase() === String(value).toLowerCase()).color;
  }

  return (
    <>
      <BootstrapDialog
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth
        maxWidth={"sm"}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          {translate("ORDERS.ORDER_DETAILS")}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <MDBox>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12} lg={12} spacing={2}>
                {open?.orders?.map((item) => {
                  return (
                    <Card style={{ marginTop: "1rem" }}>
                      <MDBox p={2}>
                        <MDBox
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <MDTypography variant="h6" fontWeight="medium">
                            {`${item?.id}`}
                          </MDTypography>
                          <MDBox>
                            <Status color={getStatusColor(item?.status)} text={item?.status} />
                          </MDBox>
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="caption" color="text">
                            {translate("ORDERS.AMOUNT")}:&nbsp;&nbsp;&nbsp;
                            <MDTypography variant="caption" fontWeight="medium">
                              {`${item?.currency} ${item?.total}`}
                            </MDTypography>
                          </MDTypography>
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="caption" color="text">
                            {translate("ORDERS.PAYEMNT_ID")}:&nbsp;&nbsp;&nbsp;
                            <MDTypography variant="caption" fontWeight="medium">
                              {item?.paymentId}
                            </MDTypography>
                          </MDTypography>
                        </MDBox>
                        <MDBox>
                          <MDTypography variant="caption" color="text">
                            {translate("ORDERS.TIMESTAMP")}:&nbsp;&nbsp;&nbsp;
                            <MDTypography variant="caption" fontWeight="medium">
                              {moment(item.date).format("DD-MM-YYYY, hh:mm A")}
                              {/* {item.date?} */}
                            </MDTypography>
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </Card>
                  );
                })}
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default OrderModal;
