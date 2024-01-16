import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@mui/material";
import { MDSnackbar, Header, MDBox } from "/components";


import { Loader, MDTypography } from "components";

import DashboardLayout from "/layouts/DashboardLayout";
import GalleryView from "/components/library/GalleryView";
import { useLibrary } from "store/library/library.slice";
import { getAllImages } from "store/library/library.action";
import { useDispatch } from "react-redux";
import { getRestaurantId } from "utils/getRestuarantId";

const Library = () => {
  const { t: translate } = useTranslation();

  const [libraryImages, setLibraryImages] = useState([]);
  const [loaderMessage, setLoaderMessage] = useState("Loading Images...");

  const [snackbarProps, setSnackbarProps] = useState({
    success: false,
    message: "",
    visible: false,
  });

  const dispatch = useDispatch();
  const { isLoading, loaded, images: libImages } = useLibrary();

  useEffect(() => {
    if (!loaded) {
      dispatch(getAllImages({
        restaurantId: getRestaurantId()
      }))
    }
  }, [dispatch, loaded]);

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
      {
        isLoading && <Loader message={loaderMessage} />
      }
      <DashboardLayout>
        <Header />
        <Card
          id="basic-info"
          sx={{
            overflow: "visible",
          }}
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          <MDBox pb={3}>
            <MDBox p={2}>
              <MDTypography m={2} variant="h5">
                {translate("LIBRARY.MY_UPLOADS")}
              </MDTypography>
              <GalleryView images={libImages} />
              {libImages?.length === 0 && (
                <div
                  style={{
                    height: "100px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {translate("LIBRARY.NO_UPLOADS")}
                </div>
              )}
            </MDBox>
          </MDBox>

          <MDBox pb={3}>
            <MDBox p={2}>
              <MDTypography m={2} variant="h5">
                {translate("LIBRARY.APP_GALLERY")}
              </MDTypography>
              <GalleryView images={libraryImages} />
            </MDBox>
          </MDBox>
        </Card>
      </DashboardLayout>
    </>
  );
};

Library.auth = true;

export default Library;
