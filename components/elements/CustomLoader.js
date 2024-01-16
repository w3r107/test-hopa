import { CircularProgress } from "@mui/material";
import React from "react";

const CustomLoader = ({ width, height, message }) => {
  return (
    <div
      style={{
        width: width || "100%",
        height: height || "100%",
        background: "rgba(255, 255, 255, 0.75)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" />
      {message && (
        <div
          style={{
            marginTop: 10,
            fontSize: 16,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default CustomLoader;
