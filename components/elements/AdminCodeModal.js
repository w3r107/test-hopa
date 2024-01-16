// React Imports
import React, { useEffect, useState } from "react";

// MUI Imports
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

// Local Component Imports
import { MDButton, Transition } from "/components";
import { useTranslation } from "react-i18next";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import MDTypography from "./MDTypography";
import { useMenuCtx } from "context/menuContext";

const AdminCodeModal = ({ isOpen, handleClose, title, children, onActionBtnClick }) => {
  const { t: translate } = useTranslation();
  const { data: restaurantData } = useRestaurant();
  const [adminCode, setAdminCode] = useState('');


  useEffect(() => {
    if (isOpen) {
      setAdminCode('');
    }
  }, [isOpen]);
  
  
  
    const handleAdminCodeChange = (event) => {
      setAdminCode(event.target.value);
    };
  

  const handleActionClick = () => {
    if (adminCode === restaurantData?.adminCode) {
      onActionBtnClick();
      // showSnackbar(true, translate("TOAST.UPDATE_DISH_SUCCESS"));
    } else {
      // showSnackbar(false, translate("INCORRECT_ADMIN_CODE"));
      alert(translate("INCORRECT_ADMIN_CODE"));
    }
  };
  
  const onClose = () => {
    setAdminCode('');
    handleClose();
  };



  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers
        sx={{ minWidth: 300, minHeight: 100 }}

      >
        <DialogContentText p={1} id="alert-dialog-slide-description">
          {children}
        </DialogContentText>
        <MDTypography variant="subtitle2" fontSize="large">
          {translate("ENTER_ADMIN_CODE")}
        </MDTypography>
        <TextField
          autoFocus
          margin="dense"
          id="adminCode"
          label={translate("ADMIN_CODE")}
          type="password"
          fullWidth
          variant="standard"
          value={adminCode}
          onChange={handleAdminCodeChange}
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions>
        <MDButton
          onClick={handleActionClick}
          variant="gradient"
          color="dark"
          size="small"
        >
          {translate("OK")}
        </MDButton>
        <MDButton
          onClick={handleClose}
          variant="gradient"
          color="error"
          size="small"
        >
          {translate("CANCEL")}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCodeModal;
