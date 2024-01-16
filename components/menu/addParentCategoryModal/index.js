// React Imports
import React, { useEffect, useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";

// material UI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  IconButton,
  Checkbox,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Local Component Imports
import { MDBox, MDButton, ErrorMessage, FormField } from "/components";
import { DishImageCroper, MDTypography } from "components";

import { useRestaurant } from "store/restaurant/restaurant.slice";
import TimeRangeSelector from "components/elements/TimeRangeSelector";
import { useMenuCtx } from "context/menuContext";
import TimeInput from "components/elements/TimeInput";
import { useLibrary } from "store/library/library.slice";
import Image from "next/image";
import { useChanges } from "store/changes/changes.slice";
import ChangesDropdown from "components/changes/ChangesDropdown";

const allDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
  name: Yup.object().shape({
    he: Yup.string()
      .required("Required")
      .label("Parent Category Name in Hebrew"),
    en: Yup.string().label("Parent Category Name in English"),
    es: Yup.string().label("Parent Category Name in Spanish"),
    ru: Yup.string().label("Parent Category Name in Russian"),
    ar: Yup.string().label("Parent Category Name in Arabic"),
  }),
  description: Yup.object().shape({
    he: Yup.string().label("Parent Category description in Hebrew"),
    en: Yup.string().label("Parent Category description in English"),
    es: Yup.string().label("Parent Category description in Spanish"),
    ru: Yup.string().label("Parent Category description in Russian"),
    ar: Yup.string().label("Parent Category description in Arabic"),
  }),
});

