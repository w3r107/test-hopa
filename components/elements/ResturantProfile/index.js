// prop-type is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";

import FormField from "components/formField";

function ResturantProfile({ formData }) {
  return (
    <MDBox>
      <MDBox lineHeight={0}>
        <MDTypography variant="h5">About me</MDTypography>
        <MDTypography variant="button" color="text">
          Mandatory informations
        </MDTypography>
      </MDBox>
      <MDBox mt={1.625}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dishName"
              onChange={handleChange("dishName")}
              onBlur={() => setFieldTouched("dishName")}
              label="Write Dish Name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dishName"
              onChange={handleChange("dishName")}
              onBlur={() => setFieldTouched("dishName")}
              label="Write Dish Name"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dishName"
              onChange={handleChange("dishName")}
              onBlur={() => setFieldTouched("dishName")}
              label="Write Dish Name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dishName"
              onChange={handleChange("dishName")}
              onBlur={() => setFieldTouched("dishName")}
              label="Write Dish Name"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dishName"
              onChange={handleChange("dishName")}
              onBlur={() => setFieldTouched("dishName")}
              label="Write Dish Name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormField
              type="dishName"
              onChange={handleChange("dishName")}
              onBlur={() => setFieldTouched("dishName")}
              label="Write Dish Name"
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

// typechecking props for UserInfo
ResturantProfile.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default ResturantProfile;
