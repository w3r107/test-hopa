// React Imports
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
// MUI Imports
import { Switch } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography, Modal } from "/components";
import { updateRestaurantInfo, useRestaurant } from "store/restaurant/restaurant.slice";
import { useMenuCtx } from "context/menuContext";
import { useDispatch } from "react-redux";
import { getRestaurantId } from "utils/getRestuarantId";

const MenuVisibilitySwitch = () => {

  const dispatch = useDispatch();
  const [isSwitchVisible, setSwitchVisible] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { t: translate } = useTranslation();

  const { data: restaurant } = useRestaurant()
  const { showLoader, showSnackbar } = useMenuCtx()

  // const dispatch = useDispatch();
  // const { data: menuData } = useMenu();

  useEffect(() => {
    if (restaurant && restaurant?.isMenuVisible === true) {
      setIsMenuVisible(true)
    }
  }, [restaurant]);

  const handleVisibilityChange = () => {
    showLoader(true, translate("SETTINGMODAL.SAVING_RESTAURANT_INFO"))
    dispatch(updateRestaurantInfo({
      restaurantId: getRestaurantId(),
      data: {
        isMenuVisible: !isMenuVisible
      }
    }))
      .unwrap()
      .then(() => {
        setIsMenuVisible(!isMenuVisible)
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
    isSwitchVisible && (
      <>
        <Modal
          isOpen={isModalVisible}
          handleClose={() => setIsModalVisible(false)}
          title={translate("MENU_ACTIONS.MODAL_TITLE_FOR_DISH_CART_STATUS")}
          onActionBtnClick={handleVisibilityChange}
        >
          {`${translate("MENU_ACTIONS.MODAL_SUB_TITLE_FOR_DISH_SHOW_BEFORE")}${isMenuVisible ? translate("MENU_ACTIONS.HIDE") : translate("MENU_ACTIONS.SHOW")} ${translate("MENU_ACTIONS.MODAL_SUB_TITLE_FOR_DISH_SHOW_AFTER")}`}
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
              background: "#fafafa",
            },
          }}
          onClick={() => setIsModalVisible(true)}
        >
          <MDTypography sx={{ fontSize: 13 }}>
            {translate("MENU_ACTIONS.UPDATE_DISH_CART_STATUS_TEXT")}
          </MDTypography>
          <Switch checked={isMenuVisible} onChange={() => setIsModalVisible(true)} />
        </MDBox>
      </>
    )
  );
};

export default MenuVisibilitySwitch;