const ParentCategoryModal = () => {
  const {
    parentCategoryFormOpened,
    setParentCategoryFormOpened,
    parentCategoryFormData,
    onSubmitParentCategoryForm,
  } = useMenuCtx();

  const { images: libraryImages } = useLibrary();
  const { loaded: changesLoaded, allchanges } = useChanges();

  const [imageUrl, setImageUrl] = useState("");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [days, setDays] = useState([]);
  const [timerange, setTimeRange] = useState({});

  const [initialValues, setInitalValues] = useState({});

  const { t: translate } = useTranslation();
  const language = Cookies.get("i18next") || "he";
  const { data } = useRestaurant();

  // set parent category data if edit form opened
  // else reset the initalValue
  useEffect(() => {
    if (parentCategoryFormOpened === "add") {
      setValues({
        name: {
          he: "",
          en: "",
          es: "",
          ar: "",
          ru: "",
          fr: "",
        },
        description: {
          he: "",
          en: "",
          es: "",
          ar: "",
          ru: "",
          fr: "",
        },
        changes: [],
      });
      setImageUrl("");
      setDays([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]);
      setTimeRange({
        Sunday: {
          start: "00:00",
          end: "00:00",
        },
        Monday: {
          start: "00:00",
          end: "00:00",
        },
        Tuesday: {
          start: "00:00",
          end: "00:00",
        },
        Wednesday: {
          start: "00:00",
          end: "00:00",
        },
        Thursday: {
          start: "00:00",
          end: "00:00",
        },
        Friday: {
          start: "00:00",
          end: "00:00",
        },
        Saturday: {
          start: "00:00",
          end: "00:00",
        },
      });
    } else if (
      parentCategoryFormOpened === "edit" &&
      parentCategoryFormData &&
      parentCategoryFormData !== undefined
    ) {
      const { days, name, timerange, image, description, changes } =
        parentCategoryFormData;

      const changeIds = changes ? Object.keys(changes) : [];

      const allChanges = allchanges.filter((c) => changeIds.includes(c?.id));

      setImageUrl(image);
      setValues({
        name: name,
        description: description,
        changes: allChanges,
      });
      setDays(days || []);
      setTimeRange(timerange || {});
    }
  }, [parentCategoryFormOpened]);

  const onSubmit = (values) => {
    // tempValue['changes']
    const tempValue = values;
    const getChangesIds = {};

    values.changes.forEach((c) => {
      getChangesIds[c.id] = true;
    });
    tempValue["changes"] = getChangesIds;
    onSubmitParentCategoryForm({
      ...tempValue,
      days,
      image: imageUrl,
      timerange,
    });
    setParentCategoryFormOpened("");
  };

  // day change
  const handleDayChange = (day) => {
    if (days.includes(day)) {
      const filterDay = days.filter((vDay) => day !== vDay);
      setDays(filterDay);
    } else {
      setDays((prev) => [...prev, day]);
    }
  };

  const handleTimeChange = (day, type, value) => {
    let newValue = value;

    if (!day || day === "") return;

    let start = timerange[day]?.start || "00:00";
    let end = timerange[day]?.end || "00:00";

    if (type === "startHour" || type === "endHour") {
      // If the hour is being changed, use the current value of the minute input
      const minuteValue =
        type === "startHour" ? start.split(":")[1] : end.split(":")[1];
      newValue = value + ":" + (minuteValue || "");
    } else if (type === "startMinute" || type === "endMinute") {
      // If the minute is being changed, use the current value of the hour input
      const hourValue =
        type === "startMinute" ? start.split(":")[0] : end.split(":")[0];
      newValue = (hourValue || "") + ":" + value;
    }

    setTimeRange((prev) => {
      return {
        ...prev,
        [day]: {
          ...prev[day],
          [type.includes("start") ? "start" : "end"]: newValue,
        },
      };
    });
  };

  const {
    handleChange,
    handleSubmit,
    values,
    setValues,
    setFieldTouched,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validationSchema,
  });

  return (
    <BootstrapDialog
      open={
        parentCategoryFormOpened === "add" ||
        parentCategoryFormOpened === "edit"
      }
      onClose={() => setParentCategoryFormOpened("")}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth
      maxWidth={"lg"}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => setParentCategoryFormOpened("")}
      >
        {translate("ADD_PARENT_CATEGORY")}
      </BootstrapDialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Card
            id="basic-info"
            sx={{
              overflow: "visible",
            }}
          >
            <MDBox px={3}>
              <MDButton
                color="dark"
                size="small"
                variant="gradient"
                onClick={() => {
                  setIsLibraryOpen(!isLibraryOpen);
                }}
              >
                {!isLibraryOpen
                  ? translate("BADGES.CHOOSE_FROM_GALLERY")
                  : translate("BADGES.CANCEL")}
              </MDButton>
            </MDBox>
            {isLibraryOpen && (
              <>
                <MDTypography p={2} sx={{ fontSize: 17 }}>
                  {translate("SELECT_IMAGE_FROM_LIST")}
                </MDTypography>
                <MDBox p={1}>
                  <MDTypography m={1} variant="h5">
                    {translate("LIBRARY.MY_UPLOADS")}
                  </MDTypography>
                  <Grid container spacing={1} p={2}>
                    {libraryImages?.map((item, index) => (
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
                          onClick={() => setImageUrl(item?.image)}
                        >
                          {imageUrl === item?.image && (
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
                          {image === item?.image && (
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
              </>
            )}

            <MDBox m={3}>
              <MDTypography variant="h5">
                {translate("UPLOAD_NEW")}
              </MDTypography>
            </MDBox>

            <MDBox>
              <DishImageCroper
                onSave={(data) => setImageUrl(data)}
                value={imageUrl}
                ratio={1 / 1}
                removeFileFunction={() => setImageUrl("")}
              />
            </MDBox>
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("ENTER_CHANGES")}
            </MDTypography>
            <MDBox p={2}>
              <ChangesDropdown
                changes={(() => {
                  return allchanges.map((el) => {
                    return {
                      id: el.id,
                      title: el.title,
                    };
                  });
                })()}
                onChange={setFieldValue}
                label={translate("EDITMODAL.SELECT_CHANGES")}
                value={values?.changes}
              />
            </MDBox>
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("ENTER_PARENT_CATEGORY_NAME")}
            </MDTypography>
            <MDBox
              dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
              pb={3}
            >
              <MDBox p={2}>
                <FormField
                  type="text"
                  value={values?.name?.he}
                  onChange={handleChange("name.he")}
                  onBlur={() => setFieldTouched("name.he")}
                  label={translate("PLACEHOLDER.PARENT_CATEGORY_NAME_HE")}
                />
                <ErrorMessage
                  error={errors.name?.he}
                  visible={touched.name?.he}
                />
              </MDBox>
            </MDBox>
            {data?.showLanguages?.en && (
              <MDBox
                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                pb={3}
              >
                <MDBox p={2}>
                  <FormField
                    type="text"
                    value={values?.name?.en}
                    onChange={handleChange("name.en")}
                    onBlur={() => setFieldTouched("name.en")}
                    label={translate("PLACEHOLDER.PARENT_CATEGORY_NAME_EN")}
                  />
                  <ErrorMessage
                    error={errors.name?.en}
                    visible={touched.name?.en}
                  />
                </MDBox>
              </MDBox>
            )}

            {data?.showLanguages?.es && (
              <MDBox
                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                pb={3}
              >
                <MDBox p={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.es")}
                    onBlur={() => setFieldTouched("name.es")}
                    label={translate("PLACEHOLDER.PARENT_CATEGORY_NAME_ES")}
                    value={values?.name?.es}
                  />
                  <ErrorMessage
                    error={errors.name?.es}
                    visible={touched.name?.es}
                  />
                </MDBox>
              </MDBox>
            )}
            {data?.showLanguages?.ru && (
              <MDBox
                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                pb={3}
              >
                <MDBox p={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.ru")}
                    onBlur={() => setFieldTouched("name.ru")}
                    label={translate("PLACEHOLDER.PARENT_CATEGORY_NAME_RU")}
                    value={values?.name?.ru}
                  />
                  <ErrorMessage
                    error={errors.name?.ru}
                    visible={touched.name?.ru}
                  />
                </MDBox>
              </MDBox>
            )}
            {data?.showLanguages?.ar && (
              <MDBox
                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                pb={3}
              >
                <MDBox p={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.ar")}
                    onBlur={() => setFieldTouched("name.ar")}
                    label={translate("PLACEHOLDER.PARENT_CATEGORY_NAME_AR")}
                    value={values?.name?.ar}
                  />
                  <ErrorMessage
                    error={errors.name?.ar}
                    visible={touched.name?.ar}
                  />
                </MDBox>
              </MDBox>
            )}
            {data?.showLanguages?.fr && (
              <MDBox
                dir={language !== "he" && language !== "ar" ? "ltr" : "rtl"}
                pb={3}
              >
                <MDBox p={2}>
                  <FormField
                    type="text"
                    onChange={handleChange("name.fr")}
                    onBlur={() => setFieldTouched("name.fr")}
                    label={translate("PLACEHOLDER.PARENT_CATEGORY_NAME_FR")}
                    value={values?.name?.fr}
                  />
                  <ErrorMessage
                    error={errors.name?.fr}
                    visible={touched.name?.fr}
                  />
                </MDBox>
              </MDBox>
            )}
            {/* --------------------------------------------------------------- */}
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("ENTER_CATEGORY_DESCRIPTION")}
            </MDTypography>
            <MDBox mt={3} mb={1} mx={0} lineHeight={0}></MDBox>
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
                <FormField
                  type="text"
                  onChange={handleChange("description.he")}
                  onBlur={() => setFieldTouched("description.he")}
                  label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_HE")}
                  value={values?.description?.he || ""}
                  rows={4}
                  multiline
                />
                <ErrorMessage
                  error={errors.description?.he}
                  visible={touched.description?.he}
                />
              </MDBox>

              {data?.showLanguages?.en && (
                <MDBox
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 1 },
                  }}
                >
                  <FormField
                    type="text"
                    onChange={handleChange("description.en")}
                    onBlur={() => setFieldTouched("description.en")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_EN")}
                    value={values?.description?.en || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.en}
                    visible={touched.description?.en}
                  />
                </MDBox>
              )}
              {data?.showLanguages?.es && (
                <MDBox
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 1 },
                  }}
                >
                  <FormField
                    type="text"
                    onChange={handleChange("description.es")}
                    onBlur={() => setFieldTouched("description.es")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_ES")}
                    value={values?.description?.es || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.es}
                    visible={touched.description?.es}
                  />
                </MDBox>
              )}
              {data?.showLanguages?.ru && (
                <MDBox
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 1 },
                  }}
                >
                  <FormField
                    type="text"
                    onChange={handleChange("description.ru")}
                    onBlur={() => setFieldTouched("description.ru")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_RU")}
                    value={values?.description?.ru || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.ru}
                    visible={touched.description?.ru}
                  />
                </MDBox>
              )}
              {data?.showLanguages?.ar && (
                <MDBox
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 1 },
                  }}
                >
                  <FormField
                    type="text"
                    onChange={handleChange("description.ar")}
                    onBlur={() => setFieldTouched("description.ar")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_AR")}
                    value={values?.description?.ar || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.ar}
                    visible={touched.description?.ar}
                  />
                </MDBox>
              )}
              {data?.showLanguages?.fr && (
                <MDBox
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    py: { xs: 1 },
                    px: { xs: 0, md: 1 },
                  }}
                >
                  <FormField
                    type="text"
                    onChange={handleChange("description.fr")}
                    onBlur={() => setFieldTouched("description.fr")}
                    label={translate("PLACEHOLDER.CATEGORY_DESCRIPTION_FR")}
                    value={values?.description?.fr || ""}
                    rows={4}
                    multiline
                  />
                  <ErrorMessage
                    error={errors.description?.fr}
                    visible={touched.description?.fr}
                  />
                </MDBox>
              )}
            </MDBox>

            {/* --------------------------------------------------------------- */}
            <MDTypography mt={2} ml={3} variant="h5">
              {translate("EDITMODAL.ENTER_PARENT_CATEGORY_TIMERANGE")}
            </MDTypography>
            <Grid item xs={12} p={2}>
              <MDTypography variant="subtitle2" fontSize="small">
                {translate("EDITMODAL.TIMERANGE_DEFAULT")}
              </MDTypography>
              <MDTypography variant="subtitle2" fontSize="small">
                {translate("EDITMODAL.DAYS_INDICATION")}
              </MDTypography>
              <MDTypography variant="subtitle2" fontSize="small">
                {translate("EDITMODAL.TIMERANGE_INDICATION")}
              </MDTypography>
            </Grid>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              {allDays.map((day) => {
                return (
                  <div
                    key={day}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 170px) minmax(0, 1fr)",
                      alignItems: "flex-start",
                      padding: "10px 0",
                    }}
                  >
                    <div
                      key={day}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Checkbox
                        checked={days.includes(day)}
                        onChange={() => handleDayChange(day)}
                      />
                      <MDBox p={2}>
                        <MDTypography variant="h6">
                          {translate(`DAYS.${day}`)}
                        </MDTypography>
                      </MDBox>
                    </div>
                    {days.includes(day) && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          gap: "15px",
                          paddingTop: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "minmax(0, 95px) minmax(0, 1fr)",
                              alignItems: "flex-start",
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                          >
                            <MDBox p={1}>
                              <MDTypography variant="p">
                                {translate("EDITMODAL.CATEGORY_TIME_START")}
                              </MDTypography>
                            </MDBox>
                            <TimeInput
                              hourValue={
                                timerange[day]?.start?.split(":")[0] || "00"
                              }
                              minuteValue={
                                timerange[day]?.start?.split(":")[1] || "00"
                              }
                              onChangeHour={(e) =>
                                handleTimeChange(
                                  day,
                                  "startHour",
                                  e.target.value
                                )
                              }
                              onChangeMinute={(e) =>
                                handleTimeChange(
                                  day,
                                  "startMinute",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "minmax(0, 85px) minmax(0, 1fr)",
                              alignItems: "flex-start",
                              marginLeft: "100px",
                              marginRight: "100px",
                            }}
                          >
                            <MDBox p={1}>
                              <MDTypography variant="p">
                                {translate("EDITMODAL.CATEGORY_TIME_END")}
                              </MDTypography>
                            </MDBox>
                            <TimeInput
                              hourValue={
                                timerange[day]?.end?.split(":")[0] || "00"
                              }
                              minuteValue={
                                timerange[day]?.end?.split(":")[1] || "00"
                              }
                              onChangeHour={(e) =>
                                handleTimeChange(day, "endHour", e.target.value)
                              }
                              onChangeMinute={(e) =>
                                handleTimeChange(
                                  day,
                                  "endMinute",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <MDButton type="submit" variant="gradient" color="dark" size="medium">
            {translate("BUTTON.SAVE")}
          </MDButton>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
};

export default ParentCategoryModal;
