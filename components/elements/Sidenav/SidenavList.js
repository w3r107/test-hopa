// External Package Imports
import PropTypes from "prop-types";

// MUI Imports
import List from "@mui/material/List";

function SidenavList({ children }) {
  return (
    <List
      sx={{
        px: 2,
        my: 0.3,
      }}
    >
      {children}
    </List>
  );
}

// Typechecking props for the SidenavItem
SidenavList.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SidenavList;
