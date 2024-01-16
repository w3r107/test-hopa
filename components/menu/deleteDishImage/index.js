// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";

// Redux Imports
import { useDispatch } from "react-redux";
import { useMenu, deleteRestaurantPlaceHolder, deleteDishImage } from "store/restaurant/restaurant.slice";

const DeleteDishImageModal = ({
  isOpen,
  handleClose,
  deleteDishImage,
  onInit,
  onComplete,
}) => {
  const { t: translate } = useTranslation();

  const dispatch = useDispatch();

  const handleDelete = () => {
    onInit();

    deleteDishImage();
    handleClose();
    onComplete();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        onActionBtnClick={handleDelete}
        title={translate("DELETEMODAL.DISH_IMAGE_TITLE")}
      >
        {translate("DELETEMODAL.DISH_IMAGE_TEXT")}
      </Modal>
    </>
  );
};

export default DeleteDishImageModal;
