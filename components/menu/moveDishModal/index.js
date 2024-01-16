import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import MDBox from 'components/elements/MDBox';
import MDTypography from 'components/elements/MDTypography';
import DishParentCategoryDropdown from '../dishParentCategoryDropdown.js';
import DishCategoryDropdown from '../dishCategoryDropdown';
import MDButton from 'components/elements/MDButton/index.js';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const MoveDishModal = ({ open, onClose, onSubmit }) => {
    const { t: translate } = useTranslation();

    const [data, setData] = useState({
        fromParentCategory: "",
        fromCategory: "",
        toParentCategory: "",
        toCategory: ""
    })

    const setDataVal = (key, val) => {
        setData(prev => ({
            ...prev,
            [key]: val
        }))
    }

    return (
        <BootstrapDialog
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            fullWidth
            maxWidth={"lg"}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
                {translate("MOVE_DISHES")}
            </BootstrapDialogTitle>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit(data)
                }}
            >
                <DialogContent dividers>
                    <Card
                        id="basic-info"
                        sx={{
                            overflow: "visible",
                        }}
                    >

                        <MDBox p={2}>
                            <MDTypography variant="h5">
                                {translate("EDITMODAL.FROM_PARENT_CATEGORY")}
                            </MDTypography>
                        </MDBox>
                        <MDBox p={2}>
                            <DishParentCategoryDropdown
                                parentCategoryId={data?.fromParentCategory || ""}
                                onChange={(key, val) => setDataVal("fromParentCategory", val)}
                                onCategoryChange={() => setDataVal("fromCategory", "")}
                                label={translate("EDITMODAL.FROM_PARENT_CATEGORY")}
                            />
                        </MDBox>

                        <MDBox p={2}>
                            <MDTypography variant="h5">
                                {translate("EDITMODAL.FROM_CATEGORY")}
                            </MDTypography>
                        </MDBox>
                        <MDBox p={2}>
                            <DishCategoryDropdown
                                categoryId={data?.fromCategory || ""}
                                parentCategoryId={data?.fromParentCategory || ""}
                                onChange={(key, val) => setDataVal("fromCategory", val)}
                                label={translate("EDITMODAL.FROM_CATEGORY")}
                            />
                        </MDBox>

                        <MDBox p={2}>
                            <MDTypography variant="h5">
                                {translate("EDITMODAL.TO_PARENT_CATEGORY")}
                            </MDTypography>
                        </MDBox>
                        <MDBox p={2}>
                            <DishParentCategoryDropdown
                                parentCategoryId={data?.toParentCategory || ""}
                                onChange={(key, val) => setDataVal("toParentCategory", val)}
                                onCategoryChange={() => setDataVal("toCategory", "")}
                                label={translate("EDITMODAL.TO_PARENT_CATEGORY")}
                            />
                        </MDBox>

                        <MDBox p={2}>
                            <MDTypography variant="h5">
                                {translate("EDITMODAL.TO_CATEGORY")}
                            </MDTypography>
                        </MDBox>
                        <MDBox p={2}>
                            <DishCategoryDropdown
                                categoryId={data.toCategory}
                                parentCategoryId={data?.toParentCategory}
                                onChange={(key, val) => setDataVal("toCategory", val)}
                                label={translate("EDITMODAL.TO_CATEGORY")}
                            />
                        </MDBox>



                    </Card>
                </DialogContent>
                <DialogActions style={{ display: 'flex', justifyContent: 'flex-end', alignItems: "center" }}>
                    <MDButton
                        type="submit"
                        variant="gradient"
                        color="dark"
                        size="medium"
                    >
                        {translate("BUTTON.SAVE")}
                    </MDButton>
                </DialogActions>
            </form>
        </BootstrapDialog>
    )
}

export default MoveDishModal