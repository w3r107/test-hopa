import React, { useState } from "react";
//material UI components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Autocomplete } from "@mui/material";
// components
import MDEditor from "/components/MDEditor";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import MDInput from "/components/MDInput";
// form Input components
import FormField from "components/formField";
// Image Picker Component
import Media from "../../pagesComponents/ecommerce/products/new-product/components/Media";
import { useFormikHook } from "/hooks/UseFormikHook";

function DishDetail() {
  const [editorValue, setEditorValue] = useState(
    "<p>Write Descrition of the dish</p><br><br><br><br>"
  );

  const initialValues = {};

  const submit = async (values) => {};

  const { handleChange, handleSubmit, setFieldTouched, errors, touched } =
    useFormikHook(submit, initialValues);

  return (
    <Card
      id="basic-info"
      sx={{
        overflow: "visible",
      }}
    >
      <Media />
      <MDBox p={2}>
        <MDTypography variant="h5">Dish Detail</MDTypography>
      </MDBox>
      <MDBox pb={3}>
        <MDBox p={2}>
          <FormField
            onChange={handleChange("dishName")}
            onBlur={() => setFieldTouched("dishName")}
            label="Write Dish Name"
          />
          <Grid container mt={1} spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField type="text" label="99.00" />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <Autocomplete
                defaultValue="USD"
                options={["BTC", "CNY", "EUR", "GBP", "INR", "USD"]}
                renderInput={(params) => (
                  <MDInput {...params} variant="standard" />
                )}
              />
            </Grid>
          </Grid>
          <MDBox mt={3} mb={1} mr={0} lineHeight={0}></MDBox>
          <MDEditor value={editorValue} onChange={setEditorValue} />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default DishDetail;
