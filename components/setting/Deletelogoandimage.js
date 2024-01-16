// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";


const DeleteSettingLogoAndImageModal = ({
  isOpen,
  handleClose,
  onDeleteImage
}) => {
  const { t: translate } = useTranslation();


  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        onActionBtnClick={onDeleteImage}
        title={translate("DELETEMODAL.IMAGE_TITLE")}
      >
        {translate("DELETEMODAL.IMAGE_TEXT")}
      </Modal>
    </>
  );
};

export default DeleteSettingLogoAndImageModal;
