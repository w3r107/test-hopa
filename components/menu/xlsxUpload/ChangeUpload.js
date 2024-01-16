// React Imports
import { useRef, useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// MUI Imports
import { Icon } from "@mui/material";

// Local Component Imports
import { MDButton } from "/components";

// Util Imports
import { URL } from "utils/axiosConfig";
import { getRestaurantId } from "utils/getRestuarantId";
import axios from "axios";
import { useChangesCtx } from "context/changesContext";
import { getCookie } from "utils/cookies";

// Redux Imports

const ChangesUpload = () => {
    const { showSnackbar, showLoader, setUploadStats } = useChangesCtx();


    const { t: translate } = useTranslation();

    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            showLoader(true, translate("LOADING.UPLOADING_CHANGES"))
            const fData = new FormData();
            fData.append("csvFile", file)
            fData.append("restaurantId", getRestaurantId())

            axios.post(`${URL}/bulk/uploadChanges`, fData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${getCookie("idToken")}`,
                }
            })
                .then((res) => {
                    const { data } = res.data;
                    showSnackbar(true, translate("TOAST.CHANGES_UPLOAD_SUCCESS"))
                    setUploadStats({
                        show: true,
                        data: data
                    })
                })
                .catch(() => {
                    showSnackbar(true, translate("TOAST.CHANGES_UPLOAD_FAILURE"))
                })
                .finally(() => {
                    showLoader(false)
                })

        }
    };

    return (
        <>
            <input
                hidden
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                onClick={(event) => {
                    event.target.value = null
                }}
            />
            <MDButton
                variant="gradient"
                color="light"
                size="medium"
                onClick={() => fileInputRef.current.click()}
                sx={{ m: 1, px: 1, textTransform: "none" }}
            >
                <Icon>upload</Icon>&nbsp;
                {translate("BUTTON.UPLOAD_CHANGES_XLSX")}
            </MDButton>
        </>
    );
};

export default ChangesUpload;
