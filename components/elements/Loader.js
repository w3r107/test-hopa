import { CircularProgress } from "@mui/material";
import React from "react";

const Loader = ({ message = null }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
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

export default Loader;
