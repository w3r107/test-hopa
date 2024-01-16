// React Imports
import React, { useLayoutEffect, useState } from "react";

// External Package Imports

// MUI Imports
import { Card, IconButton, Tooltip, Icon } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography } from "/components";

// Context Imports
import { useMaterialUIController } from "/context";


// Firebase Imports
import { useTranslation } from "react-i18next";
import { useChangesCtx } from "context/changesContext";
import { useRestaurant } from "store/restaurant/restaurant.slice";

const OptionsTile = ({ changesId, option }) => {
	const [{ darkMode, language }] = useMaterialUIController();
	const { t: translate } = useTranslation();

	const [isScreenSmall, setScreenSmall] = useState(true);
	const { data: restaurantData } = useRestaurant();

	const {
		setOptionDeleteData,
		setIsOptionDeleting,
		setOptionFormData, setOptionFormOpened
	} = useChangesCtx()


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
									{option?.content[language]}
								</MDTypography>
								<div style={{ display: "flex", marginLeft: "0.2rem" }}></div>
							</div>

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
							{restaurantData?.currency} {option?.price}
						</MDTypography>
					</MDBox>
				</MDBox>

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
							sx={styles.btn}
							onClick={() => {
								setOptionFormData({
									...option,
									optionId: option.id,
									changesId: changesId
								});
								setOptionFormOpened("edit");
							}}
						>
							<IconButton>
								<Icon>edit</Icon>
							</IconButton>
							<MDTypography sx={{ fontSize: 13 }}>Edit</MDTypography>
						</MDBox>
						<MDBox sx={{ display: "flex" }}>
							<MDBox
								sx={styles.btn}
								onClick={() => {
									setIsOptionDeleting(true)
									setOptionDeleteData({ changesId, optionId: option.id })
								}}
							>
								<IconButton color="error">
									<Icon>delete</Icon>
								</IconButton>
								<MDTypography sx={{ fontSize: 13 }}>Delete</MDTypography>
							</MDBox>

						</MDBox>
					</MDBox>
				) : (
					<>

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
									setOptionFormData({
										...option,
										optionId: option.id,
										changesId: changesId
									});
									setOptionFormOpened("edit");
								}}
							>
								<Icon>edit</Icon>
							</IconButton>
						</Tooltip>

						<Tooltip title={translate("DELETE")}>
							<IconButton
								color="error"
								onClick={() => {
									setOptionDeleteData({ changesId, optionId: option.id })
									setIsOptionDeleting(true)
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

export default React.memo(OptionsTile);
