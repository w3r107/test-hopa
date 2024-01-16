// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";

const DeleteUserModal = ({ isOpen, handleClose, onDeleleteDish }) => {
    const { t: translate } = useTranslation();

    return (
        <>
            <Modal
                isOpen={isOpen}
                handleClose={handleClose}
                onActionBtnClick={onDeleleteDish}
                title={translate("DELETEMODAL.USER_TITLE")}
            >
                {translate("DELETEMODAL.USER_TEXT")}
            </Modal>
        </>
    );
};

export default DeleteUserModal;
