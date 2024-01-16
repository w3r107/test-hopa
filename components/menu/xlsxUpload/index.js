// React Imports
import { useRef, useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// MUI Imports
import { Icon } from "@mui/material";

// Local Component Imports
import { MDButton } from "/components";

// Util Imports
import Loader from "components/elements/Loader";
import { URL } from "utils/axiosConfig";
import { getRestaurantId } from "utils/getRestuarantId";
import axios from "axios";
import { getCookie } from "utils/cookies";
import { useMenuCtx } from "context/menuContext";

// Redux Imports

const XLSXUpload = () => {
    const [uploadingMenu, setUploadingMenu] = useState(false);

    const { t: translate } = useTranslation();

    const { showSnackbar, setUploadStats } = useMenuCtx();

    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setUploadingMenu(true)
            const fData = new FormData();

            fData.append("csvFile", file)
            fData.append("restaurantId", getRestaurantId())
            axios.post(`${URL}/bulk/uploadMenu`, fData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${getCookie("idToken")}`,
                }
            })
                .then((res) => {
                    const { data } = res.data;
                    setUploadStats({
                        show: true,
                        data: data
                    })
                    showSnackbar(true, translate("MENU_UPLOAD_SUCCESS"))
                })
                .catch(() => {
                    showSnackbar(false, translate("MENU_UPLOAD_FAILURE"))
                })
                .finally(() => {
                    setUploadingMenu(false)
                })
        }
    };
    return (
        <>
            {uploadingMenu && <Loader message={translate("UPLOAD_RESTAURANT_MENU")} />}
            <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                onClick={(event) => {
                    event.target.value = null
                }}
                hidden
            />
            <MDButton
                variant="gradient"
                color="light"
                size="medium"
                onClick={() => fileInputRef.current.click()}
                sx={{ m: 1, px: 1, textTransform: "none" }}
            >
                <Icon>upload</Icon>&nbsp;
                {translate("BUTTON.UPLOAD_XLSX_FILE")}
            </MDButton>
        </>
    );
};

export default XLSXUpload;
