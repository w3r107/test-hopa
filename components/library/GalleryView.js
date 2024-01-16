import React from "react";
import { Grid } from "@mui/material";
import Image from "next/image";

function GalleryView({ images }) {
  return (
    <Grid container spacing={1} p={2}>
      {images?.map((item, index) => (
        <Grid key={index} item xs={6} sm={1}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
            }}
          >
            <Image
              alt="icon"
              src={item?.image}
              width="100%"
              height="100%"
              className="rounded-image"
            />
          </div>
        </Grid>
      ))}
    </Grid>
  );
}

export default GalleryView;
