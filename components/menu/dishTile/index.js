// React Imports
import React, { useLayoutEffect, useState } from "react";

// External Package Imports

// MUI Imports
import { Card, IconButton, Switch, Tooltip, Icon } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography, MDAvatar, TextWrapper } from "/components";
import { DeleteDishModal } from "/components/menu";

// Context Imports
import { useMaterialUIController } from "/context";

// Asset Imports
import dishPlaceholder from "assets/images/dish-placeholder.png";

// Firebase Imports
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { useTranslation } from "react-i18next";
import { useMenuCtx } from "context/menuContext";
import { getRestaurantId } from "utils/getRestuarantId";
import { updateDish } from "store/dish/dish.action";
import { useDispatch } from "react-redux";

const { convert } = require("html-to-text");

const DishTile = ({ dish }) => {
  const dispatch = useDispatch();
  const [{ darkMode, language }] = useMaterialUIController();
  const { t: translate } = useTranslation();

  const {
    setDishFormOpened,
    setDishFormData,
    setIsDeleteDishModalOpen,
    setToDeleteDish,
    showLoader,
    showSnackbar,
  } = useMenuCtx();

  const { data: restaurantData } = useRestaurant();

  const {
    currencyValue,
    name,
    image,
    isVisible,
    isShowCartOption,
    description,
    price,
  } = dish;

  let formattedDescription = convert(description[language], {
    wordwrap: 200,
  });

  let formattedPrice = currencyValue + " " + price;

  const [isScreenSmall, setScreenSmall] = useState(true);

  // CONTROLS THE CART SWITCH HERE
  const cartSwitchDisabled = true;

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) setScreenSmall(true);
      else setScreenSmall(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleVisibilityChange = () => {
    showLoader(true, translate("LOADING.UPDATING_DISH"));
    dispatch(
      updateDish({
        data: {
          dishId: dish.id,
          restaurantId: getRestaurantId(),
          isVisible: dish.isVisible === undefined ? true : !dish?.isVisible,
          parentCategoryId: dish.parentCategoryId,
          categoryId: dish.categoryId,
        },
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.UPDATE_DISH_SUCCESS"));
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.UPDATE_DISH_FAILURE"));
      })
      .finally(() => {
        showLoader(false);
      });
  };

  const handleCartVisibilityChange = () => {
    showLoader(true, translate("LOADING.UPDATING_DISH"));
    dispatch(
      updateDish({
        data: {
          dishId: dish.id,
          restaurantId: getRestaurantId(),
          isShowCartOption:
            dish.isShowCartOption === undefined
              ? true
              : !dish?.isShowCartOption,
          parentCategoryId: dish.parentCategoryId,
          categoryId: dish.categoryId,
        },
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.UPDATE_DISH_SUCCESS"));
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.UPDATE_DISH_FAILURE"));
      })
      .finally(() => {
        showLoader(false);
      });
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: isScreenSmall ? "column" : "row",
          backgroundColor: darkMode ? "transparent" : "grey-100",
          boxShadow: 1,
          my: 1,
          px: 2,
          py: 2,
          width: "100%",
        }}
      >
        <MDBox
          sx={{
            display: "flex",
            flexDirection: isScreenSmall ? "column" : "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <MDBox
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <MDAvatar
              src={image || restaurantData?.placeholder || dishPlaceholder.src}
              alt={name[language]}
              sx={{
                "& .MuiAvatar-img": {
                  height: "100%",
                },
                m: 2,
              }}
            />
            <MDBox
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                flexGrow: 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  textTransform="capitalize"
                >
                  {name[language]}
                </MDTypography>
                <div style={{ display: "flex", marginLeft: "0.2rem" }}></div>
              </div>

              {formattedDescription.length > 0 && (
                <MDBox sx={{ fontSize: 13 }}>
                  <TextWrapper text={formattedDescription} limit={220} />
                </MDBox>
              )}
            </MDBox>
          </MDBox>

          <MDBox
            sx={{
              minWidth: 100,
              m: 1,
              width: isScreenSmall ? "100%" : "auto",
            }}
          >
            <MDTypography
              variant="subtitle2"
              fontWeight="medium"
              color="dark"
              sx={{
                fontSize: 15,
                borderRadius: 5,
                textAlign: "center",
                background: "#fafafa",
              }}
            >
              {formattedPrice}
            </MDTypography>
          </MDBox>
        </MDBox>

        {isScreenSmall || (
          <MDBox
            style={{
              width: 2,
              height: 30,
              background: "lightgrey",
              fontSize: 30,
              borderRadius: "50px",
            }}
          />
        )}

        {isScreenSmall ? (
          <MDBox
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              width: "100%",
              my: 0.5,
            }}
          >
            <MDBox
              sx={{
                ...styles.btn,
                minWidth: "210px",
                maxWidth: "280px",
                width: "100%",
              }}
              onClick={handleCartVisibilityChange}
            >
              <MDTypography sx={{ fontSize: 13 }}>
                {translate("SHOW_ADD_TO_CART")}
              </MDTypography>
              <Switch checked={isShowCartOption} />
            </MDBox>

            <MDBox
              sx={{
                ...styles.btn,
                minWidth: "230px",
                maxWidth: "300px",
                width: "100%",
              }}
              onClick={handleVisibilityChange}
            >
              <MDTypography sx={{ fontSize: 13 }}>
                {translate("SHOW_HIDE_ON_MENU")}
              </MDTypography>
              <Switch checked={isVisible} />
            </MDBox>
            <MDBox sx={{ display: "flex" }}>
              <MDBox
                sx={styles.btn}
                onClick={() => {
                  setDishFormData(dish);
                  setDishFormOpened("edit");
                }}
              >
                <IconButton>
                  <Icon>edit</Icon>
                </IconButton>
                <MDTypography sx={{ fontSize: 13 }}>Edit</MDTypography>
              </MDBox>
            </MDBox>
            <MDBox
              sx={styles.btn}
              onClick={() => {
                setToDeleteDish(dish.id);
                setIsDeleteDishModalOpen(true);
              }}
            >
              <IconButton color="error">
                <Icon>delete</Icon>
              </IconButton>
              <MDTypography sx={{ fontSize: 13 }}>Delete</MDTypography>
            </MDBox>
          </MDBox>
        ) : (
          <>
            <MDBox
              sx={{
                ...styles.btn,
                minWidth: "180px",
              }}
              onClick={handleVisibilityChange}
            >
              <MDTypography sx={{ fontSize: 13 }}>
                {translate("SHOW_HIDE_ON_MENU")}
              </MDTypography>
              <Switch checked={isVisible} />
            </MDBox>
            <MDBox
              style={{
                width: 2,
                height: 30,
                background: "lightgrey",
                fontSize: 30,
                borderRadius: "50px",
              }}
            />

            <MDBox
              sx={{
                ...styles.btn,
                minWidth: "210px",
                pointerEvents: cartSwitchDisabled ? "none" : "auto", // Disable pointer events when cartSwitchDisabled is true
                opacity: cartSwitchDisabled ? 0.5 : 1, // Reduce opacity when cartSwitchDisabled is true
              }}
              onClick={
                !cartSwitchDisabled ? handleCartVisibilityChange : undefined
              } // Prevent onClick when cartSwitchDisabled is true
            >
              <MDTypography
                sx={{
                  fontSize: 13,
                  color: cartSwitchDisabled ? "text.secondary" : "text.primary",
                }}
              >
                {translate("SHOW_ADD_TO_CART")}
              </MDTypography>
              <Switch
                checked={isShowCartOption}
                disabled={cartSwitchDisabled}
              />
            </MDBox>

            {isScreenSmall || (
              <MDBox
                style={{
                  width: 2,
                  height: 30,
                  background: "lightgrey",
                  fontSize: 30,
                  borderRadius: "50px",
                }}
              />
            )}

            <Tooltip title={translate("EDIT")}>
              <IconButton
                onClick={() => {
                  setDishFormData(dish);
                  setDishFormOpened("edit");
                }}
              >
                <Icon>edit</Icon>
              </IconButton>
            </Tooltip>

            <Tooltip title={translate("DELETE")}>
              <IconButton
                color="error"
                onClick={() => {
                  setIsDeleteDishModalOpen(true);
                  setToDeleteDish(dish.id);
                }}
              >
                <Icon>delete</Icon>
              </IconButton>
            </Tooltip>
          </>
        )}
      </Card>
    </>
  );
};

const styles = {
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    px: 0,
    py: 0.5,
    mx: 0.5,
    borderRadius: 2,
    transition: "0.25s all ease-in-out",
    cursor: "pointer",
    background: "white",
    "&:hover": {
      background: "#fafafa",
    },
  },
};

export default DishTile;
