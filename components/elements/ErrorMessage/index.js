// React Imports
import React from "react";

// External Package Imports
import PropTypes from "prop-types";

// Local Package Imports
import { MDTypography } from "/components";

const ErrorMessage = ({ error, visible }) => {
  if (!visible || !error) return null;
  return (
    <div>
      <MDTypography style={{ color: "red", fontSize: 11 }}>
        {error}
      </MDTypography>
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
  visible: PropTypes.bool,
};
export default ErrorMessage;
