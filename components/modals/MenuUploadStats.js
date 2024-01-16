import React from 'react'

import { Box, Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { useMenuCtx } from 'context/menuContext';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = ({ children, onClose, ...other }) => {

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
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
        </DialogTitle>
    );
};

const MenuUploadStats = () => {

    const { t: translate } = useTranslation();
    const { uploadStats: { show, data } } = useMenuCtx()


    return (
        <BootstrapDialog
            open={show}
            onClose={() => location.reload()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            fullWidth
            maxWidth={"lg"}
        >
            <BootstrapDialogTitle
                onClose={() => location.reload()}
            >
                {translate("MENU.UPLOAD_STATS")}
            </BootstrapDialogTitle>

            <Box
                sx={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: "1fr 1fr",
                    padding: "20px"
                }}
            >
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}>
                    <Typography fontSize={16}>
                        {translate("TOTAL_DISHES_ADDED")}: {data?.totalDishAdded || 0}
                    </Typography>
                    <Typography fontSize={16}>
                        {translate("TOTAL_CATEGORY_ADDED")}: {data?.totalCategoryAdded || 0}
                    </Typography>
                    <Typography fontSize={16}>
                        {translate("TOTAL_PARENT_CATEGORY_ADDED")}: {data?.totalParentCategoryAdded || 0}
                    </Typography>
                    <Typography fontSize={16}>
                        {translate("TOTAL_ROW_SKIPPED")}: {data?.totalSkips || 0}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        maxHeight: "50vh",
                        overflowY: "auto",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >
                    {
                        data?.ignoredRows &&
                        data?.ignoredRows.map((ir) => {
                            return (
                                <Box sx={{
                                    boxShadow: 1,
                                    padding: "5px",
                                    borderRadius: 1
                                }}>
                                    <Typography fontSize={14}>
                                        {translate("PROBLEM")}: {translate(ir?.reason)}
                                    </Typography>
                                    <Typography fontSize={14}>
                                        {translate("ROW")}: {translate(ir?.row)}
                                    </Typography>

                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
        </BootstrapDialog>
    )
}

export default MenuUploadStats