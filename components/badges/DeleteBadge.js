// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";

// Redux Imports
import { useDispatch } from "react-redux";
import { getRestaurantId } from "utils/getRestuarantId";
import { deleteBadgeById } from "store/badge/badge.action";

const DeleteBadgeModal = ({
  isOpen,
  handleClose,
  onInit,
  selectedBadge,
  onComplete,
}) => {
  const { t: translate } = useTranslation();

  const dispatch = useDispatch();

  const handleDelete = () => {
    onInit();

    dispatch(deleteBadgeById({
      data: {
        badgeId: selectedBadge.id,
        restaurantId: getRestaurantId()
      }
    })).then(() => {
      handleClose();
      onComplete();
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        onActionBtnClick={handleDelete}
        title={translate("DELETEMODAL.BADGE_TITLE")}
      >
        {translate("DELETEMODAL.BADGE_TEXT")}
      </Modal>
    </>
  );
};

export default DeleteBadgeModal;
