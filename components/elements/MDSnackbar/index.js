// External Package Imports
import PropTypes from "prop-types";

// MUI Imports
import { Snackbar, IconButton, Icon, Divider, Fade, useMediaQuery } from "@mui/material/";

// Local Component Imports
import { MDBox, MDTypography } from "/components/";

// Root
import MDSnackbarIconRoot from "./MDSnackbarIconRoot";

// Context Imports
import { useMaterialUIController } from "/context";

function MDSnackbar({
  color,
  icon,
  title,
  dateTime,
  content,
  close,
  bgWhite,
  ...rest
}) {
  const [controller] = useMaterialUIController();
  const matches = useMediaQuery('(min-width:600px)');
  const { darkMode } = controller;

  let titleColor;
  let dateTimeColor;
  let dividerColor;

  if (bgWhite) {
    titleColor = color;
    dateTimeColor = "dark";
    dividerColor = false;
  } else if (color === "light") {
    titleColor = darkMode ? "inherit" : "dark";
    dateTimeColor = darkMode ? "inherit" : "text";
    dividerColor = false;
  } else {
    titleColor = "white";
    dateTimeColor = "white";
    dividerColor = true;
  }

  return (
    <Snackbar
      TransitionComponent={Fade}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...rest}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={close}
        >
          <Icon fontSize="small">close</Icon>
        </IconButton>
      }
    >
      <MDBox
        variant={bgWhite ? "contained" : "gradient"}
        bgColor={bgWhite ? "white" : color}
        // minWidth="21.875rem"
        // maxWidth="100%"
        shadow="md"
        borderRadius="md"
        p={1}
        sx={{
          backgroundColor: ({ palette }) =>
            darkMode
              ? palette.background.card
              : palette[color] || palette.white.main,
              minWidth: matches?"20rem":`calc(100vw - 1rem)`
        }}
      >
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          color="dark"
          p={1.5}
        >
          <MDBox
            sx={{
              fontSize: ({ typography: { size } }) => size.sm,
              color: ({ palette: { white, text } }) => {
                let colorValue =
                  bgWhite || color === "light" ? text.main : white.main;

                if (darkMode) {
                  colorValue = color === "light" ? "inherit" : white.main;
                }

                return colorValue;
              },
            }}
          >
            {content}
          </MDBox>
          <Icon
            sx={{
              color: ({ palette: { dark, white } }) =>
                (bgWhite && !darkMode) || color === "light"
                  ? dark.main
                  : white.main,
              fontWeight: ({ typography: { fontWeightBold } }) =>
                fontWeightBold,
              cursor: "pointer",
              marginLeft: 2,
              transform: "translateY(-1px)",
            }}
            onClick={close}
          >
            close
          </Icon>
        </MDBox>
        {/* <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          color="dark"
          p={1.5}
        >
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <MDSnackbarIconRoot
              fontSize="small"
              ownerState={{ color, bgWhite }}
            >
              {icon}
            </MDSnackbarIconRoot>
            <MDTypography
              variant="button"
              fontWeight="medium"
              color={titleColor}
              textGradient={bgWhite}
            >
              {title}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <MDTypography variant="caption" color={dateTimeColor}>
              {dateTime}
            </MDTypography>
            <Icon
              sx={{
                color: ({ palette: { dark, white } }) =>
                  (bgWhite && !darkMode) || color === "light"
                    ? dark.main
                    : white.main,
                fontWeight: ({ typography: { fontWeightBold } }) =>
                  fontWeightBold,
                cursor: "pointer",
                marginLeft: 2,
                transform: "translateY(-1px)",
              }}
              onClick={close}
            >
              close
            </Icon>
          </MDBox>
        </MDBox>
        <Divider sx={{ margin: 0 }} light={dividerColor} />
        <MDBox
          p={1.5}
          sx={{
            fontSize: ({ typography: { size } }) => size.sm,
            color: ({ palette: { white, text } }) => {
              let colorValue =
                bgWhite || color === "light" ? text.main : white.main;

              if (darkMode) {
                colorValue = color === "light" ? "inherit" : white.main;
              }

              return colorValue;
            },
          }}
        >
          {content}
        </MDBox> */}
      </MDBox>
    </Snackbar>
  );
}

// Setting default values for the props of MDSnackbar
MDSnackbar.defaultProps = {
  bgWhite: false,
  color: "dark",
};

// Typechecking props for MDSnackbar
MDSnackbar.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  close: PropTypes.func.isRequired,
  bgWhite: PropTypes.bool,
};

export default MDSnackbar;
