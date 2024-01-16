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
  TextField,
  Button,
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
  ErrorMessage,
} from "/components";
// Redux Imports
import { useRestaurant, useMenu } from "store/restaurant/restaurant.slice";
import { useDispatch } from "react-redux";
import { getDishLibraryImages } from "Api/firebase";
import { getMenu } from "store/restaurant/restaurant.slice";
import { uploadAsPromise } from "store/utils";
import { ref } from "firebase/storage";
import { storage } from "Api/firebaseConfiguration";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as Yup from "yup";
import { useFormik } from "formik";
import { setRestaurantInfo } from "store/restaurant/restaurant.slice";
import { updateBadgesDetailInMenu } from "/utils/updateBadge";
import { setMenu } from "store/restaurant/restaurant.slice";
import { getRestaurantInfo } from "store/restaurant/restaurant.slice";

const validationSchema = Yup.object().shape({
  name: Yup.object().shape({
    he: Yup.string()
      .required("Field is required")
      .label("Badge Name in Hebrew*"),
    en: Yup.string().label("Badge Name in English"),
    es: Yup.string().label("Badge Name in Spanish"),
    ru: Yup.string().label("Badge Name in Russian"),
    ar: Yup.string().label("Badge Name in Arabic"),
  }),
});

const initialValues = {
  name: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
  },
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

