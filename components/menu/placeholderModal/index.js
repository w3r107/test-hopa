// React Imports
import { useEffect, useState } from "react";
// External Package Imports
import { useTranslation } from "react-i18next";
// MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  MDSnackbar,
  MDBox,
  MDButton,
  MDTypography,
  DishImageCroper,
  Loader,
} from "/components";

import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLibrary } from "store/library/library.slice";
import { useDispatch } from "react-redux";
import { getAllImages } from "store/library/library.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { updatePlaceholder } from "store/restaurant/restaurant.actions";
import { useMenuCtx } from "context/menuContext";
// import { setRestaurantInfo } from "store/restaurant/restaurant.slice";

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

const PlaceholderModal = ({ isOpen, setOpen }) => {
  // Translation
  const { t: translate } = useTranslation();

  const dispatch = useDispatch();

  // Redux State Data

  const { loaded, images: libImages } = useLibrary()
  const [selected, setSelected] = useState();
  const { showLoader, showSnackbar } = useMenuCtx();




  useEffect(() => {
    if (!loaded) {
      dispatch(getAllImages({
        restaurantId: getRestaurantId()
      }))
    }
  }, [open, loaded, dispatch]);

  const onSubmit = () => {
    if (!String(selected).startsWith("http") && !String(selected).startsWith("data:")) return;
    showLoader(true, "PLACEHOLDER.UPLOADING")
    dispatch(updatePlaceholder({
      restaurantId: getRestaurantId(),
      placeholder: selected
    }))
      .then(() => {
        showSnackbar(true, "PLACEHOLDER.UPLOADED")
      })
      .finally(() => {
        showLoader(false);
        setOpen(false)
      })


  };

  const onSelectImage = (item) => {
    if (item?.image === selected) {
      setSelected("");
    } else {
      setSelected(item?.image);
    }
  };

  const uploadPlaceholderHandler = (file) => {
    setSelected(file)
  };

  return (
    <>
      <BootstrapDialog
        open={isOpen}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
        >
          {translate("MANAGE_PLACEHOLDER")}
        </BootstrapDialogTitle>
        <MDBox p={2}>
          <MDTypography p={2} sx={{ fontSize: 17 }}>
            {translate("SELECT_IMAGE_FROM_LIST")}
          </MDTypography>

          <MDBox p={1}>
            <MDTypography m={2} variant="h5">
              {translate("LIBRARY.MY_UPLOADS")}
            </MDTypography>
            <Grid container spacing={1} p={2}>
              {libImages?.map((item, index) => (
                <Grid key={index} item xs={6} sm={2}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => onSelectImage(item)}
                  >
                    {selected === item?.image && (
                      <div
                        style={{
                          position: "absolute",
                          top: -25,
                          right: -6,
                          zIndex: "20",
                        }}
                      >
                        <CheckCircleIcon
                          fontSize={"large"}
                          style={{ color: "green" }}
                        />
                      </div>
                    )}
                    <Image
                      alt="icon"
                      src={item?.image}
                      width="100%"
                      height="100%"
                      className="rounded-image"
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </MDBox>

          <MDBox p={2}>
            <MDTypography m={2} variant="h5">
              {translate("LIBRARY.APP_GALLERY")}
            </MDTypography>
            <Grid container spacing={2} p={2}>
              {[]?.map((item, index) => (
                <Grid key={index} item xs={6} sm={2}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      position: "relative",
                    }}
                    onClick={() => onSelectImage(item)}
                  >
                    {selected === item?.image && (
                      <div
                        style={{
                          position: "absolute",
                          top: -25,
                          right: -6,
                          zIndex: "20",
                        }}
                      >
                        <CheckCircleIcon
                          fontSize={"large"}
                          style={{ color: "green" }}
                        />
                      </div>
                    )}
                    <Image
                      alt="icon"
                      src={item?.image}
                      width="100%"
                      height="100%"
                      className="rounded-image"
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </MDBox>

          <MDBox p={2}>
            <MDTypography m={2} variant="h5">
              {translate("UPLOAD_NEW")}
            </MDTypography>
          </MDBox>

          <MDBox p={2}>
            <DishImageCroper
              onSave={uploadPlaceholderHandler}
              value={selected}
              ratio={1 / 1}
            />
          </MDBox>
          <DialogActions>
            <MDButton
              variant="gradient"
              onClick={onSubmit}
              color="dark"
              size="medium"
            >
              {translate("BUTTON.SAVE")}
            </MDButton>
          </DialogActions>
        </MDBox>
      </BootstrapDialog>
    </>
  );
};

export default PlaceholderModal;
