import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./changes.reducer";

// Initial State
const initialState = {
    allchanges: [],
    loaded: false,
};

// Create Slice
export const changesSlice = createSlice({
    name: "changes",
    initialState,
    reducers: {
        reset: () => initialState,

        // update parent category
        updateOptionOrderById: (state, action) => {

            const { changesId, position, optionId } = action.payload;

            const findIdx = state.allchanges.findIndex(
                (item) => item.id === changesId
            );
            if (findIdx === -1) return;

            const opIdx = state.allchanges[findIdx].options.findIndex(item => item.id === optionId);
            if (opIdx === -1) return;

            state.allchanges[findIdx].options[opIdx].position = position;

            state.allchanges[findIdx].options = state.allchanges[findIdx].options.sort((a, b) => {
                if (a.position < b.position) {
                    return -1;
                }
                if (a.position > b.position) {
                    return 1;
                }
                return -1;
            });
        },
    },
    extraReducers,
});

// Exporting Actions
export const useChanges = () => useSelector(({ changes }) => changes);

// Exporting the Reducer
export default changesSlice.reducer;
export const changesAction = changesSlice.actions;
