// React Imports
import { useEffect, useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";;
import { useFormik } from "formik";
import * as Yup from "yup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";


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
import { useMenuCtx } from "context/menuContext";
import { useBadge } from "store/badge/badge.slice";
import { getAllBadges } from "store/badge/badge.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { addNewDish, updateDish } from "store/dish/dish.action";
import DishCategoryDropdown from "../dishCategoryDropdown";
import { getRestaurantCategories } from "store/category/category.action";
import { useCategory } from "store/category/category.slice";
import { useLibrary } from "store/library/library.slice";
import { getAllImages } from "store/library/library.action";
import { getAllChanges } from "store/changes/changes.action";
import { useChanges } from "store/changes/changes.slice";
import ChangesDropdown from "components/changes/ChangesDropdown";
import DishParentCategoryDropdown from "../dishParentCategoryDropdown.js";

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
            .required("Field is required")
            .label("Dish Name in Hebrew*"),
        en: Yup.string().label("Dish Name in English"),
        es: Yup.string().label("Category Name in Spanish"),
        ru: Yup.string().label("Category Name in Russian"),
        ar: Yup.string().label("Category Name in Arabic"),
        fr: Yup.string().label("Category Name in French"),
    }),
    description: Yup.object().shape({
        he: Yup.string().label("Description in Hebrew*"),
        en: Yup.string().label("Description in English"),
        es: Yup.string().label("Category Name in Spanish"),
        ru: Yup.string().label("Category Name in Russian"),
        ar: Yup.string().label("Category Name in Arabic"),
        fr: Yup.string().label("Category Name in French"),
    }),
    imageAlt: Yup.string().label("Image alt ...*"),
    badges: Yup.array().label("Badge"),
});

const initialValues = {
    type: "",
    parentCategoryId: "",
    categoryId: "",
    name: {
        he: "",
        en: "",
        es: "",
        ru: "",
        ar: "",
        fr: "",
    },
    description: {
        he: "",
        en: "",
        es: "",
        ru: "",
        ar: "",
        fr: "",
    },
    price: 0,
    currencyValue: "",
    imageAlt: "",
    badges: [],
    changes: []
};

