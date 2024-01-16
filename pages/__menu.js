import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { MDBox, MDTypography, Loader, Header, MDSnackbar } from "/components";
import {
  MenuHeader,
  AddParentCategoryModal,
  MenuActions,
} from "/components/menu";
import DashboardLayout from "/layouts/DashboardLayout";
import { useDispatch } from "react-redux";

import {
  getAllParentCategory,
  updateParentCategoryOrder,
} from "store/parentCategory/parentCategory.action";
import { getRestaurantId } from "utils/getRestuarantId";
import {
  parentCategoryActions,
  useParentCategory,
} from "store/parentCategory/parentCategory.slice";
import ParentCategoryTile from "components/menu/parentCategoryTile";
import midString from "../utils/ordering";

const MemoizedParentCategoryTile = React.memo(ParentCategoryTile);

const Menu = () => {
  const { t: translate } = useTranslation();

  const {
    isLoading: parentLoading,
    loaded,
    allParentCategories,
  } = useParentCategory();

  // Redux Setup
  const dispatch = useDispatch();

  const [openParentCategoryForm, setOpenParentCategoryForm] = useState("");
  const [parentCategoryForm, setParentCategoryData] = useState({});

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

  // reordering of parent categories
  const handleDragEnd = async (result) => {
    if (result) {
      // setLoaderMessage(translate("UPDATING_CATEGORY_ORDER"));
      const { source, destination } = result;

      const sourceIdx = source?.index;
      const destIdx = destination?.index;

      let a = allParentCategories[sourceIdx]?.position;
      let b = allParentCategories[destIdx]?.position;

      let newOrder;

      if (destination.index === 0) {
        newOrder = midString("", allParentCategories[0].position);
      } else if (destination.index === allParentCategories.length - 1) {
        newOrder = midString(b, "");
      } else if (destination.index < source.index) {
        newOrder = midString(
          // initialData.columns[listOrder[destination.index - 1]].order,
          allParentCategories[destIdx - 1]?.position,
          b
        );
      } else {
        newOrder = midString(b, allParentCategories[destIdx + 1]?.position);
      }

      let data = {
        parentCategoryId: allParentCategories[sourceIdx].id,
        position: newOrder,
        restaurantId: getRestaurantId(),
      };
      dispatch(parentCategoryActions.updateParentOrderById(data));
      dispatch(updateParentCategoryOrder({ data }));
    }
  };

  useEffect(() => {
    if (!loaded) {
      dispatch(getAllParentCategory({ restaurantId: getRestaurantId() }));
    }
  }, [dispatch]);

  return (
    <MDBox>
      {parentLoading && <Loader message={loaderMessage} />}
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
        <MenuHeader
          setLoaderMessage={(m) => setLoaderMessage(m)}
          openParentCategoriesModal={() => setOpenParentCategoryForm("add")}
        />
        <MenuActions
          setLoaderMessage={setLoaderMessage}
          showSnackbar={showSnackbar}
        />
        <AddParentCategoryModal
          handleClose={() => setOpenParentCategoryForm(false)}
          isOpen={
            openParentCategoryForm === "add" ||
            openParentCategoryForm === "edit"
          }
          setLoaderMessage={(m) => setLoaderMessage(m)}
          showSnackbar={showSnackbar}
          formData={parentCategoryForm}
          formType={openParentCategoryForm}
        />
        {allParentCategories?.length !== 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
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
                    {translate("CATEGORIES")}
                  </MDTypography>
                  <div hidden>{provider.placeholder}</div>
                  {allParentCategories?.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <MemoizedParentCategoryTile
                            key={item.id}
                            parentCategory={item}
                            showSnackbar={showSnackbar}
                            setLoaderMessage={setLoaderMessage}
                            onEditForm={(data) => {
                              setParentCategoryData(data);
                              setOpenParentCategoryForm("edit");
                            }}
                          />
                          {/* <Categories parentCategory={""} /> */}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </DashboardLayout>
    </MDBox>
  );
};

Menu.auth = true;

export default Menu;
