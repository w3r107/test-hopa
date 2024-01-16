import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import extraReducers from "./dish.reducer";

// Initial State
const initialState = {
	dishes: {},
};

// Create Slice
export const dishSlice = createSlice({
	name: "dish",
	initialState,
	reducers: {
		reset: () => initialState,
		updateDishOrderById: (state, action) => {
			const { dishId, categoryId, position } = action.payload;

			const allDishes = state.dishes[categoryId]?.items;

			const findIdx = allDishes.findIndex(
				(item) => item.id === dishId
			);

			if (findIdx !== -1) {
				state.dishes[categoryId].items[findIdx].position = position;

				const sortPC = state.dishes[categoryId].items.sort((a, b) => {
					if (a.position < b.position) {
						return -1;
					}
					if (a.position > b.position) {
						return 1;
					}
				});
				state.dishes[categoryId].items = sortPC;
			}
		},
	},
	extraReducers,
});

// Exporting Actions
export const useDish = () => useSelector(({ dish }) => dish);

// Exporting the Reducer
export default dishSlice.reducer;
export const dishActions = dishSlice.actions;
