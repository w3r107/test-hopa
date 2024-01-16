// React Imports
import { useEffect, useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// MUI Imports
import { Card } from "@mui/material";
import { GoDotFill } from "react-icons/go";

// Local Component Imports
import { MDAvatar, MDBox, MDTypography, MDButton, MDInput } from "/components";

// Util Imports
import { useRestaurant } from "store/restaurant/restaurant.slice";
import OrdersActivitySwitch from "./OrdersActivitySwitch";


const OrdersActions = () => {
    const { data: restaurantData } = useRestaurant();
    const { t: translate } = useTranslation();
    const [isOrdersActive, setOrdersActive] = useState(true);

    useEffect(()=>{
        setOrdersActive(restaurantData?.isOrdersActive !== "undefined" ? restaurantData?.isOrdersActive : true);
    },[restaurantData])
    // console.log(restaurantData)
    // console.log(isOrdersActive)

    return (
        <>
            <MDTypography sx={{ my: 1, ml: 1, mt: 2, fontSize: 17 }}>
                {translate("ORDERS.ACTIVITY_ACTION")}
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
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "justify-between",
                        flexWrap: "wrap",
                    }}
                >
                    <GoDotFill
                        color={isOrdersActive ? "green" : "red"}
                        style={{ fontSize: 'large' }}
                    />
                    <MDTypography sx={{ fontSize: 20 }}>
                        {isOrdersActive ? translate("ORDERS.ACTIVE") : translate("ORDERS.INACTIVE")}
                    </MDTypography>
                    <OrdersActivitySwitch
                        disabled={false}
                        isOrdersActive={isOrdersActive}
                        setOrdersActive={setOrdersActive}
                    />
                </MDBox>
            </Card>
        </>
    );
};

export default OrdersActions;
