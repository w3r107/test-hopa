import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { useMaterialUIController } from "context";
import { MDSnackbar } from "/components";
import { useTranslation } from "react-i18next";
import MDInput from "components/elements/MDInput";

// import ChangeCategoryModal from "../changeCategoryModal";
// import { useMenuCtx } from "context/menuContext";

import { useCategory } from "store/category/category.slice";
import { useParentCategory } from "store/parentCategory/parentCategory.slice";

export default function DishParentCategoryDropdown({
  onChange,
  parentCategoryId,
  onCategoryChange,
}) {
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });

  const [{ language }] = useMaterialUIController();
  const { t: translate } = useTranslation();

  const { allParentCategories } = useParentCategory();

  // const { dishFormOpened } = useMenuCtx();
  // const [isDishCategoryModalOpen, setIsDishCategoryModalOpen] = useState(false);
  // const [categoryData, setCategoryData] = useState({});

  const onChangeFunction = (newValue) => {
    onChange("parentCategoryId", newValue?.parentCategoryId || "");
    onCategoryChange(newValue?.parentCategoryId || "");
  };

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

      {/* <ChangeCategoryModal
        isOpen={isDishCategoryModalOpen}
        handleClose={() => setIsDishCategoryModalOpen(false)}
        DishCategory={() => DishCategory()}
      /> */}

      <Autocomplete
        // multiple
        id="country-select-demo"
        // sx={{ width: "100%" }}
        options={allParentCategories.map((el) => ({
          parentCategoryId: el?.id,
          name: el?.name,
        }))}
        getOptionLabel={(option) =>
          option?.name[language] || "Choose Parent Category"
        }
        value={
          allParentCategories.filter(
            (item) => item.id === parentCategoryId
          )[0] || null
        }
        onChange={(_, newValue) => onChangeFunction(newValue)}
        isOptionEqualToValue={(op, v) => op.parentCategoryId === v.id}
        autoHighlight
        placeholder={translate("EDITMODAL.CATEGORY")}
        renderInput={(params) => {
          return (
            <MDInput
              {...params}
              variant="outlined"
              size="small"
              placeholder={translate("EDITMODAL.CATEGORY")}
            />
          );
        }}
        sx={{ minWidth: 100 }}
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
}
