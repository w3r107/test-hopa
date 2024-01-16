// React Imports
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
// MUI Imports
import { Switch } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography } from "/components";
import { updateRestaurantInfo } from "store/restaurant/restaurant.slice";
import { getRestaurantId } from "utils/getRestuarantId";
import { useDispatch } from "react-redux";
import AdminCodeModal from "components/elements/AdminCodeModal";
import { useMenuCtx } from "context/menuContext";
import Loader from "components/elements/Loader";


const MuteAlertsSwitch = ({ alertSound, setAlertSound }) => {
    const { t: translate } = useTranslation();

    const handleAlertSoundChange = () => {
        setAlertSound(!alertSound)
    };

    return (
        (
            <>
                <MDBox
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 1,
                        py: 0.5,
                        mx: 0.5,
                        my: 1,
                        borderRadius: 2,
                        transition: "0.25s all ease-in-out",
                        cursor: "pointer",
                        background: "white",
                        minWidth: "230px",
                        background: "rgba(0,0,0,0)",
                        "&:hover": {
                            background: alertSound ? "rgba(0,0,0,0)" : "#fafafa",
                        },
                        // opacity: alertSound ? 0.5 : 1, // Reduce opacity when disabled
                    }}
                    onClick={handleAlertSoundChange}
                >
                    <MDTypography sx={{ fontSize: 13, color: 'text.primary' }}>
                        {translate("SERVICE_CALLS.MUTE_ALERTS")}
                    </MDTypography>
                    <Switch checked={alertSound} onChange={handleAlertSoundChange} />
                </MDBox>
            </>
        )
    );
};

export default MuteAlertsSwitch;
