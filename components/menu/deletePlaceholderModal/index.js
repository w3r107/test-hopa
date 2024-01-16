// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";

const DeletePlaceHolderModal = ({
  isOpen,
  handleClose,
  onDelete,
}) => {
  const { t: translate } = useTranslation();


  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        onActionBtnClick={onDelete}
        title={translate("DELETEMODAL.PLACEHOLDER_TITLE")}
      >
        {translate("DELETEMODAL.PLACEHOLDER_TEXT")}
      </Modal>
    </>
  );
};

export default DeletePlaceHolderModal;
