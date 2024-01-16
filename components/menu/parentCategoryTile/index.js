// React Imports
import React, { useState } from "react";

// redux
import { useDispatch } from "react-redux";

// External Package Imports
import { useTranslation } from "react-i18next";

// custom ctx
import { useMenuCtx } from "context/menuContext";

import { Draggable, Droppable } from "react-beautiful-dnd";

// MUI Imports
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Icon,
  Switch,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

// Local Component Imports
import { MDBox, MDButton } from "/components";

// Context Imports
import { useMaterialUIController } from "context";
import CategoryTile from "../categoryTile";

import { useCategory } from "store/category/category.slice";
import { getAllCategory } from "store/category/category.action";
import { updateParentCategory } from "store/parentCategory/parentCategory.action";

import { getRestaurantId } from "utils/getRestuarantId";

import CustomLoader from "components/elements/CustomLoader";
import MDTypography from "components/elements/MDTypography";
import DeleteParentCategoryModal from "../deleteParenCategoryModal";
import { useDish } from "store/dish/dish.slice";
import { getParentDishes } from "store/dish/dish.action";
import DishTile from "../dishTile";
import MDAvatar from "components/elements/MDAvatar";
import { useRestaurant } from "store/restaurant/restaurant.slice";

const MemoizedCategoryTile = React.memo(CategoryTile);
const MemoizedDishTile = React.memo(DishTile);

