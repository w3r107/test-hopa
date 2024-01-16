import ChangesContextProvider, { useChangesCtx } from "context/changesContext";

import React, { useState, useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { MDBox, MDTypography, Header, MDSnackbar } from "/components";
import DashboardLayout from "/layouts/DashboardLayout";

import ChangesTile from "components/changes/ChangesTile";
import { MDButton } from "components";
import { useChanges } from "store/changes/changes.slice";
import ChangesActionMenu from "components/changes/ChangesTile/ChangesActionMenu";

const MemoizedChangesTile = React.memo(ChangesTile);

const Changes = () => {
  const { handleDragEnd, setChangesFormData, setChangesFormOpened } = useChangesCtx();

  const { allchanges } = useChanges()
  const { t: translate } = useTranslation();

  // States
  const [loaderMessage, setLoaderMessage] = useState("");
  const [snackbarProps, setSnackbarProps] = useState({
    success: true,
    message: "",
    visible: false,
  });

  const showSnackbar = useCallback((success, message) => {
    setSnackbarProps({ success, message, visible: true });
  }, []);


  return (
    <MDBox>
      <MDSnackbar
        icon="notifications"
        title="Hopa-Menu"
        content={snackbarProps.message}
        open={snackbarProps.visible}
        color={snackbarProps.success ? "success" : "error"}
        close={() => setSnackbarProps({ ...snackbarProps, visible: false })}
        autoHideDuration={2000}
      />
      <DashboardLayout>
        <Header />
        <ChangesActionMenu />
        {allchanges?.length !== 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="parentCategories" type="droppableParent">
              {(provider, snapshot) => (
                <div
                  {...provider.droppableProps}
                  ref={provider.innerRef}
                  style={{
                    padding: snapshot.isDraggingOver ? "0 20px 200px 20px" : 0,
                    background: snapshot.isDraggingOver
                      ? "#fafafa"
                      : "rgba(255, 255, 255, 0)",
                    border: snapshot.isDraggingOver
                      ? "1px dashed lightgrey"
                      : "none",
                    transition: "0.25s all ease-in-out",
                    borderRadius: 10,
                  }}
                >
                  <MDTypography sx={{ my: 1, ml: 1, mt: 2, fontSize: 17 }}>
                    {translate("CHANGES.TITLE")}
                  </MDTypography>

                  {allchanges?.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <>
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <MemoizedChangesTile
                              key={item.id}
                              changes={item}
                              showSnackbar={showSnackbar}
                              setLoaderMessage={setLoaderMessage}
                            />
                          </div>
                          {provider.placeholder}
                        </>
                      )}
                    </Draggable>
                  ))}
                  {provider.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <MDButton
          sx={{ my: 2 }}
          variant="gradient"
          color="dark"
          size="small"
          onClick={() => {
            setChangesFormOpened("add")
            setChangesFormData({})
          }}
        >
          {translate("BUTTON.ADD_CHANGES")}
        </MDButton>
      </DashboardLayout>
    </MDBox>
  );
};

const MenuWithContext = () => {
  return (
    <ChangesContextProvider>
      <Changes />
    </ChangesContextProvider>
  );
};

MenuWithContext.auth = true;

export default MenuWithContext;
