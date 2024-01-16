// React Imports
import React from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

// Local Component Imports
import { Modal } from "components";
import { useChangesCtx } from "context/changesContext";


const DeleteChangesModal = () => {
    const { t: translate } = useTranslation();

    const { isChangesdDeleting, setIsChangesDeleting, deleteChangesById } = useChangesCtx();

    return (
        <>
            <Modal
                isOpen={isChangesdDeleting}
                handleClose={() => setIsChangesDeleting(false)}
                onActionBtnClick={deleteChangesById}
                title={translate("DELETEMODAL.CHANGES_TITLE")}
            >
                {translate("DELETEMODAL.CHANGES_TEXT")}
            </Modal>
        </>
    );
};

export default DeleteChangesModal;
