// React Imports
import React, { useState } from "react";

// External Package Imports
import { useTranslation } from "react-i18next";

import { Draggable, Droppable } from "react-beautiful-dnd";

// custom context 
import { useChangesCtx } from "context/changesContext";

// MUI Imports
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Icon,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

// Local Component Imports
import { MDBox, MDButton } from "/components";

// Context Imports
import { useMaterialUIController } from "context";
import OptionsTile from "../optionsTile";

import DeleteParentCategoryModal from "../../menu/deleteParenCategoryModal";

const MemoizedOptionTile = React.memo(OptionsTile);

const ChangesTile = ({ changes }) => {
  // Translator
  const { t: translate } = useTranslation();


  // Accordion Expansion Control
  const [expanded, setExpanded] = useState(false);

  // get all categories on accordion expand
  const handleChange = (isExpanded) => {
    setExpanded(isExpanded ? isExpanded : false);
  };

  // Selected Language
  const [{ language }] = useMaterialUIController();

  const [isDeleteParentCategoryModalOpen, setIsDeleteParentCategoryModalOpen] = useState(false);

  const {
    setOptionFormData, setOptionFormOpened,
    setChangesFormData, setChangesFormOpened,
    setIsChangesDeleting, setChangesDeleteData
  } = useChangesCtx();


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
                <Typography>{changes.title[language]}</Typography>
              </MDBox>


              <MDBox
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  onClick={(event) => {
                    event.stopPropagation()
                    setChangesFormData(changes)
                    setChangesFormOpened("edit")
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
                    setIsChangesDeleting(true)
                    setChangesDeleteData({
                      changesId: changes?.id
                    })
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
                <Droppable
                  droppableId={changes?.id}
                  type="droppableChanges"
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


                      {changes?.options?.map((item, index) => {
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
                                <MemoizedOptionTile
                                  key={item.di}
                                  changesId={changes.id}
                                  source={index}
                                  option={item}
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

              <MDBox
                sx={{
                  display: "flex",
                  gap: "20px",
                }}
              >
                <MDButton
                  sx={{ my: 2 }}
                  variant="gradient"
                  color="dark"
                  size="small"
                  onClick={() => {
                    setOptionFormData({
                      changesId: changes.id
                    })
                    setOptionFormOpened("add");
                  }}
                >
                  {translate("BUTTON.ADD_OPTION")}
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

export default ChangesTile;