const EditBadge = ({ badge, isOpen, setOpen }) => {
  // Translation
  const { t: translate } = useTranslation();

  const [image, setImage] = useState("");

  // Redux State Data
  const dispatch = useDispatch();
  const { data: restaurantData } = useRestaurant();
  const { myImages } = useMenu();
  const [libraryImages, setLibraryImages] = useState([]);
  const [selected, setSelected] = useState();
  const [isChange, setChange] = useState(false);
  const [loading, setLoading] = useState({
    visible: false,
    messge: "",
  });
  const [snackbarProps, setSnackbarProps] = useState({
    success: false,
    message: "",
    visible: false,
  });

  const showSnackbar = (success, message) => {
    setSnackbarProps({ ...snackbarProps, success, message, visible: true });
  };

  useEffect(() => {
    if (badge) {
      setValues({
        name: badge.name,
      });
    }
  }, [badge]);

  useEffect(() => {
    if (isOpen) {
      dispatch(getMenu());
      const getLibraryImages = async () => {
        const libraryImages = await getDishLibraryImages();
        setLibraryImages(libraryImages);
      };
      getLibraryImages();
    }
  }, [isOpen]);

  const onSubmit = async (values) => {
    try {
      let imageURL = badge.image;
      setLoading({
        visible: true,
        messge: translate("BADGES.SAVING_BADGE"),
      });
      if (isChange) {
        imageURL = selected ? selected : image;
      }

      const data = {
        id: badge.id,
        name: values.name,
        image: imageURL,
      };

      const updatedBadges = restaurantData?.badges?.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        }
        return item;
      });

      const restuarantDetails = {
        ...restaurantData,
        badges: [...updatedBadges],
      };

      dispatch(setRestaurantInfo(restuarantDetails)).then(
        async ({ payload }) => {
          if (payload.success) {
            showSnackbar(true, translate("TOAST.PROFILE_SUCCESS"));
            const updateRestaurant = await updateBadgesDetailInMenu(data);
            // update the menu here
            dispatch(setMenu({ ...updateRestaurant })).then(() => {
              setLoading({
                visible: false,
                messge: "",
              });
              dispatch(getMenu());
              setOpen(false);
              resetForm();
              setSelected();
              setImage();
              setChange(false);
              dispatch(getRestaurantInfo());
              showSnackbar(true, translate("BADGES.UPDATED"));
            });
          } else {
            showSnackbar(false, translate("TOAST.PROFILE_FAILURE"));
            setLoading({
              visible: false,
              messge: "",
            });
          }
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const onSelectImage = (item) => {
    if (item.url === selected) {
      setSelected();
    } else {
      setSelected(item?.url);
    }
    setImage(null);
  };

  const {
    handleChange,
    handleSubmit,
    setFieldTouched,
    errors,
    touched,
    values,
    setValues,
    resetForm,
  } = useFormik({ initialValues, onSubmit, validationSchema });

  const uploadPlaceholderHandler = async (file) => {
    setLoading({
      visible: true,
      messge: translate("UPLOADING_FILE"),
    });
    const storageRef = ref(
      storage,
      `/BadgeUploads/${new Date().getTime()}-${restaurantData?.uid}`
    );
    const image = await uploadAsPromise(storageRef, file);
    setImage(image);
    setSelected(null);
    setLoading({
      visible: false,
      messge: "",
    });
  };

  const removeFileFunction = () => {
    // toast.success("file");
    setImage("");
    setImage(restaurantData?.placeholder);
    return;
  };
  return (
    <>
      {loading.visible && <Loader message={loading.messge} />}
      <MDSnackbar
        icon="notifications"
        title={translate("HOPATITLE")}
        content={snackbarProps.message}
        open={snackbarProps.visible}
        color={snackbarProps.success ? "success" : "error"}
        close={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        autoHideDuration={300}
      />
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
          {translate("BADGES.EDIT_BADGE")}
        </BootstrapDialogTitle>
        <MDBox p={2}>
          <MDBox px={4}>
            {!isChange && (
              <Image
                alt="icon"
                src={badge?.image}
                width="100%"
                height="100%"
                className="rounded-image"
              />
            )}
            <MDBox>
              <MDButton
                color="dark"
                size="small"
                variant="gradient"
                onClick={() => {
                  setSelected();
                  setChange(!isChange);
                }}
              >
                {!isChange ? translate("CHANGE") : translate("CANCEL_CHANGE")}
              </MDButton>
            </MDBox>
            {isChange && (
              <>
                <MDTypography p={2} sx={{ fontSize: 17 }}>
                  {translate("SELECT_IMAGE_FROM_LIST")}
                </MDTypography>
                <MDBox p={1}>
                  <MDTypography m={2} variant="h5">
                    {translate("LIBRARY.MY_UPLOADS")}
                  </MDTypography>
                  <Grid container spacing={1} p={2}>
                    {myImages?.map((item, index) => (
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
                          {selected === item?.url && (
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
                            src={item?.url}
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
                    {libraryImages?.map((item, index) => (
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
                          {selected === item?.url && (
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
                            src={item?.url}
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
                    value={image}
                    ratio={1 / 1}
                    removeFileFunction={removeFileFunction}
                  />
                </MDBox>
              </>
            )}
          </MDBox>

          <form onSubmit={handleSubmit}>
            <MDBox p={2}>
              <MDBox p={2}>
                <TextField
                  type="text"
                  onChange={handleChange("name.he")}
                  onBlur={() => setFieldTouched("name.he")}
                  label={translate("BADGES.BADGE_NAME_PLACEHOLDER_HE")}
                  value={values?.name?.he}
                  fullWidth
                />
                <ErrorMessage
                  error={errors.name?.he}
                  visible={touched.name?.he}
                />
                {restaurantData?.showLanguages?.en && (
                  <MDBox pt={2}>
                    <TextField
                      type="text"
                      onChange={handleChange("name.en")}
                      onBlur={() => setFieldTouched("name.en")}
                      label={translate("BADGES.BADGE_NAME_PLACEHOLDER_EN")}
                      value={values?.name?.en}
                      fullWidth
                    />
                  </MDBox>
                )}

                {restaurantData?.showLanguages?.es && (
                  <MDBox pt={2}>
                    <TextField
                      type="text"
                      onChange={handleChange("name.es")}
                      onBlur={() => setFieldTouched("name.es")}
                      label={translate("BADGES.BADGE_NAME_PLACEHOLDER_ES")}
                      value={values?.name?.es}
                      fullWidth
                    />
                  </MDBox>
                )}
                {restaurantData?.showLanguages?.ru && (
                  <MDBox pt={2}>
                    <TextField
                      type="text"
                      onChange={handleChange("name.ru")}
                      onBlur={() => setFieldTouched("name.ru")}
                      label={translate("BADGES.BADGE_NAME_PLACEHOLDER_RU")}
                      value={values?.name?.ru}
                      fullWidth
                    />
                  </MDBox>
                )}
                {restaurantData?.showLanguages?.ar && (
                  <MDBox pt={2}>
                    <TextField
                      type="text"
                      onChange={handleChange("name.ar")}
                      onBlur={() => setFieldTouched("name.ar")}
                      label={translate("BADGES.BADGE_NAME_PLACEHOLDER_AR")}
                      value={values?.name?.ar}
                      fullWidth
                    />
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
            <DialogActions>
              <MDButton
                type="submit"
                variant="gradient"
                color="dark"
                size="medium"
                disabled={isChange && !image && !selected}
              >
                {translate("BUTTON.SAVE")}
              </MDButton>
            </DialogActions>
          </form>
        </MDBox>
      </BootstrapDialog>
    </>
  );
};

export default EditBadge;
