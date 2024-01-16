// External Package Imports
import PropTypes from "prop-types";

// Local Component Imports
import { MDInput } from "/components";

function FormField({ label, ...rest }) {
  return (
    <MDInput
      label={label}
      fullWidth
      InputLabelProps={{ shrink: true }}
      {...rest}
    />
  );
}

// Setting default values for the props of FormField
FormField.defaultProps = {
  label: " ",
};

// Typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string,
};

export default FormField;
