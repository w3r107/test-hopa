// React Imports
import { useEffect, useRef, useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

// MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Local Component Imports
import {
  MDBox,
  MDButton,
  MDTypography,
  ErrorMessage,
  DishImageCroper,
} from "/components";

// Redux Imports
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { useDispatch } from "react-redux";

import { BadgeDropdown } from "/components/menu";
import { DishCategoryDropdown } from "/components/menu";
import { DeleteDishImageModal } from "/components/menu";

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

const validationSchema = Yup.object().shape({
  dish: Yup.object().shape({
    he: Yup.string()
      .required("Field is required")
      .label("Dish Name in Hebrew*"),
    en: Yup.string().label("Dish Name in English"),
    es: Yup.string().label("Category Name in Spanish"),
    ru: Yup.string().label("Category Name in Russian"),
    ar: Yup.string().label("Category Name in Arabic"),
  }),
  dishDescription: Yup.object().shape({
    he: Yup.string().label("Description in Hebrew*"),
    en: Yup.string().label("Description in English"),
    es: Yup.string().label("Category Name in Spanish"),
    ru: Yup.string().label("Category Name in Russian"),
    ar: Yup.string().label("Category Name in Arabic"),
  }),
  imageAlt: Yup.string().label("Image alt ...*"),
  badges: Yup.array().label("Badge"),
});

const initialValues = {
  dish: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
  },
  dishDescription: {
    he: "",
    en: "",
    es: "",
    ru: "",
    ar: "",
  },
  price: 0,
  currencyValue: "",
  dishId: "",
  imageAlt: null,
  badges: [],
};

