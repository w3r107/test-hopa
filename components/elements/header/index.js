// React Imports
import { useState, useEffect } from "react";

// Next Imports
import { useRouter } from "next/router";

// External Package Imports
import PropTypes from "prop-types";

// MUI Imports
import { AppBar, Toolbar, IconButton, Menu, Icon } from "@mui/material";

// Local Package Imports
import { MDBox } from "/components";
// Examples from Theme
import NotificationItem from "/examples/Items/NotificationItem";
import {
	navbar,
	navbarContainer,
	navbarRow,
	navbarIconButton,
	navbarDesktopMenu,
	navbarMobileMenu,
} from "/examples/Navbars/DashboardNavbar/styles";

// Context Imports
import {
	useMaterialUIController,
	setMiniSidenav,
	setOpenConfigurator,
} from "/context";
import MDButton from "../MDButton";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { logoutUser } from "store/auth/auth.action";

const Header = ({ absolute, light, isMini }) => {
	const [navbarType, setNavbarType] = useState();
	const [controller, dispatch] = useMaterialUIController();
	const {
		miniSidenav,
		transparentNavbar,
		openConfigurator,
		darkMode,
	} = controller;
	const [openMenu, setOpenMenu] = useState(false);
	const route = useRouter().pathname.split("/").slice(1);

	const router = useRouter();
	const dispatcher = useDispatch();
	const { t } = useTranslation();
	const [loader, setLoader] = useState({ active: false, message: null });

	// useEffect(() => {
	//   if (fixedNavbar) {
	//     setNavbarType("sticky");
	//   } else {
	//     setNavbarType("static");
	//   }

	//   function handleTransparentNavbar() {
	//     setTransparentNavbar(
	//       dispatch,
	//       (fixedNavbar && window.scrollY === 0) || !fixedNavbar
	//     );
	//   }

	//   window.addEventListener("scroll", handleTransparentNavbar);
	//   handleTransparentNavbar();

	//   return () => window.removeEventListener("scroll", handleTransparentNavbar);
	// }, [dispatch, fixedNavbar]);

	const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
	const handleConfiguratorOpen = () =>
		setOpenConfigurator(dispatch, !openConfigurator);
	const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
	const handleCloseMenu = () => setOpenMenu(false);

	const renderMenu = () => (
		<Menu
			anchorEl={openMenu}
			anchorReference={null}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			open={Boolean(openMenu)}
			onClose={handleCloseMenu}
			sx={{ mt: 2 }}
		>
			<NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
			<NotificationItem
				icon={<Icon>podcasts</Icon>}
				title="Manage Podcast sessions"
			/>
			<NotificationItem
				icon={<Icon>shopping_cart</Icon>}
				title="Payment successfully completed"
			/>
		</Menu>
	);

	const handleLogout = async () => {
		dispatcher(logoutUser())
			.unwrap()
			.then(() => {
				router.push("/signin")
				localStorage.removeItem("idToken")
				localStorage.removeItem("rfToken")
				localStorage.removeItem("restaurantId")
				sessionStorage.removeItem("dishesAnalytics")
			})
	};

	const iconsStyle = ({
		palette: { dark, white, text },
		functions: { rgba },
	}) => ({
		color: () => {
			let colorValue = light || darkMode ? white.main : dark.main;

			if (transparentNavbar && !light) {
				colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
			}

			return colorValue;
		},
	});

	return (
		<AppBar
			position={absolute ? "absolute" : navbarType}
			color="inherit"
			sx={(theme) =>
				navbar(theme, { transparentNavbar, absolute, light, darkMode })
			}
		>
			<Toolbar sx={(theme) => navbarContainer(theme)}>
				<MDBox
					color="inherit"
					mb={{ xs: 1, md: 0 }}
					sx={(theme) => navbarRow(theme, { isMini })}
				>
					<IconButton
						sx={navbarDesktopMenu}
						onClick={handleMiniSidenav}
						size="small"
						disableRipple
					>
						<Icon fontSize="medium" sx={iconsStyle}>
							{miniSidenav ? "menu_open" : "menu"}
						</Icon>
					</IconButton>
				</MDBox>
				{isMini ? null : (
					<MDBox sx={(theme) => navbarRow(theme, { isMini })}>
						<MDBox color={light ? "white" : "inherit"}>
							<IconButton
								size="small"
								disableRipple
								color="inherit"
								sx={navbarMobileMenu}
								onClick={handleMiniSidenav}
							>
								<Icon sx={iconsStyle} fontSize="medium">
									{miniSidenav ? "menu_open" : "menu"}
								</Icon>
							</IconButton>
							<IconButton
								size="small"
								disableRipple
								color="inherit"
								sx={navbarIconButton}
								onClick={handleConfiguratorOpen}
							>
								<Icon sx={iconsStyle}>settings</Icon>
							</IconButton>
							<MDButton
								onClick={handleLogout}
								variant="gradient"
								color="dark"
								size="medium"
							>
								<Icon>logout</Icon>&nbsp;
								{t("LOGOUT")}
							</MDButton>
							{renderMenu()}
						</MDBox>
					</MDBox>
				)}
			</Toolbar>
		</AppBar>
	);
};

Header.defaultProps = {
	absolute: false,
	light: false,
	isMini: false,
};

Header.propTypes = {
	absolute: PropTypes.bool,
	light: PropTypes.bool,
	isMini: PropTypes.bool,
};

export default Header;
