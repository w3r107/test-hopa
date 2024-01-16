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
import { useRestaurant } from "store/restaurant/restaurant.slice";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { addNewBadge, updateBadgeById } from "store/badge/badge.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { useLibrary } from "store/library/library.slice";
import { getAllImages } from "store/library/library.action";

const validationSchema = Yup.object().shape({
	name: Yup.object().shape({
		he: Yup.string()
			.required("Field is required")
			.label("Badge Name in Hebrew*"),
		en: Yup.string().label("Badge Name in English"),
		es: Yup.string().label("Badge Name in Spanish"),
		ru: Yup.string().label("Badge Name in Russian"),
		ar: Yup.string().label("Badge Name in Arabic"),
		fr: Yup.string().label("Badge Name in French"),
	}),
});

const initialValues = {
	name: {
		he: "",
		en: "",
		es: "",
		ru: "",
		ar: "",
		fr: "",
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

const AddBadge = ({ showSnackbar, isOpen, setOpen, formType, setLoader, formData }) => {

	// Translation
	const { t: translate } = useTranslation();
	const dispatch = useDispatch()

	const [image, setImage] = useState("");

	// Redux State Data
	const { data: restaurantData } = useRestaurant();
	const [isLibraryOpen, setLibraryOpen] = useState(false);
	const { loaded: libLoaded, images: libraryImages } = useLibrary();


	const [snackbarProps, setSnackbarProps] = useState({
		success: false,
		message: "",
		visible: false,
	});


	// set data after getting form type 
	useEffect(() => {
		if (formType === "add") {
			setImage("");
			setValues(initialValues)
		} else if (formType === "edit") {
			setImage(formData.image);
			setValues({ ...formData })
		}
	}, [formType]);




	// on submit 
	const onSubmit = async (values) => {
		setLoader(translate("LOADING.ADDING_BADGE"))
		if (formType === "add") {
			dispatch(addNewBadge({
				data: {
					name: values.name,
					image,
					restaurantId: getRestaurantId()
				}
			}))
				.unwrap()
				.then(() => {
					showSnackbar(true, translate("TOAST.ADD_BADGE_SUCCESS"))
				})
				.catch(() => {
					showSnackbar(false, translate("TOAST.ADD_BADGE_FAILURE"))
				})
				.finally(() => {
					setLoader("")
					setOpen("")
				})
		} else if (formType === "edit") {
			setLoader(translate("LOADING.UPDATING_BADGE"))
			dispatch(updateBadgeById({
				data: {
					...values,
					image,
					badgeId: values.id
				}
			}))
				.unwrap()
				.then(() => {
					showSnackbar(true, translate("TOAST.EDIT_BADGE_SUCCESS"))
				})
				.catch(() => {
					showSnackbar(false, translate("TOAST.EDIT_BADGE_FAILURE"))
				})
				.finally(() => {
					setLoader("")
					setOpen("")
				})
		}
	};


	const onSelectImage = (item) => {
		if (item.image === image) {
			setImage("")
		} else {
			setImage(item?.image);
		}
	};

	useEffect(() => {
		if (!libLoaded) {
			dispatch(getAllImages({
				restaurantId: getRestaurantId()
			}))
		}
	}, [libLoaded])

	const {
		handleChange,
		handleSubmit,
		setFieldTouched,
		errors,
		touched,
		values,
		setValues
	} = useFormik({ initialValues, onSubmit, validationSchema });


	return (
		<>
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
				onClose={() => setOpen("")}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				fullWidth
				maxWidth={"lg"}
			>
				<BootstrapDialogTitle
					id="customized-dialog-title"
					onClose={() => setOpen("")}
				>
					{translate("BADGES.ADD_BADGE")}
				</BootstrapDialogTitle>

				<MDBox px={2}>
					<MDBox px={3}>
						<MDButton
							color="dark"
							size="small"
							variant="gradient"
							onClick={() => {
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
						<MDTypography variant="h5">{translate("UPLOAD_NEW")}</MDTypography>
					</MDBox>

					<MDBox>
						<DishImageCroper
							onSave={(data) => setImage(data)}
							value={image}
							ratio={1 / 1}
							removeFileFunction={() => setImage("")}
						/>
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
								{restaurantData?.showLanguages?.fr && (
									<MDBox pt={2}>
										<TextField
											type="text"
											onChange={handleChange("name.fr")}
											onBlur={() => setFieldTouched("name.fr")}
											label={translate("BADGES.BADGE_NAME_PLACEHOLDER_FR")}
											value={values?.name?.fr}
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
								disabled={!image}
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

export default AddBadge;
