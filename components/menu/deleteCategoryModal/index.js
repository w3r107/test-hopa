// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";

// Redux Imports
import { useDispatch } from "react-redux";
import { deleteCategory } from "store/category/category.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { useMenuCtx } from "context/menuContext";

const DeleteCategoryModal = ({
  isOpen,
  handleClose,
  onDeleteCategory
}) => {
  const { t: translate } = useTranslation();


  return (
    <>
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        onActionBtnClick={onDeleteCategory}
        title={translate("DELETEMODAL.CATEGORY_TITLE")}
      >
        {translate("DELETEMODAL.CATEGORY_TEXT")}
      </Modal>
    </>
  );
};

export default DeleteCategoryModal;
