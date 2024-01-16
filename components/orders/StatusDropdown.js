import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useMaterialUIController } from "context";
import { MDSnackbar } from "/components";

export default function StatusDropdown({ options, label, value, onChange }) {
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });

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
        sx={{ width: "200px" }}
        options={options}
        disableClearable
        autoHighlight
        onChange={(_, newValue) => {
          onChange(newValue)
        }}
        isOptionEqualToValue={(op, val) => String(op.value).toLowerCase() === String(val.value).toLowerCase()}
        value={value}
        getOptionLabel={(option) => option?.value || ""}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <h4>{option?.value}</h4>
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
