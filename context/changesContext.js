import { Loader, MDSnackbar } from "components";
import { OptionModal } from "components/changes";
import ChangesModal from "components/changes/ChangesTile/ChangesModal";
import DeleteOptionModal from "components/changes/optionsTile/DeleteOptionModal";
import DeleteChangesModal from "components/menu/deleteChangesModal";
import ChangesUploadStats from "components/modals/ChangesUploadStats";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { deleteChanges, getAllChanges, removeChangesOption, updateOptionOrder } from "store/changes/changes.action";
import { changesAction, useChanges } from "store/changes/changes.slice";

import { getRestaurantId } from "utils/getRestuarantId";
import midString from "utils/ordering";

const changesContext = createContext({});

export const useChangesCtx = () => useContext(changesContext);

export const ChangesContextProvider = ({ children }) => {
  // redux dispatcher
  const dispatch = useDispatch();

  // translation
  const { t: translate } = useTranslation();

  const [uploadStats, setUploadStats] = useState({
    show: false,
    data: {}
  })


  // form open close
  const [changesFormOpened, setChangesFormOpened] = useState("");
  const [optionFormOpened, setOptionFormOpened] = useState("");

  const [changesFormData, setChangesFormData] = useState({});
  const [optionFormData, setOptionFormData] = useState({});

  // deleting state 
  const [isOptionDeleting, setIsOptionDeleting] = useState(false);
  const [optionDeleteData, setOptionDeleteData] = useState({});

  const [isChangesdDeleting, setIsChangesDeleting] = useState(false);
  const [changesDeleteData, setChangesDeleteData] = useState({});

  // parent category reducers
  const { allchanges, loaded } = useChanges();

  // for loading animation
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  // for snackbar
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });

  const showLoader = (state, message = "") => {
    setLoaderMessage(message);
    setLoading(state);
  };


  // reordering of parent categories
  const handleDragEnd = async (result) => {
    // if result is empty
    if (!result) return;

    // if the parent categories are dragged
    const { source, destination, draggableId } = result;

    // if source and destination are not valid
    if (!source === null || destination === null) return;

    // if source and destination droppable are not same return
    if (source.droppableId !== destination.droppableId) return;

    // source and destination index
    const sourceIdx = source?.index;
    const destIdx = destination?.index;

    // if source and destination index are same return
    if (sourceIdx === destIdx) return;

    if (result.type === "droppableChanges") {
      let allChangesId = allchanges.map((c) => c.id);

      // check if allChanges id array has droppable 
      if (!allChangesId.includes(source.droppableId)) return;

      // get the options of the droppable 
      const alloptions = allchanges.find((c) => c.id === source.droppableId)?.options || [];
      if (!alloptions || alloptions?.constructor !== Array || alloptions.length === 0) return;

      // the position of the the source and index 
      let a = alloptions[sourceIdx]?.position;
      let b = alloptions[destIdx]?.position;

      let newOrder;

      // get the new position for the option 
      if (destination.index === 0) {
        newOrder = midString("", alloptions[0].position);
      } else if (destination.index === alloptions.length - 1) {
        newOrder = midString(b, "");
      } else if (destination.index < source.index) {
        newOrder = midString(
          alloptions[destIdx - 1]?.position,
          b
        );
      } else {
        newOrder = midString(b, alloptions[destIdx + 1]?.position);
      }

      let data = {
        changesId: source.droppableId,
        position: newOrder,
        optionId: draggableId,
        restaurantId: getRestaurantId()
      };

      dispatch(changesAction.updateOptionOrderById(data));
      dispatch(updateOptionOrder({ data }));
    }
  };

  // function to show snackbar
  const showSnackbar = useCallback((success, message) => {
    setSnackbarProps({ success, message, visible: true });
  }, []);

  // load all changes
  useEffect(() => {
    if (!loaded) {
      dispatch(getAllChanges({
        restaurantId: getRestaurantId()
      }))
    }
  }, [dispatch, loaded])


  // delete option by id 
  const deleteOptionById = () => {
    if (!optionDeleteData?.changesId && !optionDeleteData?.optionId) {
      showSnackbar("error", "CHANGE.REQUIRED_CHANGES_AND_OPTION_ID")
    }

    const { changesId, optionId } = optionDeleteData;

    showLoader(true, translate("LOADING.DELETING_OPTION"))
    dispatch(removeChangesOption({
      data: {
        restaurantId: getRestaurantId(),
        changesId: changesId,
        optionId: optionId
      }
    }))
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.DELETE_OPTION_SUCCESS"))
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.DELETE_OPTION_FAILURE"))
      })
      .finally(() => {
        setIsOptionDeleting(false)
        showLoader(false)
      })
  }

  const deleteChangesById = async () => {
    showLoader(true, translate("LOADING.DELETING_CHANGES"))
    dispatch(deleteChanges({
      data: {
        restaurantId: getRestaurantId(),
        changesId: changesDeleteData?.changesId
      }
    }))
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.DELETE_CHANGES_SUCCESS"))
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.DELETE_CHANGES_FAILURE"))
      })
      .finally(() => {
        showLoader(false)
        setIsChangesDeleting(false)
      })
  }


  return (
    <changesContext.Provider
      value={{
        uploadStats, setUploadStats,

        // form states 
        changesFormOpened,
        setChangesFormOpened,
        optionFormOpened,
        setOptionFormOpened,

        // form data  
        changesFormData,
        setChangesFormData,
        optionFormData,
        setOptionFormData,

        // drag func 
        handleDragEnd,

        // delete state 
        isOptionDeleting, setIsOptionDeleting,
        optionDeleteData, setOptionDeleteData,
        isChangesdDeleting, setIsChangesDeleting,
        changesDeleteData, setChangesDeleteData,

        // delete func 
        deleteOptionById,
        deleteChangesById,

        // snack bar function
        showSnackbar,
        showLoader,
      }}
    >
      {loading && <Loader message={loaderMessage} />}

      <MDSnackbar
        icon="notifications"
        title="Hopa-Menu"
        content={snackbarProps.message}
        open={snackbarProps.visible}
        color={snackbarProps.success ? "success" : "error"}
        close={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        autoHideDuration={2000}
      />

      <OptionModal />
      <DeleteOptionModal
        isOpen={isOptionDeleting}
        handleClose={() => setIsOptionDeleting(false)}
        onDeleleteDish={() => deleteOptionById()}
      />

      <ChangesModal />
      <DeleteChangesModal isOpen={true} />

      <ChangesUploadStats />


      {children}
    </changesContext.Provider>
  );
};

export default ChangesContextProvider;
