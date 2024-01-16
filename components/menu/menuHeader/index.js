// React Imports
import { useEffect, useState } from "react";

// External Package Imports
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// MUI Imports
import { Card, Box, Autocomplete, Icon } from "@mui/material";

// Local Component Imports
import {
  MDButton,
  MDBox,
  MDTypography,
  MDAvatar,
  TextWrapper,
  MDInput
} from "/components";

// Context Imports
import { useMaterialUIController } from "context";

// Asset Imports
import logoPlaceholder from "assets/images/logo-placeholder.png";

// Redux Imports
import { useDispatch } from "react-redux";
import { updateRestaurantInfo, useRestaurant } from "store/restaurant/restaurant.slice";
import { useMenuCtx } from "context/menuContext";
import { getRestaurantId } from "utils/getRestuarantId";

const Header = ({ setLoaderMessage }) => {
  const [currency, setCurrency] = useState("₪");

  const { t: translate } = useTranslation();
  const [{ language }] = useMaterialUIController();

  const dispatch = useDispatch();
  const { data } = useRestaurant();

  const { showLoader, showSnackbar, setParentCategoryFormOpened } = useMenuCtx();

  const [saveCurrencyBtnVisible, setSaveBtnVisible] = useState(false);

  useEffect(() => {
    setCurrency(data.currency || "₪");
  }, [data.currency]);

  const handleCurrencyChange = async (c) => {
    setCurrency(c);
    setSaveBtnVisible(true);
  };

  const saveCurrencyChange = async () => {
    showLoader(true, translate("SETTINGMODAL.SAVING_RESTAURANT_INFO"))
    dispatch(updateRestaurantInfo({
      restaurantId: getRestaurantId(),
      data: { currency }
    }))
      .then(() => {
        showSnackbar(true, translate("TOAST.CURRENCY_CHANGE_SUCCESS"))
      })
      .finally(() => {
        showLoader(false)
        setSaveBtnVisible(false)
      })
  };

  return (
    <>
      <Card id="profile" dir={(language === "he" || language === "ar") ? "rtl" : "ltr"}>
        <MDBox p={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              p: 1,
              flexWrap: "wrap",
            }}
          >
            <MDBox sx={{ display: "flex" }}>
              <MDAvatar
                src={data?.logo || logoPlaceholder.src}
                alt="Restaurant Logo"
                size="xl"
                shadow="sm"
                sx={{
                  "& .MuiAvatar-img": {
                    width: "100%",
                  },
                  mb: 2,
                }}
              />
              <MDBox
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  px: 1,
                  mb: 2,
                }}
              >
                <MDBox lineHeight={1}>
                  <MDTypography variant="h5" fontWeight="medium">
                    {data?.name?.[language]}
                  </MDTypography>
                </MDBox>
                {data?.description?.[language] && data?.description?.[language]?.length > 0 && (
                  <MDTypography
                    fontSize="small"
                    color="secondary"
                    fontWeight="light"
                    sx={{ maxWidth: "400px", minWidth: "100px" }}
                  >
                    <TextWrapper
                      text={data.description?.[language]}
                      textStyles={{ fontSize: "12px" }}
                      btnStyles={{
                        fontSize: "12px",
                        textDecoration: "underline",
                        color: "inherit",
                      }}
                      limit={100}
                    />
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
            <MDBox
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Autocomplete
                id="currency"
                onChange={(_, newValue) => {
                  handleCurrencyChange(newValue);
                }}
                placeholder={translate("EDITMODAL.CURRENCY")}
                options={["₪", "€", "£", "$"]}
                value={currency}
                renderInput={(params) => {
                  return (
                    <MDInput
                      {...params}
                      variant="outlined"
                      size="small"
                      placeholder={translate("EDITMODAL.CURRENCY")}
                    />
                  );
                }}
                sx={{ mx: 2, mt: 2, minWidth: 100 }}
              />
              {saveCurrencyBtnVisible && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="medium"
                  onClick={saveCurrencyChange}
                  sx={{
                    whiteSpace: "wrap",
                    marginLeft: 1,
                    marginRight: 1,
                    marginTop: 2,
                    px: "20px",
                  }}
                >
                  <Icon>save</Icon>&nbsp;
                  {translate("BUTTON.SAVE_CURRENCY")}
                </MDButton>
              )}
              <MDButton
                variant="gradient"
                color="dark"
                size="medium"
                onClick={() => { setParentCategoryFormOpened("add") }}
                sx={{
                  whiteSpace: "wrap",
                  marginTop: 2,
                  marginLeft: 1,
                  marginRight: 1,
                  px: "20px",
                }}
              >
                <Icon>add</Icon>&nbsp;
                {translate("BUTTON.ADD_PARENT_CATEGORY")}
              </MDButton>
            </MDBox>
          </Box>
        </MDBox>
      </Card>
    </>
  );
};

Header.propTypes = {
  open: PropTypes.any,
  handleClose: PropTypes.any,
};

export default Header;
