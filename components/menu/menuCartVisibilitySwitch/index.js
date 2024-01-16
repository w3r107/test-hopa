// React Imports
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
// MUI Imports
import { Switch } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography, Modal } from "/components";
import { updateRestaurantInfo, useRestaurant } from "store/restaurant/restaurant.slice";
import { useMenuCtx } from "context/menuContext";
import { getRestaurantId } from "utils/getRestuarantId";
import { useDispatch } from "react-redux";


const MenuCartVisibilitySwitch = ({ disabled }) => {
  const dispatch = useDispatch();

  const [isMenuVisible, setMenuVisible] = useState(true);
  const [isCartOptionVisible, setIsCartOptionVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { t: translate } = useTranslation();
  const { data: restaurant } = useRestaurant();
  const { showLoader, showSnackbar } = useMenuCtx();
  // const dispatch = useDispatch();
  // const { data: menuData } = useMenu();

  useEffect(() => {
    if (restaurant?.isCartOptionVisible !== undefined) {
      setIsCartOptionVisible(restaurant?.isCartOptionVisible)
    }
  }, [restaurant?.isCartOptionVisible]);

  const handleVisibilityChange = () => {
    showLoader(true, translate("SETTINGMODAL.SAVING_RESTAURANT_INFO"))
    dispatch(updateRestaurantInfo({
      restaurantId: getRestaurantId(),
      data: {
        isCartOptionVisible: !isCartOptionVisible
      }
    }))
      .unwrap()
      .then(() => {
        setIsCartOptionVisible(!isCartOptionVisible)
        showSnackbar(true, translate("TOAST.RESTAURANT_INFO_UPDATED_SUCCESS"))
      })
      .catch((err) => {
        showSnackbar(false, translate("TOAST.RESTAURANT_INFO_UPDATED_FAILURE"))
      })
      .finally(() => {
        showLoader(false)
        setIsModalVisible(false)
      })
  };

  return (
    isMenuVisible && (
      <>
        <Modal
          isOpen={isModalVisible}
          handleClose={() => setIsModalVisible(false)}
          title={translate("MENU_ACTIONS.MODAL_TITLE_FOR_DISH_SHOW_STATUS")}
          onActionBtnClick={handleVisibilityChange}
        >
          {`${translate("MENU_ACTIONS.MODAL_SUB_TITLE_FOR_DISH_CART_SHOW_BEFORE")}${isMenuVisible ? translate("MENU_ACTIONS.HIDE") : translate("MENU_ACTIONS.SHOW")} ${translate("MENU_ACTIONS.MODAL_SUB_TITLE_FOR_DISH_CART_SHOW_AFTER")}`}
        </Modal>
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 1,
            py: 0.5,
            mx: 0.5,
            my: 1,
            borderRadius: 2,
            transition: "0.25s all ease-in-out",
            cursor: "pointer",
            background: "white",
            minWidth: "230px",
            background: "rgba(0,0,0,0)",
            "&:hover": {
              background: disabled ? "rgba(0,0,0,0)" : "#fafafa",
            },
            pointerEvents: disabled ? 'none' : 'auto', // Disable pointer events when disabled
            opacity: disabled ? 0.5 : 1, // Reduce opacity when disabled
          }}
          onClick={() => !disabled && setIsModalVisible(true)}
        >
          <MDTypography sx={{ fontSize: 13, color: disabled ? 'text.secondary' : 'text.primary' }}>
            {translate("MENU_ACTIONS.UPDATE_DISH_SHOW_STATUS_TEXT")}
          </MDTypography>
          <Switch checked={isCartOptionVisible} onChange={() => !disabled && setIsModalVisible(true)} disabled={disabled} />
        </MDBox>
      </>
    )
  );
};

export default MenuCartVisibilitySwitch;
