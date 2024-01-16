import { Autocomplete, TextField } from "@mui/material";
import MDInput from "components/elements/MDInput";
import MDSnackbar from "components/elements/MDSnackbar";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const EnterOptionTypeDropDown = ({ setOptionTypeState, label, value }) => {
  const { t: translate } = useTranslation();
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });

  const optionTypeArray = [
    { label: translate("CHANGES.NONE"), value: 1 },
    { label: translate("CHANGES.LIGHT"), value: 2 },
    { label: translate("CHANGES.EXTRA"), value: 3 },
    { label: translate("CHANGES.WITH"), value: 4 },
    { label: translate("CHANGES.WITHOUT"), value: 5 },
    { label: translate("CHANGES.INSTEAD"), value: 6 },
    { label: translate("CHANGES.ONLY"), value: 7 },
    { label: translate("CHANGES.ON_THE_SIDE"), value: 8 },
  ];


  console.log(value);

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
        // multiple
        id="country-select-demo"
        options={optionTypeArray}
        value={value}
        onChange={(event, newValue) => {
          setOptionTypeState(newValue);
        }}
        placeholder={translate("CHANGES.SELECT_OPTION_TYPE")}
        renderInput={(params) => {
          return (
            <MDInput
              {...params}
              variant="outlined"
              size="small"
              placeholder={translate("CHANGES.SELECT_OPTION_TYPE")}
              label={translate("CHANGES.SELECT_OPTION_TYPE")}
            />
          );
        }}
        sx={{ minWidth: 100, mt: "20px" }}
      // renderInput={(params) => (
      //   <TextField
      //     {...params}
      //     label={label}
      //     inputProps={{
      //       ...params.inputProps,
      //     }}
      //   />
      // )}
      />
    </>
  );
};

export default EnterOptionTypeDropDown;