const ParentCategoryTile = ({ parentCategory }) => {
  // Translator
  const { t: translate } = useTranslation();
  const dispatch = useDispatch();

  const [categoriesLoading, setCategoriesLoading] = useState("");
  const { categories } = useCategory();
  const { dishes } = useDish();
  const { data: restaurant } = useRestaurant();

  // Accordion Expansion Control
  const [expanded, setExpanded] = useState(false);

  // get all categories on accordion expand
  const handleChange = (isExpanded) => {
    setExpanded(isExpanded ? isExpanded : false);

    if (!categories[parentCategory.id]?.loaded) {
      setCategoriesLoading(parentCategory.id);
      dispatch(
        getAllCategory({
          restaurantId: getRestaurantId(),
          parentCategoryId: parentCategory.id,
        })
      ).then(() => {
        setCategoriesLoading("");
      });
    }

    if (!dishes[parentCategory.id]?.loaded) {
      dispatch(
        getParentDishes({
          restaurantId: getRestaurantId(),
          parentCategoryId: parentCategory.id,
        })
      );
    }
  };

  // Selected Language
  const [{ language }] = useMaterialUIController();

  const [isDeleteParentCategoryModalOpen, setIsDeleteParentCategoryModalOpen] =
    useState(false);

  const {
    setParentCategoryFormData,
    setCategoryFormData,
    deleteParentCategoryById,
    setParentCategoryFormOpened,
    setCategoryFormOpened,
    setDishFormOpened,
    setDishFormData,
    showLoader,
    showSnackbar,
  } = useMenuCtx();

  // change isVisible
  const handleVisibilityChange = () => {
    showLoader(true, translate("LOADING.UPDATING_PARENT_CATEGORY"));
    dispatch(
      updateParentCategory({
        data: {
          parentCategoryId: parentCategory.id,
          restaurantId: getRestaurantId(),
          isVisible:
            parentCategory.isVisible === undefined
              ? true
              : !parentCategory.isVisible,
        },
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar(true, translate("TOAST.EDIT_PARENT_CATEGORY_SUCCESS"));
      })
      .catch((err) => {
        showSnackbar(false, translate("TOAST.EDIT_PARENT_CATEGORY_FAILURE"));
      })
      .finally(() => {
        showLoader(false);
      });
  };

  return (
    <>
      <MDBox
        mt={2}
        dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
        sx={{ cursor: "default" }}
      >
        <Accordion onChange={() => handleChange(!expanded)} expanded={expanded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <MDBox
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <MDBox
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  sx={{ mr: 2, color: "grey", cursor: "grab" }}
                  fontSize="small"
                >
                  drag_indicator
                </Icon>
                {parentCategory?.image && (
                  <MDAvatar
                    src={parentCategory?.image}
                    alt={parentCategory.name && parentCategory.name[language]}
                    sx={{
                      "& .MuiAvatar-img": {
                        height: "100%",
                      },
                      m: 2,
                    }}
                  />
                )}
                <Typography>{parentCategory.name[language]}</Typography>
              </MDBox>

              <MDBox
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MDBox
                  sx={{
                    ...styles.btn,
                    minWidth: "100px",
                    maxWidth: "300px",
                    width: "100%",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVisibilityChange();
                  }}
                >
                  <MDTypography sx={{ fontSize: 13 }}>
                    {translate("SHOW_HIDE_ON_MENU")}
                    {/* {parentCategory.isVisible ? "Hide" : "Show"} Parent Category */}
                  </MDTypography>
                  <Switch checked={parentCategory.isVisible} />
                </MDBox>
                <MDBox
                  style={{
                    marginRight: 5,
                    marginLeft: 5,
                    width: 2,
                    height: 30,
                    background: "lightgrey",
                    fontSize: 30,
                    borderRadius: "50px",
                  }}
                ></MDBox>

                <Icon
                  onClick={(event) => {
                    event.stopPropagation();
                    setParentCategoryFormData(parentCategory);
                    setParentCategoryFormOpened("edit");
                  }}
                  color="light"
                  fontSize="md"
                  style={{
                    color: "#727272",
                    marginLeft: 7,
                    marginRight: 7,
                  }}
                >
                  edit
                </Icon>

                <Icon
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsDeleteParentCategoryModalOpen(true);
                  }}
                  color="error"
                  style={{ marginLeft: 7, marginRight: 7 }}
                  fontSize="md"
                >
                  delete
                </Icon>

                <MDBox
                  style={{
                    marginRight: 15,
                    marginLeft: 15,
                    width: 2,
                    height: 30,
                    background: "lightgrey",
                    fontSize: 30,
                    borderRadius: "50px",
                  }}
                ></MDBox>
              </MDBox>
            </MDBox>
          </AccordionSummary>
          <AccordionDetails>
            <MDBox>
              <MDBox display="flex" flexDirection="column">
                {categoriesLoading === parentCategory.id && (
                  <CustomLoader
                    message={translate("BUTTON.LOADING_PARENT_CATEGORY")}
                  />
                )}
                <Droppable
                  droppableId={parentCategory?.id}
                  type="droppableCategory"
                >
                  {(provider, snapshot) => (
                    <div
                      {...provider.droppableProps}
                      ref={provider.innerRef}
                      style={{
                        padding: snapshot.isDraggingOver
                          ? "0 20px 200px 20px"
                          : 0,
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
                      {categories[parentCategory.id] &&
                        categories[parentCategory.id].items.length > 0 &&
                        categories[parentCategory.id].items?.map(
                          (item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                                shouldRespectForcePress={true}
                                disableInteractiveElementBlocking
                              >
                                {(provided) => (
                                  <>
                                    <div
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      key={item.id}
                                      ref={provided.innerRef}
                                    >
                                      <MemoizedCategoryTile
                                        key={item.id}
                                        category={item}
                                      />
                                    </div>
                                  </>
                                )}
                              </Draggable>
                            );
                          }
                        )}

                      {provider.placeholder}
                    </div>
                  )}
                </Droppable>
              </MDBox>


              <MDBox>
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Droppable
                    droppableId={`${parentCategory?.id}-p`}
                    type="droppableParentDishes"
                  >
                    {(provider, snapshot) => (
                      <div
                        {...provider.droppableProps}
                        ref={provider.innerRef}
                        style={{
                          padding: snapshot.isDraggingOver
                            ? "0 20px 200px 20px"
                            : 0,
                          background: snapshot.isDraggingOver
                            ? "#fafafa"
                            : "rgba(255, 255, 255, 0)",
                          border: snapshot.isDraggingOver
                            ? "1px dashed lightgrey"
                            : "none",
                          transition: "0.25s all ease-in-out",
                          borderRadius: 10,
                          width: "100%",
                        }}
                      >
                        {dishes[parentCategory?.id]?.items &&
                          dishes[parentCategory?.id]?.items?.length > 0 &&
                          dishes[parentCategory?.id]?.items?.map(
                            (item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                  shouldRespectForcePress={true}
                                  disableInteractiveElementBlocking
                                >
                                  {(provided) => (
                                    <div
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      key={item.id}
                                      ref={provided.innerRef}
                                    >
                                      <MemoizedDishTile
                                        key={item.id}
                                        dish={item}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              );
                            }
                          )}
                        {provider.placeholder}
                      </div>
                    )}
                  </Droppable>
                </MDBox>
              </MDBox>

              <MDBox
                sx={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <MDButton
                  sx={{ my: 2 }}
                  variant="gradient"
                  color="dark"
                  size="small"
                  onClick={() => {
                    setDishFormOpened("add");
                    setDishFormData({
                      dishType: "parentCategoryDish",
                      parentCategoryId: parentCategory.id,
                    });
                  }}
                >
                  {translate("BUTTON.ADDDISH")}
                </MDButton>

                {/* category add form data  */}
                <MDButton
                  sx={{ my: 2 }}
                  variant="gradient"
                  color="dark"
                  size="small"
                  onClick={() => {
                    setCategoryFormData({
                      parentCategoryId: parentCategory.id,
                    });
                    setCategoryFormOpened("add");
                  }}
                >
                  {translate("BUTTON.ADDCATEGORY")}
                </MDButton>
              </MDBox>
            </MDBox>
          </AccordionDetails>
        </Accordion>
      </MDBox>

      <DeleteParentCategoryModal
        isOpen={isDeleteParentCategoryModalOpen}
        handleClose={() => setIsDeleteParentCategoryModalOpen(false)}
        onDeleteParentCategory={() =>
          deleteParentCategoryById(parentCategory?.id)
        }
      />
    </>
  );
};

const styles = {
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    px: 1,
    py: 0.5,
    mx: 0.5,
    borderRadius: 2,
    transition: "0.25s all ease-in-out",
    cursor: "pointer",
    background: "white",
    "&:hover": {
      background: "#fafafa",
    },
  },
};

export default ParentCategoryTile;
