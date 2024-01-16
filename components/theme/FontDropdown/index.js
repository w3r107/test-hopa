import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useMaterialUIController } from "context";
import { MDSnackbar } from "/components";

export default function FontDropdown({ fonts, onChange, label, value }) {
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });
  const [{ language }] = useMaterialUIController();

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
        id="country-select-demo"
        sx={{ width: "100%" }}
        options={fonts}
        autoHighlight
        onChange={(event, newValue) => {
          onChange("font", newValue);
        }}
        value={value}
        getOptionLabel={(option) => option.label || ""}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
          >
            <h4>{option?.label}</h4>
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
