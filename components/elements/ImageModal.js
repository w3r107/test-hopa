// React Imports
import { forwardRef } from "react";

// MUI Imports
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";

// Local Component Imports
import { MDButton } from "/components/";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImageModal = ({ children, open, onSave, handleClose, image }) => {
  return (
    <div className="w-full">
      <Dialog
        open={open}
        fullWidth={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Crop Image</DialogTitle>

        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <MDButton
            onClick={onSave}
            variant="gradient"
            color="success"
            size="small"
          >
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageModal;
