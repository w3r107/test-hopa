// React Imports
import { useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal, MDButton } from "/components";

// MUI Imports
import { Icon } from "@mui/material";

// Redux Imports
import { useDispatch } from "react-redux";
import { axiosDelete } from "utils/axiosConfig";
import { getRestaurantId } from "utils/getRestuarantId";
import { useMenuCtx } from "context/menuContext";
// import { useMenu, deleteMenu } from "store/restaurant/restaurant.slice";

const DeleteMenuModal = ({ isOpen, setIsOpen }) => {

  const { t: translate } = useTranslation();

  const { showSnackbar, showLoader } = useMenuCtx();

  const dispatch = useDispatch();

  const _deleteMenu = () => {
    showLoader(true, translate("LOADING.DELETING_MENU"))
    axiosDelete(`bulk/deleteMenu/${getRestaurantId()}`)
      .then(() => {
        showSnackbar(true, translate("TOAST.DELETE_MENU_SUCCESS"))
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.DELETE_MENU_FAILURE"))
      })
      .finally(() => {
        setIsOpen(false)
        showLoader(false)
      })
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        title="Delete Entire Menu"
        onActionBtnClick={_deleteMenu}
      >
        {translate("MENU_ACTIONS.DO_YOU_WANT_TO_DELETE_ENTIRE_MENU")}
      </Modal>
      <MDButton
        variant="outlined"
        color="error"
        size="medium"
        onClick={() => setIsOpen(true)}
        sx={{ m: 1, px: 1, textTransform: "none" }}
      >
        <Icon>delete</Icon>&nbsp;
        {translate("BUTTON.DELETE_MENU")}
      </MDButton>
    </>
  );
};

export default DeleteMenuModal;
