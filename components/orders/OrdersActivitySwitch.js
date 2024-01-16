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


const OrdersActivitySwitch = ({ disabled, isOrdersActive, setOrdersActive }) => {
    const { t: translate } = useTranslation();
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);


    const handleOrderActivityChange = () => {
        setLoading(true);
        dispatch(updateRestaurantInfo({
            restaurantId: getRestaurantId(),
            data: {
                isOrdersActive: !isOrdersActive
            }
        }))
            .unwrap()
            .then(() => {
                setOrdersActive(!isOrdersActive)
            })
            .catch((err) => {
            })
            .finally(() => {
                setIsModalVisible(false)
                setLoading(false)
            })
    };

    return (
        (
            <>
                <AdminCodeModal
                    isOpen={isModalVisible}
                    handleClose={() => setIsModalVisible(false)}
                    title={translate(`ORDERS.CHANGE_ACTIVITY_TO_${!isOrdersActive}`)}
                    onActionBtnClick={handleOrderActivityChange}
                />
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
                            background: disabled ? "rgba(0,0,0,0)" : "#fafafa",
                        },
                        pointerEvents: disabled ? 'none' : 'auto', // Disable pointer events when disabled
                        opacity: disabled ? 0.5 : 1, // Reduce opacity when disabled
                    }}
                    onClick={() => !disabled && setIsModalVisible(true)}
                >
                    <MDTypography sx={{ fontSize: 13, color: disabled ? 'text.secondary' : 'text.primary' }}>
                        {translate("ORDERS.UPDATE_ORDERS_ACTIVITY")}
                    </MDTypography>
                    {isLoading && <Loader />}
                    <Switch checked={isOrdersActive} onChange={() => !disabled && setIsModalVisible(true)} disabled={disabled} />
                </MDBox>
            </>
        )
    );
};

export default OrdersActivitySwitch;
