// React Imports
import { forwardRef } from "react";

// External Package Imports
import PropTypes from "prop-types";

// MUI Imports
import { MenuItem, Link } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography } from "/components";

// Styles
import menuItem from "./styles";

const NotificationItem = forwardRef(({ icon, title, ...rest }, ref) => (
  <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
    <MDBox
      component={Link}
      py={0.5}
      display="flex"
      alignItems="center"
      lineHeight={1}
    >
      <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
        {icon}
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" sx={{ ml: 1 }}>
        {title}
      </MDTypography>
    </MDBox>
  </MenuItem>
));

// Typechecking props for the NotificationItem
NotificationItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

NotificationItem.displayName = "NotificationItem";
export default NotificationItem;
