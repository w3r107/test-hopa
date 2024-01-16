// React Imports
import { useEffect, useState } from "react";

// Next Imports
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

// External Page Imports
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// MUI Imports
import { List, Divider, Box, Icon } from "@mui/material/";
import NextLink from "@mui/material/Link";

// Local Component Imports
import { MDBox, MDTypography } from "/components";

// Local Components for the current Component only
import SidenavCollapse from "./SidenavCollapse";
import SidenavList from "./SidenavList";
import SidenavItem from "./SidenavItem";

// Custom styles for the Sidenav
import SidenavRoot from "./SidenavRoot";
import sidenavLogoLabel from "./styles/sidenav";

// Local Routes Hook
import { useRoutes } from "/hooks";

// Context Imports
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "/context";

const Sidenav = ({ color, brand, brandName, ...rest }) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openNestedCollapse, setOpenNestedCollapse] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const { pathname } = useRouter();
  const collapseName = pathname.split("/").slice(1)[0];
  const items = pathname.split("/").slice(1);
  const itemParentName = items[1];
  const itemName = items[items.length - 1];

  // Get Routes
  const routes = useRoutes();

  const { t } = useTranslation();

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  const handleCollapseClick = (key) => {
    setOpenCollapse(openCollapse === key ? null : key);
  };
  

  useEffect(() => {
    // setOpenCollapse(collapseName);
    setOpenNestedCollapse(itemParentName);
  }, [collapseName, itemParentName]);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : transparentSidenav
      );
      setWhiteSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : whiteSidenav
      );
    }
    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, transparentSidenav, whiteSidenav]);

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse) => {
    const template = collapse.map(({ name, route, key, href }) =>
      href ? (
        <NextLink
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavItem name={t(name)} nested />
        </NextLink>
      ) : (
        <Link href={route} key={key} sx={{ textDecoration: "none" }}>
          <a>
            <SidenavItem name={t(name)} active={route === pathname} nested />
          </a>
        </Link>
      )
    );

    return template;
  };
  // Render the all the collpases from the routes.js
  const renderCollapse = (collapses) =>
    collapses.map(({ name, collapse,icon, route, href, key }) => {

      let returnValue;
      if (collapse) {
        returnValue = (
          <SidenavItem
            key={key}
            color={color}
            name={t(name)}
            icon={icon}
            active={key === itemParentName ? "isParent" : false}
            open={openNestedCollapse === key}
            onClick={({ currentTarget }) =>
              openNestedCollapse === key &&
                currentTarget.classList.contains("MuiListItem-root")
                ? setOpenNestedCollapse(false)
                : setOpenNestedCollapse(key)
            }
          >
            {renderNestedCollapse(collapse)}
          </SidenavItem>
        );
      } else {
        returnValue = href ? (
          <NextLink
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavItem icon={icon} color={color} name={t(name)} active={key === itemName} />
          </NextLink>
        ) : (
          <Link href={route} key={key} sx={{ textDecoration: "none" }}>
            <a>
              <SidenavItem
                color={color}
                name={t(name)}
                icon={icon}
                active={key === itemName}
              />
            </a>
          </Link>
        );
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>;
    });

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    (
      {
        type,
        name,
        icon,
        title,
        collapse,
        noCollapse,
        key,
        href,
        route,
        hasRedirect,
      },
      index
    ) => {
      let returnValue;

      name = t(name);

      if (type === "collapse") {
        if (href) {
          returnValue = (
            <NextLink
              // href={href}
              href={route}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                key={key}
                name={name}
                icon={icon}
                active={key === collapseName}
                open={openCollapse === key}
                onClick={() => handleCollapseClick(key)}

              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </NextLink>
          );
        } else if (noCollapse && route) {
          returnValue = hasRedirect ? (
            <a href={route} target="_blank" key={index}>
              <SidenavCollapse
                name={name}
                icon={icon}
                noCollapse={noCollapse}
                active={key === collapseName}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </a>
          ) : (
            <Link href={route} key={key} passHref>
              <a>
                <SidenavCollapse
                  name={name}
                  icon={icon}
                  noCollapse={noCollapse}
                  active={key === collapseName}
                >
                  {collapse ? renderCollapse(collapse) : null}
                </SidenavCollapse>
              </a>
            </Link>
          );
        } else {
          returnValue = (
            <SidenavCollapse
              key={key}
              name={name}
              icon={icon}
              active={key === collapseName}
              open={openCollapse === key}
              onClick={() => handleCollapseClick(key)}

            >
              {collapse ? renderCollapse(collapse) : null}
            </SidenavCollapse>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <Box>
          <a>
            <MDBox display="flex" alignItems="center">
              {brand && brand.src ? (
                <MDBox
                  component="img"
                  src={brand.src}
                  alt={brandName}
                  width="1.75rem"
                />
              ) : (
                brand
              )}
              <MDBox
                width={!brandName && "100%"}
                sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
              >
                <MDTypography
                  component="h6"
                  variant="button"
                  fontWeight="medium"
                  color={textColor}
                >
                  {brandName}
                </MDTypography>
              </MDBox>
            </MDBox>
          </a>
        </Box>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
};

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "dark",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  brand: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  brandName: PropTypes.string.isRequired,
};

export default Sidenav;
