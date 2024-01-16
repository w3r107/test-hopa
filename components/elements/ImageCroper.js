import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

import ImageModal from "./ImageModal";
import MDBox from "./MDBox";
import MDTypography from "./MDTypography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const TO_RADIANS = Math.PI / 180;

async function canvasPreview(image, canvas, crop, scale = 1, rotate = 0) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "low";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.rotate(rotateRads);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

const ImageCroper = ({
  onSave,
  value,
  removeFileFunction,
  ratio,
  ...props
}) => {
  const aspect = ratio;

  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [openModal, setOpenModal] = useState(false);

  function onSelectFile(e) {
    setOpenModal(true);
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height));
    }
  }

  const onSaveHandler = async () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      await canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop
      );
      onSave(previewCanvasRef.current.toDataURL());
      handleClose();
    }
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <MDBox sx={{ width: "60%" }}>
      <MDTypography mt={2} ml={3} variant="h5">
        {t("SETTINGMODAL.TITLE")}
      </MDTypography>
      <MDBox
        sx={{
          border: "1px dashed",
          borderRadius: ".3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 2rem",
        }}
        mt={3}
        ml={4}
      >
        <input
          type="file"
          accept="image/*"
          id="uploadImage"
          onChange={onSelectFile}
          style={{ display: "none" }}
        />

        <MDBox
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <label style={{ cursor: "pointer" }} htmlFor="uploadImage">
            <MDBox
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CloudUploadIcon />
              <span style={{ fontSize: "14px" }}>{t("EDITMODAL.UPLOAD")}</span>
            </MDBox>
          </label>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              alignItems: "center",
            }}
            onClick={() => {
              removeFileFunction();
            }}
          >
            {/* import DeleteIcon from '@mui/icons-material/Delete'; */}
            <DeleteIcon sx={{ color: "#F44335" }} />
            <span style={{ fontSize: "14px" }}>{t("EDITMODAL.DELETE")}</span>
          </MDBox>
        </MDBox>

        <ImageModal
          open={openModal}
          onSave={onSaveHandler}
          handleClose={handleClose}
        >
          {Boolean(imgSrc) && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              style={{
                marginRight: "12px",
              }}
              {...props}
            >
              <img
                style={{
                  height: "auto",
                  width: "100%",
                  objectFit: "contain"
                }}
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </ImageModal>

        {Boolean(previewCanvasRef?.current) ? (
          <div
            className="w-full"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <div className="iphone-x">
              <i>Speaker</i>
              <b>Camera</b>
              <img
                className="overlay-img"
                style={{
                  height: "auto",
                  width: "100%", 
                  objectFit: "contain"
                }}
                src={previewCanvasRef?.current?.toDataURL()}
              />
            </div>
          </div>
        ) : (
          <div
            className="w-full"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            {value && (
              <div className="iphone-x">
                <i>Speaker</i>
                <b>Camera</b>
                <img
                  className="overlay-img"
                  style={{
                    height: "auto",
                    width: "100%",
                    objectFit: "contain"
                  }}
                  src={value}
                />
                <div className="overlay-img" />
              </div>
            )}
          </div>
        )}

        {Boolean(completedCrop) && (
          <canvas
            ref={previewCanvasRef}
            style={{
              width: "auto",
              height: "100%",
              objectFit: "contain",
              display: "none" // You might want to change this if you want to display the canvas
            }}
          />
        )}
      </MDBox>
    </MDBox>
  );
};

export default ImageCroper;
