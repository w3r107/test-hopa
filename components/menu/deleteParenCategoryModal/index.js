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
import { deleteParentCategory } from "store/parentCategory/parentCategory.action";
import { useMenuCtx } from "context/menuContext";

const DeleteParentCategoryModal = ({
    isOpen,
    handleClose,
    onDeleteParentCategory
}) => {
    const { t: translate } = useTranslation();


    return (
        <>
            <Modal
                isOpen={isOpen}
                handleClose={handleClose}
                onActionBtnClick={onDeleteParentCategory}
                title={translate("DELETEMODAL.CATEGORY_TITLE")}
            >
                {translate("DELETEMODAL.CATEGORY_TEXT")}
            </Modal>
        </>
    );
};

export default DeleteParentCategoryModal;
