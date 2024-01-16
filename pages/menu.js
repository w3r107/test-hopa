import MenuContextProvider, { useMenuCtx } from "context/menuContext";

import React, { useState, useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { MDBox, MDTypography, Header, MDSnackbar } from "/components";
import { MenuHeader, MenuActions } from "/components/menu";
import DashboardLayout from "/layouts/DashboardLayout";

import { useParentCategory } from "store/parentCategory/parentCategory.slice";
import ParentCategoryTile from "components/menu/parentCategoryTile";

const MemoizedParentCategoryTile = React.memo(ParentCategoryTile);

const Menu = () => {
  const { handleDragEnd } = useMenuCtx();

  const { t: translate } = useTranslation();

  const { isLoading: parentLoading, allParentCategories } = useParentCategory();

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
        <MenuHeader />
        <MenuActions />
        {allParentCategories?.length !== 0 && (
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
                    {translate("PARENT_CATEGORIES")}
                  </MDTypography>

                  {allParentCategories?.map((item, index) => (
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
                            <MemoizedParentCategoryTile
                              key={item.id}
                              parentCategory={item}
                            />
                          </div>
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
      </DashboardLayout>
    </MDBox>
  );
};

const MenuWithContext = () => {
  return (
    <MenuContextProvider>
      <Menu />
    </MenuContextProvider>
  );
};

MenuWithContext.auth = true;

export default MenuWithContext;
