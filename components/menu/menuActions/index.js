// React Imports
import { useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// MUI Imports
import { Card, Icon } from "@mui/material";

// Local Component Imports
import { MDAvatar, MDBox, MDTypography, MDButton, MDInput } from "/components";
import {
  // XLSXUpload,
  MenuVisibilitySwitch,
  DeleteMenuModal,
  MenuCartVisibilitySwitch,
  PlaceholderModal,
} from "/components/menu";

// Util Imports
import { updatePlaceholder, useRestaurant } from "store/restaurant/restaurant.slice";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DeletePlaceHolderModal from "../deletePlaceholderModal";
import { useMenuCtx } from "context/menuContext";
import { useDispatch } from "react-redux";
import { getRestaurantId } from "utils/getRestuarantId";
import { axiosPost } from "utils/axiosConfig";
import { XLSXUpload } from "..";
import Cookies from "js-cookie";
import MoveDishModal from "../moveDishModal";
import { moveDishes } from "store/dish/dish.action";
import { dishActions } from "store/dish/dish.slice";

const dishOptions = [
  {
    id: 1,
    label: "All",
    value: "All",
  },
  {
    id: 2,
    label: "Visible-Items",
    value: "Visible-Items",
  },
  {
    id: 3,
    label: "Cart-Ability",
    value: "Cart-Ability",
  },
  {
    id: 4,
    label: "Have-Badge",
    value: "Have-Badge",
  },
];

const MenuActions = () => {

  const [isOpen, setOpen] = useState(false);
  const [isDeletePlaceHolderModalOpen, setIsDeletePlaceHolderOpen] = useState(false);

  const language = Cookies.get("i18next") || "he";

  const dispatch = useDispatch();

  const { t: translate } = useTranslation();
  const { showLoader, showSnackbar } = useMenuCtx()

  const [deletingMenu, setDeletingMenu] = useState(false);

  const [moveDishPopup, setMoveDishPopup] = useState(false)

  // Redux Setup
  const { data: restaurantData } = useRestaurant();

  // Downloading the menu in XSLX Format
  const downloadXLSX = () => {
    showLoader(true, translate("LOADING.DOWNLOADING_MENU"))
    axiosPost(`bulk/downloadMenu`, {
      restaurantId: getRestaurantId()
    })
      .then((response) => {
        const text = response.data; // Assuming response.data is a string containing CSV data

        // Create a Blob with UTF-8 encoding and a BOM
        const utf8EncodedText = new TextEncoder().encode('\uFEFF' + text); // \uFEFF is the BOM for UTF-8

        const blob = new Blob([utf8EncodedText], { type: 'text/csv; charset=UTF-8' });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Menu-${restaurantData?.id}-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();

        // Clean up by revoking the URL object
        window.URL.revokeObjectURL(url);
      })
      .finally(() => {
        showLoader(false)
      })
  };

  // Download the Menu Template in XLSX Format
  const downloadTemplate = () => {
    axiosPost(`bulk/menuTemplate`, {
      restaurantId: getRestaurantId()
    })
      .then((response) => {

        const text = response.data; // Assuming response.data is a string containing CSV data

        // Create a Blob with UTF-8 encoding and a BOM
        const utf8EncodedText = new TextEncoder().encode('\uFEFF' + text); // \uFEFF is the BOM for UTF-8

        const blob = new Blob([utf8EncodedText], { type: 'text/csv; charset=UTF-8' });

        const url = window.URL.createObjectURL(blob);

        // Create a link element to trigger the download
        const formattedDate = Date.now()

        const a = document.createElement('a');
        a.href = url;

        a.download = `menu-template-${restaurantData?.name ? restaurantData?.name[language] : "name"}-${formattedDate}.csv`; // Specify the file name with a .csv extension
        document.body.appendChild(a);
        a.click();

        // Clean up by revoking the URL object
        window.URL.revokeObjectURL(url);
      })
  };

  const onChange = (e) => {
  };

  const onChangeDishFilter = (event) => {
  };

  const onChangeBadgeFilter = (event) => {
  };

  // on remove placeholder 
  const onPlaceHolderDelete = () => {
    showLoader(true, "PLACEHOLDER.DELETING")
    dispatch(updatePlaceholder({
      restaurantId: getRestaurantId(),
      placeholder: ""
    }))
      .then(() => {
        showSnackbar(true, "PLACEHOLDER.DELETED")
      })
      .finally(() => {
        showLoader(false)
        setIsDeletePlaceHolderOpen(false)
      })

  };

  const onSubmitMoveDish = (dishMoveData) => {
    showLoader(true, translate("LOADING.MOVING_DISHES"))
    dispatch(moveDishes({
      data: {
        restaurantId: getRestaurantId(),
        ...dishMoveData
      }
    }))
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.DISH_MOVED_SUCCESS"))
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.DISH_MOVED_FAILURE"))
      })
      .finally(() => {
        showLoader(false)
        setMoveDishPopup(false)
      })
  }

  return (
    <>
      <MDTypography sx={{ my: 1, ml: 1, mt: 2, fontSize: 17 }}>
        {translate("MENU_ACTIONS.MENU_ACTION")}
      </MDTypography>
      <Card
        sx={{
          width: "100%",
          my: 1,
          py: 2,
          px: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <MDBox
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <MDBox
            sx={{
              width: { xs: "100%", md: "50%" },
            }}
          >
            <XLSXUpload
              onUploadInit={() => {
                showLoader(true, "Uploading Menu");
              }}
              onUploadComplete={(success) => {
                showLoader(true, "");
                showSnackbar(
                  success,
                  success
                    ? "Menu has been Uploaded"
                    : "Menu could not be Uploaded"
                );
              }}
            />

            <MDButton
              variant="gradient"
              color="light"
              size="medium"
              onClick={downloadXLSX}
              sx={{ m: 1, px: 1, textTransform: "none" }}
            >
              <Icon>download</Icon>&nbsp;
              {translate("BUTTON.DOWNLOAD_XLSX_FILE")}
            </MDButton>

            <MDButton
              variant="gradient"
              color="light"
              size="medium"
              onClick={downloadTemplate}
              sx={{ m: 1, px: 1, textTransform: "none" }}
            >
              <Icon>download</Icon>&nbsp;
              {translate("BUTTON.DOWNLOAD_TEMPLATE")}
            </MDButton>

            <MoveDishModal
              onClose={() => setMoveDishPopup(false)}
              open={moveDishPopup}
              onSubmit={onSubmitMoveDish}
            />

            <MDButton
              variant="gradient"
              color="light"
              size="medium"
              onClick={() => setMoveDishPopup(true)}
              sx={{ m: 1, px: 1, textTransform: "none" }}
            >
              <Icon>open_with</Icon>&nbsp;
              {translate("BUTTON.MOVE_DISHES")}
            </MDButton>


            <DeleteMenuModal
              isOpen={deletingMenu}
              setIsOpen={setDeletingMenu}
            />
          </MDBox>
          <MDBox
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <MDBox mr={3} my={1}>
              <FormControl style={{ height: "2.5rem", width: "8rem" }}>
                <InputLabel>{translate("MENU_ACTIONS.DISHES")}</InputLabel>
                <Select
                  style={{ height: "100%" }}
                  value={""}
                  label={translate("MENU_ACTIONS.DISHES")}
                  onChange={onChangeDishFilter}
                >
                  {dishOptions.map((item) => (
                    <MenuItem key={item.id} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mr={3} my={1}>
              <FormControl style={{ height: "2.5rem", width: "8rem" }}>
                <InputLabel>{translate("MENU_ACTIONS.BADGES")}</InputLabel>
                <Select
                  style={{ height: "100%" }}
                  value={""}
                  label={translate("MENU_ACTIONS.BADGES")}
                  onChange={onChangeBadgeFilter}
                >
                  {/* {createBadgeOptions(
                    restaurantData?.badges || [],
                    language
                  ).map((item) => (
                    <MenuItem key={item.id} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mr={3} my={1}>
              <MDInput
                label={translate("MENU_ACTIONS.SEARCH")}
                value={""}
                fullWidth
                onChange={onChange}
              />
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <MDTypography sx={{ my: 1, ml: 1, mt: 2, fontSize: 17 }}>
        {translate("MENU_ACTIONS.VISIBILITY_ACTION")}
      </MDTypography>
      <Card
        sx={{
          width: "100%",
          my: 1,
          py: 2,
          px: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <MDBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {restaurantData?.placeholder ? (
            <>
              <MDBox
                sx={{
                  display: "flex",
                }}
              >
                <MDAvatar
                  src={restaurantData?.placeholder}
                  sx={{
                    "& .MuiAvatar-img": {
                      height: "100%",
                    },
                    m: 2,
                  }}
                />
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  onClick={() => setOpen(true)}
                  sx={{ m: 1, px: 1, textTransform: "none" }}
                >
                  <Icon>upload</Icon>&nbsp;
                  {translate("MENU_ACTIONS.CHANGE_PLACEHOLDER")}
                </MDButton>

                <MDButton
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setIsDeletePlaceHolderOpen(true)}
                  sx={{ m: 1, px: 1, textTransform: "none" }}
                >
                  <Icon>delete</Icon>&nbsp;
                  {translate("MENU_ACTIONS.DELETE_PLACEHOLDER")}
                </MDButton>
              </MDBox>
            </>
          ) : (
            <MDButton
              variant="gradient"
              color="light"
              size="medium"
              onClick={() => setOpen(true)}
              sx={{ m: 1, px: 1, textTransform: "none" }}
            >
              <Icon>upload</Icon>&nbsp;
              {translate("MENU_ACTIONS.ADD_PLACEHOLDER")}
            </MDButton>
          )}
        </MDBox>
        <DeletePlaceHolderModal
          isOpen={isDeletePlaceHolderModalOpen}
          handleClose={() => setIsDeletePlaceHolderOpen(false)}
          onDelete={onPlaceHolderDelete}
        />
        <PlaceholderModal
          isOpen={isOpen}
          setOpen={setOpen}
        />
        <MDBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "justify-between",
            flexWrap: "wrap",
          }}
        >
          <MenuCartVisibilitySwitch disabled={true} />
          <MenuVisibilitySwitch />
        </MDBox>
      </Card>
    </>
  );
};

export default MenuActions;
