import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useMaterialUIController } from "context";
import { MDSnackbar } from "/components";
import { useTranslation } from "react-i18next";
// import { TextField as MuiTextField } from "@material-ui/core";

// import { TextField } from "formik-material-ui";
export default function ChangesDropdown({ changes, onChange, label, value }) {
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
        id="country-select-demo-detd"
        sx={{ width: "100%" }}
        options={changes}
        autoHighlight
        onChange={(event, newValue) => {
          if (newValue.length >= 4) {
            setSnackbarProps({
              success: false,
              message: translate("EDITMODAL.MAX_LIMIT_FOR_BADGES"),
              visible: true,
            });
          } else {
            onChange("changes", newValue);
          }
        }}
        value={value.length === undefined || value.length < 0 ? [] : value}
        // value={undefined}
        getOptionLabel={(option) => option?.title[language]}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <h4>{option?.title[language]}</h4>
          </Box>
        )}
        isOptionEqualToValue={(op, va) => op?.id === va?.id}
        renderInput={(params) => (
          // <MuiTextField {...params} label="All Users" fullWidth />

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
