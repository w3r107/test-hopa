import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Grid } from "@mui/material";
import { MDSnackbar, MDButton, Loader, Header, MDBox } from "/components";
import { useMaterialUIController } from "/context";
import { useDispatch } from "react-redux";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import { MDTypography } from "components";
import DashboardLayout from "/layouts/DashboardLayout";
import Image from "next/image";
import AddBadge from "components/badges/AddBadge";

import DeleteBadgeModal from "components/badges/DeleteBadge";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { getAllBadges } from "store/badge/badge.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { useBadge } from "store/badge/badge.slice";

const Badges = () => {
    const { t: translate } = useTranslation();

    const [{ language }] = useMaterialUIController();
    const [loaderMessage, setLoaderMessage] = useState("Loading Badges...");

    const [badgeModalOpened, setBadgeModalOpened] = useState("");

    const [selectedBadge, setSelectedBadge] = useState();
    const [snackbarProps, setSnackbarProps] = useState({
        success: false,
        message: "",
        visible: false,
    });

    const [isDeleteBadgeModalOpen, setIsDeleteBadgeModalOpen] = useState(false);

    const showSnackbar = (success, message) => {
        setSnackbarProps({ ...snackbarProps, success, message, visible: true });
    };

    const dispatch = useDispatch();
    const { isLoading, loaded, badges } = useBadge();

    useEffect(() => {
        if (!loaded) {
            dispatch(getAllBadges({ restaurantId: getRestaurantId() }));
        }
    }, [dispatch, loaded]);



    const onClickEdit = (badge) => {
        setBadgeModalOpened("edit");
        setSelectedBadge({ ...badge });
    };

    const onClickDelete = (badge) => {
        setIsDeleteBadgeModalOpen(true);
        setSelectedBadge({ ...badge });
    };

    const onBadgeDeletePending = () => {
        setLoaderMessage(translate("BADGE.DELETING"));
    };

    const onBadgeDeleteFulfilled = () => {
        setLoaderMessage("");
        showSnackbar(true, translate("BADGE.DELETED"));
    };
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
            {isLoading && <Loader message={loaderMessage} />}
            <DashboardLayout>
                <Header />
                <Card
                    id="basic-info"
                    sx={{
                        overflow: "visible",
                    }}
                    style={{ minHeight: "calc(100vh - 120px)" }}
                >
                    <MDBox pb={3} p={2}>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <MDTypography my={2} ml={1} variant="h5">
                                {translate("BADGES.BADGE_LIST")}
                            </MDTypography>
                            <MDButton
                                style={{ width: "10%", alignSelf: "center", marginBottom: 10 }}
                                variant="gradient"
                                color="dark"
                                size="small"
                                disabled={!loaded}
                                onClick={() => setBadgeModalOpened("add")}
                            >
                                {translate("BADGES.ADD_BADGE")}
                            </MDButton>
                        </div>
                        <Grid container spacing={1} pt={4} mb={4}>
                            {badges?.map((item, index) => (
                                <Grid key={index} item xs={6} sm={1}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "100%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            position: "relative",
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: -10,
                                                right: 0,
                                                zIndex: "20",
                                            }}
                                        >
                                            <EditIcon
                                                fontSize={"medium"}
                                                style={{ color: "black" }}
                                                onClick={() => onClickEdit(item)}
                                            />
                                            <DeleteIcon
                                                fontSize={"medium"}
                                                style={{ color: "black" }}
                                                onClick={() => onClickDelete(item)}
                                            />
                                        </div>

                                        <Image
                                            alt="icon"
                                            src={item?.image}
                                            width="100%"
                                            height="100%"
                                            className="rounded-image"
                                        />
                                        <h4 style={{ textAlign: "center", paddingTop: "0.2rem" }}>
                                            {item?.name[language]}
                                        </h4>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                        {(!badges || badges?.length === 0) && (
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "200px",
                                }}
                            >
                                {translate("BADGES.NO_BADGES")}
                            </div>
                        )}
                    </MDBox>
                </Card>
                <AddBadge
                    isOpen={badgeModalOpened === "add" || badgeModalOpened === "edit"}
                    formType={badgeModalOpened}
                    setOpen={setBadgeModalOpened}
                    setLoader={setLoaderMessage}
                    formData={selectedBadge}
                    showSnackbar={showSnackbar}
                />
                <DeleteBadgeModal
                    isOpen={isDeleteBadgeModalOpen}
                    handleClose={() => setIsDeleteBadgeModalOpen(false)}
                    selectedBadge={selectedBadge}
                    onInit={onBadgeDeletePending}
                    onComplete={onBadgeDeleteFulfilled}
                    showSnackbar={showSnackbar}
                />
            </DashboardLayout>
        </>
    );
};

// Badges.auth = true;

export default Badges;
