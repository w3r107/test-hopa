import { Loader, MDSnackbar } from "components";
import {
  AddCategoryModal,
  AddParentCategoryModal,
  DeleteDishModal,
  DishModal,
} from "components/menu";
import MenuUploadStats from "components/modals/MenuUploadStats";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  deleteCategory,
  updateCategoryOrder,
} from "store/category/category.action";
import { categoryActions, useCategory } from "store/category/category.slice";
import { deleteDish, updateDishOrder } from "store/dish/dish.action";
import { dishActions, useDish } from "store/dish/dish.slice";
import {
  addParentCategory,
  deleteParentCategory,
  getAllParentCategory,
  updateParentCategory,
  updateParentCategoryOrder,
} from "store/parentCategory/parentCategory.action";
import {
  parentCategoryActions,
  useParentCategory,
} from "store/parentCategory/parentCategory.slice";
import { getRestaurantId } from "utils/getRestuarantId";
import midString from "utils/ordering";

const menuContext = createContext({});

export const useMenuCtx = () => useContext(menuContext);

export const MenuContextProvider = ({ children }) => {
  // redux dispatcher
  const dispatch = useDispatch();

  // translation
  const { t: translate } = useTranslation();

  // upload stats
  const [uploadStats, setUploadStats] = useState({
    show: false,
    data: {},
  });

  // form open close
  const [parentCategoryFormOpened, setParentCategoryFormOpened] = useState("");
  const [categoryFormOpened, setCategoryFormOpened] = useState("");
  const [dishFormOpened, setDishFormOpened] = useState("");

  // dish states
  const [dishFormOpenedType, setDishFormOpenedType] = useState("");
  const [isDeleteDishModalOpen, setIsDeleteDishModalOpen] = useState(false);
  const [toDeleteDish, setToDeleteDish] = useState("");

  // form datas
  const [parentCategoryFormData, setParentCategoryFormData] = useState({});
  const [categoryFormData, setCategoryFormData] = useState({});
  const [dishFormData, setDishFormData] = useState({});

  // parent category reducers
  const { allParentCategories, loaded } = useParentCategory();

  const { categories } = useCategory();
  const { dishes } = useDish();

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
    const { source, destination } = result;

    // if source and destination are not valid
    if (!source === null || destination === null) return;

    // source and destination index
    const sourceIdx = source?.index;
    const destIdx = destination?.index;

    // if source and destination droppable are not same return
    if (source.droppableId !== destination.droppableId) return;

    // if source and destination index are same return
    if (sourceIdx === destIdx) return;

    // if drop is in parent category
    if (result.type === "droppableParent") {
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
    // reorder category
    else if (result?.type === "droppableCategory") {
      let sourceDroppable = source.droppableId;
      const categoriesOfParent = categories[sourceDroppable].items;

      let a = categoriesOfParent[sourceIdx]?.position;
      let b = categoriesOfParent[destIdx]?.position;

      let newOrder;

      if (destination.index === 0) {
        newOrder = midString("", categoriesOfParent[0].position);
      } else if (destination.index === categoriesOfParent.length - 1) {
        newOrder = midString(b, "");
      } else if (destination.index < source.index) {
        newOrder = midString(categoriesOfParent[destIdx - 1]?.position, b);
      } else {
        newOrder = midString(b, categoriesOfParent[destIdx + 1]?.position);
      }

      let data = {
        parentCategoryId: sourceDroppable,
        categoryId: categoriesOfParent[sourceIdx].id,
        position: newOrder,
        restaurantId: getRestaurantId(),
      };

      dispatch(categoryActions.updateCategoryOrderById(data));
      dispatch(updateCategoryOrder({ data }));
    } else if (result?.type === "droppableDishes") {
      let sourceDroppable = source.droppableId;

      if (String(sourceDroppable).endsWith("-dish")) {
        sourceDroppable = String(sourceDroppable).split("-dish")[0];
      }
      const dishesOfCategory = dishes[sourceDroppable].items;

      let a = dishesOfCategory[sourceIdx]?.position;
      let b = dishesOfCategory[destIdx]?.position;

      let newOrder;

      if (destination.index === 0) {
        newOrder = midString("", dishesOfCategory[0].position);
      } else if (destination.index === dishesOfCategory.length - 1) {
        newOrder = midString(b, "");
      } else if (destination.index < source.index) {
        newOrder = midString(dishesOfCategory[destIdx - 1]?.position, b);
      } else {
        newOrder = midString(b, dishesOfCategory[destIdx + 1]?.position);
      }

      let data = {
        categoryId: sourceDroppable,
        dishId: dishesOfCategory[sourceIdx].id,
        position: newOrder,
        restaurantId: getRestaurantId(),
      };

      dispatch(dishActions.updateDishOrderById(data));
      dispatch(updateDishOrder({ data }));
    } else if (result?.type === "droppableParentDishes") {
      let sourceDroppable = source.droppableId;

      if (String(sourceDroppable).endsWith("-p")) {
        sourceDroppable = String(sourceDroppable).split("-p")[0];
      }

      const dishesOfCategory = dishes[sourceDroppable].items;

      let a = dishesOfCategory[sourceIdx]?.position;
      let b = dishesOfCategory[destIdx]?.position;

      let newOrder;

      if (destination.index === 0) {
        newOrder = midString("", dishesOfCategory[0].position);
      } else if (destination.index === dishesOfCategory.length - 1) {
        newOrder = midString(b, "");
      } else if (destination.index < source.index) {
        newOrder = midString(dishesOfCategory[destIdx - 1]?.position, b);
      } else {
        newOrder = midString(b, dishesOfCategory[destIdx + 1]?.position);
      }

      let data = {
        categoryId: sourceDroppable,
        dishId: dishesOfCategory[sourceIdx].id,
        position: newOrder,
        restaurantId: getRestaurantId(),
      };

      dispatch(dishActions.updateDishOrderById(data));
      dispatch(updateDishOrder({ data }));
    }
  };

  // function to show snackbar
  const showSnackbar = useCallback((success, message) => {
    setSnackbarProps({ success, message, visible: true });
  }, []);

  // add and edit parent category form
  const onSubmitParentCategoryForm = async (values) => {
    const { days, timerange, ...restParentData } = values;

    let daysToAdd = {};
    days.forEach((day) => {
      if (timerange[day]) {
        daysToAdd[day] = {
          start: timerange[day]?.start || "00:00",
          end: timerange[day]?.end || "00:00",
        };
      }
    });
    const parentCategoryData = {
      ...parentCategoryFormData,
      ...restParentData,
      days,
      timerange: daysToAdd,
      restaurantId: getRestaurantId(),
    };

    
    if (parentCategoryFormOpened === "add") {
      showLoader(true, translate("LOADING.ADDING_PARENT_CATEGORY"));
      dispatch(addParentCategory({ data: parentCategoryData }))
        .unwrap()
        .then(() => {
          setParentCategoryFormOpened("");
          showSnackbar(true, translate("TOAST.ADD_PARENT_CATEGORY_SUCCESS"));
        })
        .catch(() => {
          showSnackbar(false, translate("TOAST.ADD_PARENT_CATEGORY_FAILURE"));
        })
        .finally(() => {
          showLoader(false);
        });
      return;
    } else if (parentCategoryFormOpened === "edit") {
      console.log("idhar to fatt hi gaya");
      showLoader(true, translate("LOADING.UPDATING_PARENT_CATEGORY"));
      parentCategoryData.parentCategoryId = parentCategoryFormData.id;

      dispatch(updateParentCategory({ data: parentCategoryData }))
        .unwrap()
        .then(() => {
          setParentCategoryFormOpened("");
          showSnackbar(true, translate("TOAST.EDIT_PARENT_CATEGORY_SUCCESS"));
        })
        .catch(() => {
          showSnackbar(false, translate("TOAST.EDIT_PARENT_CATEGORY_FAILURE"));
        })
        .finally(() => {
          showLoader(false);
        });
      return;
    }
  };

  // load all categories
  useEffect(() => {
    if (!loaded) {
      dispatch(getAllParentCategory({ restaurantId: getRestaurantId() }));
    }
  }, [dispatch]);

  // delete category by id
  const deleteCategoryById = (categoryId) => {
    showLoader(true, translate("LOADING.DELETING_CATEGORY"));
    dispatch(
      deleteCategory({
        data: {
          restaurantId: getRestaurantId(),
          categoryId: categoryId,
        },
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.DELETE_CATEGORY_SUCCESS"));
      })
      .catch((err) => {
        showSnackbar(false, translate("TOAST.DELETE_CATEGORY_FAILURE"));
      })
      .finally(() => {
        showLoader(false);
      });
  };

  // delete parent category by id
  const deleteParentCategoryById = (parentCategoryId) => {
    showLoader(true, translate("LOADING.DELETING_PARENT_CATEGORY"));
    dispatch(
      deleteParentCategory({
        data: {
          restaurantId: getRestaurantId(),
          parentCategoryId: parentCategoryId,
        },
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.DELETE_PARENT_CATEGORY_SUCCESS"));
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.DELETE_PARENT_CATEGORY_SUCCESS"));
      })
      .finally(() => {
        showLoader(false);
      });
  };

  // delete dish by id
  const deleteDishById = () => {
    if (!toDeleteDish) {
      setIsDeleteDishModalOpen("");
      return showSnackbar(false, translate("TOAST.DISH_DELETE_FAILURE"));
    }
    showLoader(true, translate("LOADING.DELETING_DISH"));
    dispatch(
      deleteDish({
        data: {
          dishId: toDeleteDish,
          restaurantId: getRestaurantId(),
        },
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.DISH_DELETE_SUCCESS"));
      })
      .catch(() => {
        showSnackbar(false, translate("TOAST.DISH_DELETE_FAILURE"));
      })
      .finally(() => {
        setIsDeleteDishModalOpen("");
        showLoader(false);
      });
  };

  return (
    <menuContext.Provider
      value={{
        // menu upload stats
        uploadStats,
        setUploadStats,

        // form open state
        parentCategoryFormOpened,
        setParentCategoryFormOpened,
        categoryFormOpened,
        setCategoryFormOpened,
        dishFormOpened,
        setDishFormOpened,

        // for deciding dish adding in category or parent category
        dishFormOpenedType,
        setDishFormOpenedType,

        // data
        parentCategoryFormData,
        setParentCategoryFormData,
        categoryFormData,
        setCategoryFormData,
        

        // dish states
        dishFormData,
        setDishFormData,
        isDeleteDishModalOpen,
        setIsDeleteDishModalOpen,
        toDeleteDish,
        setToDeleteDish,

        // delete functions
        deleteCategoryById,
        deleteParentCategoryById,
        deleteDishById,

        // reordering
        handleDragEnd,

        // form submit handlers
        onSubmitParentCategoryForm,

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

      <AddParentCategoryModal />

      <AddCategoryModal />

      <DishModal />

      <MenuUploadStats />

      <DeleteDishModal
        isOpen={isDeleteDishModalOpen}
        handleClose={() => setIsDeleteDishModalOpen(false)}
        onDeleleteDish={() => deleteDishById()}
      />

      {children}
    </menuContext.Provider>
  );
};

export default MenuContextProvider;
