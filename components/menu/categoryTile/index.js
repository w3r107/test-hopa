// React Imports
import React, { useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

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
import { DeleteCategoryModal} from "components/menu";
import DishTile from "../dishTile";

// Context Imports
import { useMaterialUIController } from "context";

import { useDispatch } from "react-redux";
import { getAllDishes } from "store/dish/dish.action";
import { getRestaurantId } from "utils/getRestuarantId";
import { useDish } from "store/dish/dish.slice";
import CustomLoader from "components/elements/CustomLoader";
import { useMenuCtx } from "context/menuContext";
import { Draggable, Droppable } from "react-beautiful-dnd";
import MDTypography from "components/elements/MDTypography";
import { updateCategory } from "store/category/category.action";
import { toast } from "react-toastify";

const MemoizedDishTile = React.memo(DishTile);

const CategoryTile = ({ category }) => {
    // Translator
    const { t: translate } = useTranslation();

    // Accordion Expansion Control
    const [expanded, setExpanded] = useState(false);
    const [dishLoading, setDishLoading] = useState("");

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (!dishes[category?.id]?.loaded) {
            setDishLoading(category?.id);
            dispatch(
                getAllDishes({
                    restaurantId: getRestaurantId(),
                    categoryId: category.id,
                })
            ).then(() => {
                setDishLoading("");
            });
        }
    };

    const {
        setCategoryFormOpened,
        setCategoryFormData,
        deleteCategoryById,
        setDishFormOpened,
        setDishFormOpenedType,
        setDishFormData,
        showLoader,
        showSnackbar
    } = useMenuCtx();

    const { dishes } = useDish();

    const dispatch = useDispatch();

    // Selected Language
    const [{ language }] = useMaterialUIController();

    const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);

    // change isVisible 
    const handleVisibilityChange = async () => {
        showLoader(true, translate("LOADING.UPDATING_CATEGORY"))
        dispatch(updateCategory({
            data: {
                categoryId: category.id,
                restaurantId: getRestaurantId(),
                isVisible: category?.isVisible === undefined ? true : !category?.isVisible
            }
        })).unwrap()
            .then(() => {
                showSnackbar(true, translate("TOAST.EDIT_CATEGORY_SUCCESS"))
            })
            .catch((err) => {
                showSnackbar(false, translate("TOAST.EDIT_CATEGORY_FAILURE"))
            })
            .finally(() => {
                showLoader(false)
            })
    }

    return (
        <>
            <MDBox
                mt={2}

                dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
                sx={{ cursor: "default" }}

            >
                <Accordion expanded={expanded}
                    onChange={handleChange(!expanded)}>
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
                                zIndex: 200
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
                                <Typography>{category?.name[language]}</Typography>
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
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        minWidth: "180px",
                                        maxWidth: "300px",
                                        width: "100%",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVisibilityChange()
                                    }}
                                >
                                    <MDTypography sx={{ fontSize: 13 }}>
                                    {translate("SHOW_HIDE_ON_MENU")}
                                        {/* {category?.isVisible ? "Hide" : "Show"} Category */}
                                    </MDTypography>
                                    <Switch checked={category?.isVisible} />
                                </MDBox>
                                <Icon
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setCategoryFormOpened("edit");
                                        setCategoryFormData(category)
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
                                        setIsDeleteCategoryModalOpen(true);
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
                            <MDBox display="flex" flexDirection="column" alignItems="center">
                                {dishLoading && <CustomLoader message={translate("BUTTON.DISHES_LOADING")} />}

                                <Droppable droppableId={category?.id} type="droppableDishes">
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
                                                width: "100%"
                                            }}
                                        >

                                            {dishes[category?.id]?.items &&
                                                dishes[category?.id]?.items?.length > 0 &&
                                                dishes[category?.id]?.items?.map((item, index) => {
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
                                                })}
                                            {provider.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </MDBox>
                                <MDButton
                                    sx={{ my: 2 }}
                                    variant="gradient"
                                    color="dark"
                                    size="small"
                                    onClick={() => {
                                        setDishFormOpened("add")
                                        setDishFormOpenedType("categoryDish")
                                        setDishFormData({
                                            dishType: "categoryDish",
                                            categoryId: category.id,
                                            parentCategoryId: category.parentCategoryId
                                        })
                                    }}
                                >
                                    {translate("BUTTON.ADDDISH")}
                                </MDButton>
                        </MDBox>
                    </AccordionDetails>
                </Accordion>
            </MDBox>

            <DeleteCategoryModal
                isOpen={isDeleteCategoryModalOpen}
                handleClose={() => setIsDeleteCategoryModalOpen(false)}
                onDeleteCategory={() => deleteCategoryById(category.id)}
            />
        </>
    );
};

export default CategoryTile;
