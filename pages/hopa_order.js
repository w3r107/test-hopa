import { Backdrop, Card, Checkbox, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { Header, MDBox, MDSnackbar, MDTypography } from 'components';
import TimeInput from 'components/elements/TimeInput';
import { ErrorMessage } from 'formik';
import DashboardLayout from 'layouts/DashboardLayout';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRestaurant } from 'store/restaurant/restaurant.slice';


const allDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const hopaOrder = () => {

    const [snackbarProps, setSnackbarProps] = useState({
        success: false,
        message: "",
        visible: false,
    });

    const { t: translate } = useTranslation();
    const dispatch = useDispatch();

    const { data: restaurantData, isLoading } = useRestaurant();

    const showSnackbar = (success, message) => {
        setSnackbarProps({ ...snackbarProps, success, message, visible: true });
    };

    const [orderOption, setOrderOption] = useState(["SelectTable"])
    const [days, setDays] = useState([]);
    const [timerange, setTimeRange] = useState({});

    useEffect(()=>{
        setDays([
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]);
        setTimeRange({
            Sunday: {
              start: "00:00",
              end: "00:00",
            },
            Monday: {
              start: "00:00",
              end: "00:00",
            },
            Tuesday: {
              start: "00:00",
              end: "00:00",
            },
            Wednesday: {
              start: "00:00",
              end: "00:00",
            },
            Thursday: {
              start: "00:00",
              end: "00:00",
            },
            Friday: {
              start: "00:00",
              end: "00:00",
            },
            Saturday: {
              start: "00:00",
              end: "00:00",
            }
        })
    },[])

    const handleDayChange = (day) => {
        if (days.includes(day)) {
            const filterDay = days.filter((vDay) => day !== vDay);
            setDays(filterDay);
        } else {
            setDays((prev) => [...prev, day]);
        }
    };

    const handleTimeChange = (day, type, value) => {
        let newValue = value;

        if (!day || day === "") return;

        let start = timerange[day]?.start || "00:00";
        let end = timerange[day]?.end || "00:00";

        if (type === "startHour" || type === "endHour") {
            // If the hour is being changed, use the current value of the minute input
            const minuteValue =
                type === "startHour" ? start.split(":")[1] : end.split(":")[1];
            newValue = value + ":" + (minuteValue || "");
        } else if (type === "startMinute" || type === "endMinute") {
            // If the minute is being changed, use the current value of the hour input
            const hourValue =
                type === "startMinute" ? start.split(":")[0] : end.split(":")[0];
            newValue = (hourValue || "") + ":" + value;
        }

        setTimeRange((prev) => {
            return {
                ...prev,
                [day]: {
                    ...prev[day],
                    [type.includes("start") ? "start" : "end"]: newValue,
                },
            };
        });
    };

    const handleOrderOption = (op) => {
        setOrderOption((prev) => {
            if (prev.includes(op)) {
                if (prev.length === 1) return prev;
                return prev.filter((opts) => opts !== op);
            }
            return [...prev, op];
        })
    }


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
            <DashboardLayout>
                <Header />
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <MDBox pb={3}>
                    <Card style={{ minHeight: "calc(100vh - 120px)" }}>
                        <MDBox p={2}>
                            <MDBox p={2}>
                                <MDTypography variant="h5">
                                    {translate("HOPA_ORDER.ORDER_PLACE_OPTIONS")}
                                </MDTypography>
                                <Grid item xs={12}>
                                    <MDTypography variant="subtitle2" fontSize="small">
                                        {translate("EDITMODAL.ORDER_PLACE_OPTIONS_INDICATION")}
                                    </MDTypography>
                                </Grid>
                            </MDBox>

                            <MDBox
                                p={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1
                                }}>
                                <MDBox sx={{
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    <Checkbox
                                        checked={orderOption.includes("SelectTable")}
                                        id='selectTable'
                                        onChange={() => handleOrderOption("SelectTable")}
                                    />
                                    <label htmlFor='selectTable'>
                                        {translate("HOPA_ORDER.SELECT_TABLE")}
                                    </label>
                                </MDBox>
                                <MDBox sx={{
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    <Checkbox
                                        checked={orderOption.includes("TakeAway")}
                                        id='takeAway'
                                        onChange={() => handleOrderOption("TakeAway")}
                                    />
                                    <label htmlFor={"takeAway"}>
                                        {translate("HOPA_ORDER.TAKE_AWAY")}
                                    </label>
                                </MDBox>
                                <MDBox sx={{
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    <Checkbox
                                        checked={orderOption.includes("Delivery")}
                                        id='delivery'
                                        onChange={() => handleOrderOption("Delivery")}
                                    />
                                    <label htmlFor={"delivery"}>
                                        {translate("HOPA_ORDER.DELIVERY")}
                                    </label>
                                </MDBox>
                            </MDBox>

                            <MDBox p={2}>
                                <MDTypography variant="h5">
                                    {translate("HOPA_ORDER.ORDER_PLACED_MESSAGE")}
                                </MDTypography>
                                <Grid item xs={12} >
                                    <MDTypography variant="subtitle2" fontSize="small">
                                        {translate("EDITMODAL.ORDER_PLACED_INDICATION")}
                                    </MDTypography>

                                </Grid>
                            </MDBox>

                            <MDBox
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap",
                                }}
                            >
                                {Object.keys(restaurantData?.showLanguages || {})
                                    .filter(l => restaurantData?.showLanguages[l] === true || restaurantData?.showLanguages[l] === "he")
                                    .map((lang) => {
                                        return (
                                            <MDBox
                                                sx={{
                                                    width: { xs: "100%", md: "50%" },
                                                    py: { xs: 1 },
                                                    px: { xs: 0, md: 1 },
                                                }}
                                            >
                                                <TextField
                                                    type="text"
                                                    // onChange={handleChange("description.en")}
                                                    // onBlur={() => setFieldTouched("description.en")}
                                                    // value={values?.description?.en}
                                                    label={translate(`EDITMODAL.ORDER_PLACED_MSG_${String(lang).toUpperCase()}`)}
                                                    rows={4}
                                                    multiline
                                                    fullWidth
                                                />
                                            </MDBox>
                                        )
                                    })}
                            </MDBox>

                            <MDBox p={2}>
                                <MDTypography variant="h5">
                                    {translate("HOPA_ORDER.ORDER_READY_MESSAGE")}
                                </MDTypography>
                                <Grid item xs={12}>
                                    <MDTypography variant="subtitle2" fontSize="small">
                                        {translate("EDITMODAL.ORDER_READY_INDICATION")}
                                    </MDTypography>
                                </Grid>
                                
                            </MDBox>

                            <MDBox
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap",
                                }}
                            >
                                {Object.keys(restaurantData?.showLanguages || {})
                                    .filter(l => restaurantData?.showLanguages[l] === true || restaurantData?.showLanguages[l] === "he")
                                    .map((lang) => {
                                        return (
                                            <MDBox
                                                sx={{
                                                    width: { xs: "100%", md: "50%" },
                                                    py: { xs: 1 },
                                                    px: { xs: 0, md: 1 },
                                                }}
                                            >
                                                <TextField
                                                    type="text"
                                                    // onChange={handleChange("description.en")}
                                                    // onBlur={() => setFieldTouched("description.en")}
                                                    // value={values?.description?.en}
                                                    label={translate(`EDITMODAL.ORDER_READY_MSG_${String(lang).toUpperCase()}`)}
                                                    rows={4}
                                                    multiline
                                                    fullWidth
                                                />
                                            </MDBox>
                                        )
                                    })}
                            </MDBox>
                        </MDBox>

                        <MDBox p={2}>
                            <MDTypography p={2} variant="h5">
                                {translate("HOPA_ORDER.OPENING_HOURS")}
                            </MDTypography>
                            <Grid item xs={12} px={2}>
                                <MDTypography variant="subtitle2" fontSize="small">
                                    {translate("EDITMODAL.OPENING_HOURS_INDICATION")}
                                </MDTypography>
                                <MDTypography variant="subtitle2" fontSize="small">
                                    {translate("EDITMODAL.OPENING_HOURS_DEFAULT")}
                                </MDTypography>
                                <MDTypography variant="subtitle2" fontSize="small">
                                    {translate("EDITMODAL.OPENING_HOURS_DAYS_INDICATION")}
                                </MDTypography>
                            </Grid>
                        </MDBox>

                        <MDBox p={2}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    alignItems: "flex-start",
                                }}
                            >
                                {allDays.map((day) => {
                                    return (
                                        <div
                                            key={day}
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "minmax(0, 170px) minmax(0, 1fr)",
                                                alignItems: "flex-start",
                                                padding: "10px 0",
                                            }}
                                        >
                                            <div
                                                key={day}
                                                style={{ display: "flex", alignItems: "center" }}
                                            >
                                                <Checkbox
                                                    checked={days.includes(day)}
                                                    onChange={() => handleDayChange(day)}
                                                />
                                                <MDBox p={2}>
                                                    <MDTypography variant="h6">
                                                        {translate(`DAYS.${day}`)}
                                                    </MDTypography>
                                                </MDBox>
                                            </div>
                                            {days.includes(day) && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-start",
                                                        justifyContent: "flex-start",
                                                        gap: "15px",
                                                        paddingTop: "8px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "grid",
                                                                gridTemplateColumns:
                                                                    "minmax(0, 95px) minmax(0, 1fr)",
                                                                alignItems: "flex-start",
                                                                marginLeft: "10px",
                                                                marginRight: "10px",
                                                            }}
                                                        >
                                                            <MDBox p={1}>
                                                                <MDTypography variant="p" sx={{ fontSize: "16px" }}>
                                                                    {translate("EDITMODAL.CATEGORY_TIME_START")}
                                                                </MDTypography>
                                                            </MDBox>
                                                            <TimeInput
                                                                hourValue={
                                                                    timerange[day]?.start?.split(":")[0] || "00"
                                                                }
                                                                minuteValue={
                                                                    timerange[day]?.start?.split(":")[1] || "00"
                                                                }
                                                                onChangeHour={(e) =>
                                                                    handleTimeChange(
                                                                        day,
                                                                        "startHour",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                onChangeMinute={(e) =>
                                                                    handleTimeChange(
                                                                        day,
                                                                        "startMinute",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>

                                                        <div
                                                            style={{
                                                                display: "grid",
                                                                gridTemplateColumns:
                                                                    "minmax(0, 85px) minmax(0, 1fr)",
                                                                alignItems: "flex-start",
                                                                marginLeft: "100px",
                                                                marginRight: "100px",
                                                            }}
                                                        >
                                                            <MDBox p={1}>
                                                                <MDTypography variant="p" sx={{ fontSize: "16px" }}>
                                                                    {translate("EDITMODAL.CATEGORY_TIME_END")}
                                                                </MDTypography>
                                                            </MDBox>
                                                            <TimeInput
                                                                hourValue={
                                                                    timerange[day]?.end?.split(":")[0] || "00"
                                                                }
                                                                minuteValue={
                                                                    timerange[day]?.end?.split(":")[1] || "00"
                                                                }
                                                                onChangeHour={(e) =>
                                                                    handleTimeChange(day, "endHour", e.target.value)
                                                                }
                                                                onChangeMinute={(e) =>
                                                                    handleTimeChange(
                                                                        day,
                                                                        "endMinute",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </MDBox>




                    </Card>
                </MDBox>
            </DashboardLayout >

        </>
    )
}

hopaOrder.auth = true;

export default hopaOrder