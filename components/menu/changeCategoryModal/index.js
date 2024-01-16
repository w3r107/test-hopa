// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";

// Redux Imports
import { useDispatch } from "react-redux";

const ChangeCategoryModal = ({
  isOpen,
  handleClose,
  DishCategory
}) => {
  const { t: translate } = useTranslation();

  const dispatch = useDispatch();

  const handleDelete = () => {
    // onInit();

    DishCategory();
    handleClose();
    // onComplete();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        onActionBtnClick={handleDelete}
        title={translate("EDITDISH.CATEGORY_SELECT_TITLE")}
      >
        {translate("EDITDISH.CATEGORY_SELECT_TEXT")}
      </Modal>
    </>
  );
};

export default ChangeCategoryModal;
