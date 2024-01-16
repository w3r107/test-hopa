// External Package Imports
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

// MUI Imports
import { Grid } from "@mui/material";

// Local Component Imports
import { MDBox } from "/components";

// Local Imports
import Navbar from "./Navbar";

// Examples
import PageLayout from "/examples/LayoutContainers/PageLayout";

// Routes
import { useRoutes } from "/hooks";

// Context Imports
import { setLanguage, useMaterialUIController } from "context";

function CoverLayout({ coverHeight, image, children }) {
  const { i18n } = useTranslation();
  const [controller, dispatch] = useMaterialUIController();
  const { language: languageDetectors } = controller;

  const { t } = useTranslation();

  const langaugeToggle = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(dispatch, lang);
    Cookies.set("i18next", lang, { expires: 1000 });
  };

  const pageRoutes = useRoutes();

  const title = t("HOPATITLE");
  return (
    <PageLayout>
      <Navbar
        routes={pageRoutes}
        action={{
          type: "external",
          route:
            "https://creative-tim.com/product/nextjs-material-dashboard-pro",
          label: "buy now",
        }}
        transparent
        brand={title}
        light
      />

      <MDBox
        width="calc(100% - 2rem)"
        minHeight={coverHeight}
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        pb={28}
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.4),
              rgba(gradients.dark.state, 0.4)
            )}, url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox
        mt={{ xs: -20, lg: -18 }}
        px={1}
        width="calc(100% - 2rem)"
        mx="auto"
      >
        <Grid container spacing={0} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={4}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      <div
        style={{
          margin: "2px",
          position: "fixed",
          bottom: 10,
          right: "30px",
        }}
      >
        <select
          onChange={(e) => langaugeToggle(e.target.value)}
          value={languageDetectors}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "0px",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 42%)",
            bottom: 2,
            height: "30px",
            width: "70px",
            cursor: "pointer",
          }}
        >
          <option value="he">🇮🇱&emsp;</option>
          <option value="en">🇺🇸&emsp;</option>
          <option value="ru">🇷🇺&emsp;</option>
          <option value="ar">🇦🇪&emsp;</option>
          <option value="es">🇪🇸&emsp;</option>
        </select>
      </div>
      <div style={{ width: "100%", height: "25px" }}></div>
    </PageLayout>
  );
}

CoverLayout.defaultProps = {
  coverHeight: "35vh",
};

CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
