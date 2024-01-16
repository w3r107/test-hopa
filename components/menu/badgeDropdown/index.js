import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useMaterialUIController } from "context";
import { MDSnackbar } from "/components";
import { useTranslation } from "react-i18next";

export default function BadgeDropdown({ badges, onChange, label, value }) {
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });
  const [{ language }] = useMaterialUIController();
  const { t: translate } = useTranslation();

  return (
    <>
      <MDSnackbar
        icon="notifications"
        title="Hopa-Menu"
        content={snackbarProps.message}
        open={snackbarProps.visible}
        color={snackbarProps.success ? "success" : "error"}
        close={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        autoHideDuration={2000}
      />
      <Autocomplete
        multiple
        id="country-select-demo"
        sx={{ width: "100%" }}
        options={badges}
        autoHighlight
        onChange={(event, newValue) => {
          if (newValue.length >= 4) {
            setSnackbarProps({
              success: false,
              message: translate("EDITMODAL.MAX_LIMIT_FOR_BADGES"),
              visible: true,
            })
          } else {
            onChange("badges", newValue);
          }
        }}
        value={value}
        getOptionLabel={(option) => (value ? option?.name[language] : "")}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img
              loading="lazy"
              width="40"
              src={option?.image}
              alt=""
              style={{ borderRadius: "50%", objectFit: "contain" }}
            />
            <h4>{option?.name[language]}</h4>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />
    </>

  );
}
