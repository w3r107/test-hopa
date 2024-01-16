import React from "react";

import MDBox from "./MDBox";
import MDTypography from "./MDTypography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTranslation } from "react-i18next";

const imageMimeTypes = ["image/png", "image/jpeg"];

function UploadImage(props) {
  const { label, onChange, value, isMultiple, onBlur } = props;
  const { t } = useTranslation();

  const changeHandler = (event) => {
    if (isMultiple) {
    } else {
      const file = event.target.files[0];

      if (
        file.type.split("/")[0] === "image" &&
        imageMimeTypes.includes(file.type)
      ) {
        onChange(file);
      } else {
      }
    }
  };

  return (
    <MDBox sx={{ width: "60%" }}>
      <MDTypography mt={2} ml={3} variant="h5">
        {label}
      </MDTypography>
      <MDBox
        sx={{
          border: "1px dashed",
          borderRadius: ".3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem 2rem",
        }}
        mt={3}
        ml={4}
      >
        <input
          multiple={isMultiple}
          type="file"
          accept="image/png, image/jpeg"
          id="uploadImage"
          style={{ display: "none" }}
          onChange={changeHandler}
        />
        <label style={{ cursor: "pointer" }} htmlFor="uploadImage">
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CloudUploadIcon />
            <span>{t("EDITMODAL.UPLOAD")}</span>
          </MDBox>
        </label>

        {value && (
          <MDBox
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isMultiple ? (
              <MDBox
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {value.map((image) => (
                  <img
                    style={{
                      mr: ".5rem",
                      mb: ".5rem",
                      height: "7rem",
                      width: "7rem",
                      objectFit: "cover",
                    }}
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt="uploaded"
                  />
                ))}
              </MDBox>
            ) : (
              <img
                src={
                  typeof value === "string" ? value : URL.createObjectURL(value)
                }
                style={{ height: "7rem", width: "7rem", objectFit: "cover" }}
                alt="uploaded"
              />
            )}
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}

export default UploadImage;
