// React Imports
import { useEffect, useState } from "react";

import { PiSpeakerSimpleXLight } from "react-icons/pi";
import { PiSpeakerSimpleHighLight } from "react-icons/pi";


// External Package Imports
import { useTranslation } from "react-i18next";

// MUI Imports
import { Card, Switch } from "@mui/material";

// Local Component Imports
import { MDBox, MDTypography } from "/components";
import MuteAlertsSwitch from "./MuteAlertsSwitch";

// Util Imports

const ServiceCallsActions = ({ alertSound, setAlertSound }) => {
    const { t: translate } = useTranslation();


    const handleAlertSoundChange = () => {
        setAlertSound(!alertSound)
    };

    return (
        <>
            <Card
                sx={{
                    width: "100%",
                    my: 1,

                    px: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <MDTypography sx={{ my: 1, ml: 1, mt: 2, fontSize: 35 }}>
                    {translate("SERVICE_CALLS.SERVICE_CALLS")}
                </MDTypography>
                <MDBox
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "justify-between",
                        flexWrap: "wrap",
                    }}
                >
                    {/*<MDTypography sx={{ fontSize: 20 }}>
                        {alertSound ? translate("SERVICE_CALLS.SOUND_ON") : translate("SERVICE_CALLS.SOUND_OFF")}
                    </MDTypography> */}
                    {/* <MuteAlertsSwitch
                        alertSound={alertSound}
                        setAlertSound={() => setAlertSound()}
                    /> */}


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
                        onClick={() => setAlertSound(!alertSound)}
                    >
                        <MDTypography sx={{ fontSize: 13, color: 'text.primary' }}>
                            {translate("SERVICE_CALLS.MUTE_ALERTS")}
                        </MDTypography>
                        <Switch checked={alertSound} onChange={() => setAlertSound(!alertSound)} />
                    </MDBox>



                    {alertSound ? <PiSpeakerSimpleHighLight style={{ marginInline: 5, fontSize: '50px' }} /> : <PiSpeakerSimpleXLight style={{ marginInline: 5, fontSize: '50px' }} />}

                </MDBox>
            </Card>
        </>
    );
};

export default ServiceCallsActions;