const EditDishModal = ({
  isOpen,
  categoryId,
  dish = null,
  handleClose,
  setLoaderMessage,
  showSnackbar,
}) => {
  // Translation
  const { t: translate } = useTranslation();

  // Dish ID Ref (to be created if dish is being created | otherwise just picked from dish being edited)
  const dishIdRef = useRef(null);

  // Image URL uploaded to firebase storage
  const [image, setImage] = useState("");

  // Redux State Data
  const dispatch = useDispatch();
  const { data: restaurantData } = useRestaurant();

  const [isDeleteDishImageModalOpen, setIsDeleteDishImageModalOpen] = useState(false);

  useEffect(() => {
    setValues(dish);
    setImage(dish.image || "");

    dishIdRef.current = dish.dishId || "";
  }, [isOpen]);

  // Handle Image Uploading to Firebase Storage
  const uploadFiletoFirebaseStorage = async (file) => {
    // upload image to firebase storage 
  };

  // Handle Form Submit
  const onSubmit = (values) => {
    setLoaderMessage(translate("MENU_ACTIONS.UPDATING_TEXT"));
    const dishData = {
      ...values,
      price: values?.price || 0,
      image,
      dishId: dishIdRef?.current,
      currencyValue: restaurantData?.currency,
      isVisible:
        typeof dish?.isVisible === "undefined" ? false : dish?.isVisible,
      isShowCartOption:
        typeof dish?.isShowCartOption === "undefined"
          ? false
          : dish?.isShowCartOption,
    };
    // update dish here 
  };

  const {
    handleChange,
    handleSubmit,
    setFieldTouched,
    errors,
    touched,
    values,
    setValues,
    setFieldValue,
  } = useFormik({ initialValues, onSubmit, validationSchema });

  useEffect(() => { }, [values.badges]);
  const onGetName = (name) => {
    setFieldValue("imageAlt", name);
  };

  const removeFileFunction = () => {
    setIsDeleteDishImageModalOpen(true);
    // toast.success("file");
  };

  const onPlaceHolderDeletePending = () => {
    setLoaderMessage(translate("DISH_IMAGE.DELETING"));
  };

  const onPlaceHolderDeleteFulfilled = () => {
    setLoaderMessage("");
    showSnackbar(true, translate("DISH_IMAGE.DELETED"));
  };
  const deleteDishImage = () => {
    setImage("");
    setImage(restaurantData?.placeholder);
    return;
  };
  return (
    <>
      {/* {JSON.stringify(restaurantData)} */}
      <BootstrapDialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        fullWidth
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {translate("EDITMODAL.EDIT_TITLE")}
        </BootstrapDialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Card
              id="basic-info"
              sx={{
                overflow: "visible",
              }}
            >
              <DishImageCroper
                onSave={(e) => {
                  uploadFiletoFirebaseStorage(e);
                }}
                onName={onGetName}
                removeFileFunction={removeFileFunction}
                value={image}
                ratio={1 / 1}
              />
              {/* <MDBox p={2}>
                <MDTypography variant="h5">
                  {translate("EDITMODAL.ADD_ALT_TEXT")}
                </MDTypography>
              </MDBox> */}

              <MDBox p={2}>
                <MDTypography variant="h5">
                  {translate("EDITMODAL.ADD_ALT_TEXT")}
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <TextField
                  type="text"
                  onChange={handleChange("imageAlt")}
                  onBlur={() => setFieldTouched("imageAlt")}
                  label={translate("EDITMODAL.ADD_ALT_TEXT")}
                  value={values?.imageAlt}
                  fullWidth
                />
                <ErrorMessage
                  error={errors.imageAlt}
                  visible={touched.imageAlt}
                />
              </MDBox>

              <MDBox p={2}>
                <MDTypography variant="h5">
                  {translate("EDITMODAL.SELECT_CATEGORY")}
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <DishCategoryDropdown
                  data={[]}
                  categoryId={values?.categoryId}
                  onChange={setFieldValue}
                  label={translate("EDITMODAL.SELECT_CATEGORY")}
                  value={values?.categoryId}
                />
              </MDBox>

              <MDBox p={2}>
                <MDTypography variant="h5">
                  {translate("BADGES.SELECT_BADGE")}
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <BadgeDropdown
                  badges={restaurantData?.badges || []}
                  onChange={setFieldValue}
                  label={translate("BADGES.SELECT_BADGE")}
                  value={values?.badges}
                />
              </MDBox>
              <MDBox p={2}>
                <MDTypography variant="h5">
                  {translate("EDITMODAL.SUBTITLE_2")}
                </MDTypography>
              </MDBox>
              <MDBox pb={3}>
                <MDBox p={2}>
                  <TextField
                    type="text"
                    onChange={handleChange("dish.he")}
                    onBlur={() => setFieldTouched("dish.he")}
                    label={translate("EDITMODAL.DISHLABEL_HE")}
                    value={values?.dish?.he}
                    fullWidth
                  />
                  <ErrorMessage
                    error={errors.dish?.he}
                    visible={touched.dish?.en}
                  />
                  {restaurantData?.showLanguages?.en && (
                    <MDBox pt={2}>
                      <TextField
                        type="text"
                        onChange={handleChange("dish.en")}
                        onBlur={() => setFieldTouched("dish.en")}
                        label={translate("EDITMODAL.DISHLABEL_EN")}
                        value={values?.dish?.en}
                        fullWidth
                      />
                    </MDBox>
                  )}

                  {restaurantData?.showLanguages?.es && (
                    <MDBox pt={2}>
                      <TextField
                        type="text"
                        onChange={handleChange("dish.es")}
                        onBlur={() => setFieldTouched("dish.es")}
                        label={translate("EDITMODAL.DISHLABEL_ES")}
                        value={values?.dish?.es}
                        fullWidth
                      />
                    </MDBox>
                  )}
                  {restaurantData?.showLanguages?.ru && (
                    <MDBox pt={2}>
                      <TextField
                        type="text"
                        onChange={handleChange("dish.ru")}
                        onBlur={() => setFieldTouched("dish.ru")}
                        label={translate("EDITMODAL.DISHLABEL_RU")}
                        value={values?.dish?.ru}
                        fullWidth
                      />
                    </MDBox>
                  )}
                  {restaurantData?.showLanguages?.ar && (
                    <MDBox pt={2}>
                      <TextField
                        type="text"
                        onChange={handleChange("dish.ar")}
                        onBlur={() => setFieldTouched("dish.ar")}
                        label={translate("EDITMODAL.DISHLABEL_AR")}
                        value={values?.dish?.ar}
                        fullWidth
                      />
                    </MDBox>
                  )}

                  <Grid container mt={1} spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        onChange={handleChange("price")}
                        onBlur={() => setFieldTouched("price")}
                        type="text"
                        label={translate("EDITMODAL.PRICE")}
                        value={values?.price}
                        fullWidth
                      />
                      <ErrorMessage
                        error={errors.price}
                        visible={touched.price}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDTypography variant="subtitle2" fontSize="small">
                        {translate("EDITMODAL.PRICE_INDICATOR")}
                      </MDTypography>
                      <MDTypography variant="subtitle2" fontSize="small">
                        {translate("EDITMODAL.PRICE_WARNING")}
                      </MDTypography>
                    </Grid>
                  </Grid>
                  <MDBox mt={3} mb={1} mr={0} lineHeight={0}></MDBox>
                  <MDBox
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <MDBox
                      sx={{
                        width: { xs: "100%", md: "50%" },
                        py: { xs: 1 },
                        px: { xs: 0, md: 1 },
                      }}
                    >
                      <TextField
                        type="text"
                        onChange={handleChange("dishDescription.he")}
                        onBlur={() => setFieldTouched("dishDescription.he")}
                        label={translate("EDITMODAL.DESCRIPTION_HE")}
                        value={values?.dishDescription?.he}
                        rows={4}
                        multiline
                        fullWidth
                      />
                      <ErrorMessage
                        error={errors.dishDescription?.he}
                        visible={touched.dishDescription?.he}
                      />
                    </MDBox>
                    {restaurantData?.showLanguages?.en && (
                      <MDBox
                        sx={{
                          width: { xs: "100%", md: "50%" },
                          py: { xs: 1 },
                          px: { xs: 0, md: 1 },
                        }}
                      >
                        <TextField
                          type="text"
                          onChange={handleChange("dishDescription.en")}
                          onBlur={() => setFieldTouched("dishDescription.en")}
                          label={translate("EDITMODAL.DESCRIPTION_EN")}
                          value={values?.dishDescription?.en}
                          rows={4}
                          multiline
                          fullWidth
                        />
                      </MDBox>
                    )}
                    {restaurantData?.showLanguages?.es && (
                      <MDBox
                        sx={{
                          width: { xs: "100%", md: "50%" },
                          py: { xs: 1 },
                          px: { xs: 0, md: 1 },
                        }}
                      >
                        <TextField
                          type="text"
                          onChange={handleChange("dishDescription.es")}
                          onBlur={() => setFieldTouched("dishDescription.es")}
                          label={translate("EDITMODAL.DESCRIPTION_ES")}
                          value={values?.dishDescription?.es}
                          rows={4}
                          multiline
                          fullWidth
                        />
                      </MDBox>
                    )}
                    {restaurantData?.showLanguages?.ru && (
                      <MDBox
                        sx={{
                          width: { xs: "100%", md: "50%" },
                          py: { xs: 1 },
                          px: { xs: 0, md: 1 },
                        }}
                      >
                        <TextField
                          type="text"
                          onChange={handleChange("dishDescription.ru")}
                          onBlur={() => setFieldTouched("dishDescription.ru")}
                          label={translate("EDITMODAL.DESCRIPTION_RU")}
                          value={values?.dishDescription?.ru}
                          rows={4}
                          multiline
                          fullWidth
                        />
                      </MDBox>
                    )}
                    {restaurantData?.showLanguages?.ar && (
                      <MDBox
                        sx={{
                          width: { xs: "100%", md: "50%" },
                          py: { xs: 1 },
                          px: { xs: 0, md: 1 },
                        }}
                      >
                        <TextField
                          type="text"
                          onChange={handleChange("dishDescription.ar")}
                          onBlur={() => setFieldTouched("dishDescription.ar")}
                          label={translate("EDITMODAL.DESCRIPTION_AR")}
                          value={values?.dishDescription?.ar}
                          rows={4}
                          multiline
                          fullWidth
                        />
                      </MDBox>
                    )}
                  </MDBox>
                </MDBox>
              </MDBox>

              <DeleteDishImageModal
                isOpen={isDeleteDishImageModalOpen}
                handleClose={() => setIsDeleteDishImageModalOpen(false)}
                deleteDishImage={() => deleteDishImage()}
                onInit={onPlaceHolderDeletePending}
                onComplete={onPlaceHolderDeleteFulfilled}
              />
            </Card>
          </DialogContent>
          <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
            <MDButton
              type="submit"
              variant="gradient"
              color="dark"
              size="medium"
            >
              {translate("BUTTON.SAVE")}
            </MDButton>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
};

export default EditDishModal;
