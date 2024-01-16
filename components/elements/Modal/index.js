// React Imports
import React from "react";

// MUI Imports
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Local Component Imports
import { MDButton, Transition } from "/components";
import { useTranslation } from "react-i18next";

const Modal = ({ isOpen, handleClose, title, children, onActionBtnClick }) => {
  const { t: translate } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <DialogContentText p={3} id="alert-dialog-slide-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <MDButton
          onClick={onActionBtnClick}
          variant="gradient"
          color="error"
          size="small"
        >
          {translate("YES")}
        </MDButton>
        <MDButton
          onClick={handleClose}
          variant="gradient"
          color="dark"
          size="small"
        >
          {translate("NO")}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
