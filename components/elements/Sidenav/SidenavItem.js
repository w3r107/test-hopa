// External Package Imports
import PropTypes from "prop-types";

// MUI Imports
import {
  Collapse,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  // Icon
} from "@mui/material";

// Local Component Imports
import { MDBox } from "/components";

// Custom styles for the SidenavItem
import { item, itemContent, itemArrow } from "./styles/sidenavItem";

// Context Imports
import { useMaterialUIController } from "/context";
import { collapseIcon, collapseIconBox } from "./styles/sidenavCollapse";

const SidenavItem = ({
  color,
  name,
  active,
  icon,
  nested,
  children,
  open,
  ...rest
}) => {
  const [{ miniSidenav, transparentSidenav, whiteSidenav, darkMode }] =
    useMaterialUIController();

  return (
    <>
      <ListItem
        {...rest}
        component="li"
        sx={(theme) =>
          item(theme, {
            active,
            color,
            transparentSidenav,
            whiteSidenav,
            darkMode,
          })
        }
      >
        <ListItemIcon
          sx={(theme) =>
            collapseIconBox(theme, {
              transparentSidenav,
              whiteSidenav,
              darkMode,
              gridOrientation: 'horizontal'
            })
          }
        >
          <>
          {/* <Icon fontSize="3px">circleicon</Icon> */}

            {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>
                {icon}
              </Icon>
            ) : (
              icon
            )}
          </>
        </ListItemIcon>
        <MDBox
          sx={(theme) =>
            itemContent(theme, {
              active,
              miniSidenav,
              name,
              open,
              nested,
              transparentSidenav,
              whiteSidenav,
              darkMode,
            })
          }
        >
          <ListItemText primary={name} />

          {/* This will show dropdown icons in the sidebar
            - commented because I don't need them in this project for now 
            - If you need them in the future, uncomment them
            */}
          {/* {children && (
            <Icon
              component="i"
              sx={(theme) =>
                itemArrow(theme, {
                  open,
                  miniSidenav,
                  transparentSidenav,
                  whiteSidenav,
                  darkMode,
                })
              }
            >
              expand_less
            </Icon>
          )} */}
        </MDBox>
      </ListItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit {...rest}>
          {children}
        </Collapse>
      )}
    </>
  );
};

// Setting default values for the props of SidenavItem
SidenavItem.defaultProps = {
  color: "dark",
  active: false,
  nested: false,
  children: false,
  open: false,
};

// Typechecking props for the SidenavItem
SidenavItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  name: PropTypes.string.isRequired,
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  nested: PropTypes.bool,
  children: PropTypes.node,
  open: PropTypes.bool,
};

export default SidenavItem;