const DishModal = ({ handleClose }) => {

    // Translation
    const { t: translate } = useTranslation();

    const dispatch = useDispatch()

    // Image URL uploaded to firebase storage
    const [image, setImage] = useState("");

    const [isLibraryOpen, setLibraryOpen] = useState(false);

    const { data: restaurantData } = useRestaurant();
    const {
        dishFormData,
        dishFormOpened,
        setDishFormOpened,
        showLoader,
        showSnackbar
    } = useMenuCtx();

    const { badges, loaded: badgeLoaded } = useBadge();
    const { allCategoriesLoaded } = useCategory();

    const { loaded: libLoaded, images: libraryImages } = useLibrary();
    const { loaded: changesLoaded, allchanges } = useChanges();

    const onSelectImage = (item) => {
        if (item.image === image) {
            setImage("")
        } else {
            setImage(item?.image);
        }
    };

    // check dish add type and check if it is add form or edit form
    useEffect(() => {
        if (dishFormOpened === "add") {
            setImage("");

            setValues({
                ...initialValues,
                ...dishFormData
            })
        } else if (dishFormOpened === "edit") {
            if (!badgeLoaded) return;
            setImage(dishFormData?.image);

            const { badges: badgeData, changes: changeData, ...restData } = dishFormData;
            const badgeIds = badgeData ? Object.keys(badgeData) : [];
            const changeIds = changeData ? Object.keys(changeData) : [];

            const allBadges = badges.filter((b) => badgeIds.includes(b?.id));
            const allChanges = allchanges.filter((c) => changeIds.includes(c?.id));


            setValues({
                ...restData,
                badges: allBadges,
                changes: allChanges
            })
        }
    }, [dishFormOpened, badgeLoaded]);


    // Handle Form Submit
    const onSubmit = (values) => {
        const getBadgeIds = {};
        const getChangesIds = {};

        values.badges.forEach((badge) => {
            getBadgeIds[badge.id] = true;
        });
        values.changes.forEach((c) => {
            getChangesIds[c.id] = true;
        });

        const dishData = {
            ...values,
            badges: getBadgeIds,
            changes: getChangesIds,
            price: values.price || 0,
            image,
            currencyValue: restaurantData.currency,
            restaurantId: getRestaurantId(),
        };
        
        
        
        if (dishFormOpened === "add") {
            dishData.isVisible = true;
            dishData.isShowCartOption = false;
            
            showLoader(true, translate("LOADING.ADDING_DISH"))
            dispatch(addNewDish({ data: dishData }))
                .unwrap()
                .then(() => {
                    setDishFormOpened("")
                    showSnackbar(true, translate("TOAST.ADD_DISH_SUCCESS"))
                })
                .catch(() => {
                    showSnackbar(false, translate("TOAST.ADD_DISH_FAILURE"))
                })
                .finally(() => {
                    showLoader(false)
                })

        } else if (dishFormOpened === "edit") {
            dishData.dishId = dishData.id;
            delete dishData.id;

            showLoader(true, translate("LOADING.UPDATING_DISH"))
            dispatch(updateDish({ data: dishData }))
                .unwrap()
                .then(() => {
                    setDishFormOpened("")
                    showSnackbar(true, translate("TOAST.UPDATE_DISH_SUCCESS"))
                })
                .catch((err) => {
                    console.log(err);
                    showSnackbar(false, translate("TOAST.UPDATE_DISH_FAILURE"))
                })
                .finally(() => {
                    showLoader(false)
                })
        }
    };

    useEffect(() => {
        if (!badgeLoaded) {
            dispatch(getAllBadges({ restaurantId: getRestaurantId() }))
        }
    }, [badgeLoaded])

    useEffect(() => {
        if (!changesLoaded) {
            dispatch(getAllChanges({ restaurantId: getRestaurantId() }))
        }
    }, [changesLoaded])

    const {
        handleChange,
        handleSubmit,
        setFieldTouched,
        errors,
        touched,
        values,
        setValues,
        setFieldValue
    } = useFormik({ initialValues, onSubmit, validationSchema });

    const onGetName = (name) => {
        setFieldValue("imageAlt", name);
    };

    const checkLoadLibrary = () => {
        if (!libLoaded) {
            dispatch(getAllImages({
                restaurantId: getRestaurantId()
            }))
        }
    }

    const changeOrResetCategory = (parentCategoryId) => {
        setFieldValue("categoryId", "")
    }


    useEffect(() => {
        if (!allCategoriesLoaded) {
            dispatch(getRestaurantCategories({ restaurantId: getRestaurantId() }))
        }
    }, [dispatch])

    return (
        <>
            <BootstrapDialog
                open={dishFormOpened === "add" || dishFormOpened === "edit"}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                fullWidth
                maxWidth={"lg"}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={() => setDishFormOpened("")}
                >
                    {dishFormOpened === "edit" ? translate("EDITMODAL.EDIT_DISH") : translate("EDITMODAL.ADD_DISH")}
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
                                        checkLoadLibrary()
                                        setLibraryOpen(!isLibraryOpen);
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

                                    <MDBox p={2}>
                                        <MDTypography m={1} variant="h5">
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

                            <DishImageCroper
                                onSave={(e) => setImage(e)}
                                onName={onGetName}
                                value={image}
                                ratio={1 / 1}
                                removeFileFunction={() => setImage("")}
                            />
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


                            {
                                (dishFormOpened === "edit") && (
                                    <>
                                        <MDBox p={2}>
                                            <MDTypography variant="h5">
                                                {translate("EDITMODAL.SELECT_PARENT_CATEGORY")}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox p={2}>
                                            <DishParentCategoryDropdown
                                                parentCategoryId={values.parentCategoryId}
                                                onChange={setFieldValue}
                                                onCategoryChange={changeOrResetCategory}
                                                label={translate("EDITMODAL.SELECT_PARENT_CATEGORY")}
                                            />
                                        </MDBox>
                                    </>
                                )
                            }

                            {
                                (dishFormOpened === "edit") && (
                                    <>
                                        <MDBox p={2}>
                                            <MDTypography variant="h5">
                                                {translate("EDITMODAL.SELECT_CATEGORY")}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox p={2}>
                                            <DishCategoryDropdown
                                                categoryId={values.categoryId || ""}
                                                parentCategoryId={values.parentCategoryId}
                                                onChange={setFieldValue}
                                                label={translate("EDITMODAL.SELECT_CATEGORY")}
                                            />
                                        </MDBox>
                                    </>
                                )
                            }


                            <MDBox p={2}>
                                <MDTypography variant="h5">{translate("BADGES.SELECT_BADGE")}</MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <BadgeDropdown
                                    badges={badges || []}
                                    onChange={setFieldValue}
                                    label={translate("BADGES.SELECT_BADGE")}
                                    value={values?.badges}
                                />
                            </MDBox>
                            <MDBox p={2}>
                                <MDTypography variant="h5">{translate("EDITMODAL.DISH_CHANGES")}</MDTypography>
                            </MDBox>
                            <MDBox p={2}>
                                <ChangesDropdown
                                    changes={(() => {
                                        return allchanges.map((el) => {
                                            return {
                                                id: el.id,
                                                title: el.title,

                                            }
                                        })
                                    })()}
                                    onChange={setFieldValue}
                                    label={translate("EDITMODAL.SELECT_CHANGES")}
                                    value={values?.changes}
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
                                        onChange={handleChange("name.he")}
                                        onBlur={() => setFieldTouched("name.he")}
                                        label={translate("EDITMODAL.DISHLABEL_HE")}
                                        value={values?.name?.he}
                                        fullWidth
                                    />
                                    <ErrorMessage
                                        error={errors.name?.he}
                                        visible={touched.name?.en}
                                    />
                                    {restaurantData?.showLanguages?.en && (
                                        <MDBox pt={2}>
                                            <TextField
                                                type="text"
                                                onChange={handleChange("name.en")}
                                                onBlur={() => setFieldTouched("name.en")}
                                                label={translate("EDITMODAL.DISHLABEL_EN")}
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
                                                label={translate("EDITMODAL.DISHLABEL_ES")}
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
                                                label={translate("EDITMODAL.DISHLABEL_RU")}
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
                                                label={translate("EDITMODAL.DISHLABEL_AR")}
                                                value={values?.name?.ar}
                                                fullWidth
                                            />
                                        </MDBox>
                                    )}
                                    {restaurantData?.showLanguages?.fr && (
                                        <MDBox pt={2}>
                                            <TextField
                                                type="text"
                                                onChange={handleChange("name.fr")}
                                                onBlur={() => setFieldTouched("name.fr")}
                                                label={translate("EDITMODAL.DISHLABEL_FR")}
                                                value={values?.name?.fr}
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
                                                onChange={handleChange("description.he")}
                                                onBlur={() => setFieldTouched("description.he")}
                                                label={translate("EDITMODAL.DESCRIPTION_HE")}
                                                value={values?.description?.he}
                                                rows={4}
                                                multiline
                                                fullWidth
                                            />
                                            <ErrorMessage
                                                error={errors.description?.he}
                                                visible={touched.description?.he}
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
                                                    onChange={handleChange("description.en")}
                                                    onBlur={() => setFieldTouched("description.en")}
                                                    label={translate("EDITMODAL.DESCRIPTION_EN")}
                                                    value={values?.description?.en}
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
                                                    onChange={handleChange("description.es")}
                                                    onBlur={() => setFieldTouched("description.es")}
                                                    label={translate("EDITMODAL.DESCRIPTION_ES")}
                                                    value={values?.description?.es}
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
                                                    onChange={handleChange("description.ru")}
                                                    onBlur={() => setFieldTouched("description.ru")}
                                                    label={translate("EDITMODAL.DESCRIPTION_RU")}
                                                    value={values?.description?.ru}
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
                                                    onChange={handleChange("description.ar")}
                                                    onBlur={() => setFieldTouched("description.ar")}
                                                    label={translate("EDITMODAL.DESCRIPTION_AR")}
                                                    value={values?.description?.ar}
                                                    rows={4}
                                                    multiline
                                                    fullWidth
                                                />
                                            </MDBox>
                                        )}
                                        {restaurantData?.showLanguages?.fr && (
                                            <MDBox
                                                sx={{
                                                    width: { xs: "100%", md: "50%" },
                                                    py: { xs: 1 },
                                                    px: { xs: 0, md: 1 },
                                                }}
                                            >
                                                <TextField
                                                    type="text"
                                                    onChange={handleChange("description.fr")}
                                                    onBlur={() => setFieldTouched("description.fr")}
                                                    label={translate("EDITMODAL.DESCRIPTION_FR")}
                                                    value={values?.description?.fr}
                                                    rows={4}
                                                    multiline
                                                    fullWidth
                                                />
                                            </MDBox>
                                        )}
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>{" "}
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

export default DishModal;
