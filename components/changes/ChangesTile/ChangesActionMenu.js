// External Package Imports
import { useTranslation } from "react-i18next";

// MUI Imports
import { Card, Icon } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography, MDButton } from "/components";

import { useMenuCtx } from "context/menuContext";
import { getRestaurantId } from "utils/getRestuarantId";
import { axiosDelete, axiosPost } from "utils/axiosConfig";
import ChangesUpload from "components/menu/xlsxUpload/ChangeUpload";
import Cookies from "js-cookie";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { useChangesCtx } from "context/changesContext";
import DeleteAlLChangesModal from "../deleteAllChangesModal";
import { useState } from "react";

const ChangesActionMenu = () => {
    const { t: translate } = useTranslation();

    const { showLoader, showSnackbar } = useChangesCtx();
    const { data: restaurantData } = useRestaurant();
    const language = Cookies.get("i18next") || "he";

    const [deleteAllChangesModal, setDeleteAllChangesModal] = useState(false)


    // Downloading the menu in XSLX Format
    const downloadXLSX = () => {
        showLoader(true, translate("LOADING.DOWNLOADING_CHANGES"))
        axiosPost(`bulk/downloadChanges`, {
            restaurantId: getRestaurantId()
        })
            .then((response) => {
                const text = response.data; // Assuming response.data is a string containing CSV data

                // Create a Blob with UTF-8 encoding and a BOM
                const utf8EncodedText = new TextEncoder().encode('\uFEFF' + text); // \uFEFF is the BOM for UTF-8

                const blob = new Blob([utf8EncodedText], { type: 'text/csv; charset=UTF-8' });

                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `Changes-${restaurantData?.id}-${Date.now()}.csv`;
                document.body.appendChild(a);
                a.click();

                // Clean up by revoking the URL object
                window.URL.revokeObjectURL(url);
                showSnackbar(true, translate("TOAST.CHANGES_DOWNLOAD_SUCCESS"))
            })
            .catch((e) => {
                showSnackbar(false, translate("TOAST.CHANGES_DOWNLOAD_FAILURE"))
            })
            .finally(() => {
                showLoader(false)
            })
    };

    // Download the Menu Template in XLSX Format
    const downloadTemplate = () => {
        axiosPost(`bulk/changesTemplate`, {
            restaurantId: getRestaurantId()
        })
            .then((response) => {
                const blob = new Blob([response.data], { type: 'text/csv' }); // Specify 'text/csv' as the MIME type for CSV files
                const url = window.URL.createObjectURL(blob);

                // Create a link element to trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = `ChangesTemplate-${restaurantData?.id}}-${Date.now()}.csv`;
                document.body.appendChild(a);
                a.click();

                // Clean up by revoking the URL object
                window.URL.revokeObjectURL(url);
            })
            .catch((Err) => {
                console.log(Err);
            })
    };

    const deleteChanges = () => {
        const rId = getRestaurantId()
        showLoader(true, translate("LOADING.DELETING_ALL_CHANGES"))
        axiosDelete(`bulk/deleteChanges/${rId}`, {})
            .then((response) => {
                showSnackbar(true, translate("TOAST.ALL_CHANGES_DELETE_SUCCESS"))
                setDeleteAllChangesModal(false)
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            })
            .catch((err) => {
                setDeleteAllChangesModal(false)
                showSnackbar(false, translate("TOAST.ALL_CHANGES_DELETE_FAILURE"))
            })
            .finally(() => {
                showLoader(false)
            })
    };


    return (
        <>
            <DeleteAlLChangesModal
                handleClose={() => setDeleteAllChangesModal(false)}
                isOpen={deleteAllChangesModal}
                onDeleleteDish={deleteChanges}
            />

            <MDTypography sx={{ my: 1, ml: 1, mt: 2, fontSize: 17 }}>
                {translate("CHANGES.CHANGES_ACTION")}
            </MDTypography>
            <Card
                sx={{
                    width: "100%",
                    my: 1,
                    py: 2,
                    px: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <MDBox
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <MDBox
                        sx={{
                            width: "100%",
                        }}
                    >
                        <ChangesUpload />

                        <MDButton
                            variant="gradient"
                            color="light"
                            size="medium"
                            onClick={downloadXLSX}
                            sx={{ m: 1, px: 1, textTransform: "none" }}
                        >
                            <Icon>download</Icon>&nbsp;
                            {translate("BUTTON.DOWNLOAD_CHANGES_FILE")}
                        </MDButton>

                        <MDButton
                            variant="gradient"
                            color="light"
                            size="medium"
                            onClick={downloadTemplate}
                            sx={{ m: 1, px: 1, textTransform: "none" }}
                        >
                            <Icon>download</Icon>&nbsp;
                            {translate("BUTTON.DOWNLOAD_TEMPLATE")}
                        </MDButton>
                        <MDButton
                            variant="outlined"
                            color="error"
                            size="medium"
                            onClick={() => setDeleteAllChangesModal(true)}
                            sx={{ m: 1, px: 1, textTransform: "none" }}
                        >
                            <Icon>delete</Icon>&nbsp;
                            {translate("BUTTON.DELETE_CHANGES")}
                        </MDButton>
                    </MDBox>

                </MDBox>
            </Card>
        </>
    );
};

export default ChangesActionMenu;
