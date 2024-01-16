import { pending, rejected, fulfilled } from "store/utils";
import {
  getAllDishes,
  addNewDish,
  updateDish,
  deleteDish,
  updateDishOrder,
  getParentDishes,
  moveDishes,
} from "./dish.action";

const GET_ALL_DISHES = [
  { action: getAllDishes.pending, callback: pending },
  { action: getAllDishes.rejected, callback: rejected },
  {
    action: getAllDishes.fulfilled,
    callback: (state, { payload }) => {
      const { data, categoryId } = payload;

      state.dishes[categoryId] = {
        items: data?.dishes,
        loaded: true,
      };
      fulfilled(state);
    },
  },
];

const GET_PARENT_DISHES = [
  { action: getParentDishes.pending, callback: pending },
  { action: getParentDishes.rejected, callback: rejected },
  {
    action: getParentDishes.fulfilled,
    callback: (state, { payload }) => {
      const { data, parentCategoryId } = payload;

      state.dishes[parentCategoryId] = {
        items: data?.dishes,
        loaded: true,
      };
      fulfilled(state);
    },
  },
];

const ADD_DISH = [
  { action: addNewDish.pending, callback: pending },
  { action: addNewDish.rejected, callback: rejected },
  {
    action: addNewDish.fulfilled,
    callback: (state, { payload }) => {
      const { dish } = payload.data;
      const { parentCategoryId, dishType, categoryId } = dish;
      if (dishType === "categoryDish") {
        if (categoryId in state.dishes) {
          state.dishes[categoryId].items = [
            ...state.dishes[categoryId].items,
            dish,
          ];
        } else {
          state.dishes[categoryId] = {
            items: [dish],
            loaded: true,
          };
        }
      } else if (dishType === "parentCategoryDish") {
        if (parentCategoryId in state.dishes) {
          state.dishes[parentCategoryId].items = [
            ...state.dishes[parentCategoryId].items,
            dish,
          ];
        } else {
          state.dishes[parentCategoryId] = {
            items: [dish],
            loaded: true,
          };
        }
      }

      fulfilled(state);
    },
  },
];

const UPDATE_DISH = [
  { action: updateDish.pending, callback: pending },
  { action: updateDish.rejected, callback: rejected },
  {
    action: updateDish.fulfilled,
    callback: (state, { payload }) => {
      const {
        dish,
        oldCategory,
        oldParentCategory,
        oldDishType,
        isParentCategoryChanged,
        isCategoryChanged,
      } = payload.data;

      const { dishType, categoryId, parentCategoryId } = dish;

      if (isParentCategoryChanged || isCategoryChanged) {
        let removeItemId;
        if (oldDishType === "categoryDish") {
          removeItemId = oldCategory;
        } else {
          removeItemId = oldParentCategory;
        }
        const filterDish = state?.dishes[removeItemId]?.items?.filter(
          (item) => item.id !== dish.id
        );
        state.dishes[removeItemId].items = filterDish;

        let toAddId;
        if (dishType === "categoryDish") {
          toAddId = categoryId;
        } else {
          toAddId = parentCategoryId;
        }

        if (state.dishes[toAddId]) {
          state.dishes[toAddId] = {
            items: [...state.dishes[toAddId].items, dish],
            loaded: true,
          };
        } else {
          state.dishes[toAddId] = {
            items: [dish],
            loaded: false,
          };
        }
      } else {
        let toRemoveFrom;
        if (oldDishType === "categoryDish") {
          toRemoveFrom = oldCategory;
        } else {
          toRemoveFrom = oldParentCategory;
        }
        const findIdx = state?.dishes[toRemoveFrom]?.items.findIndex(
          (i) => i.id === dish.id
        );
        if (findIdx !== -1) {
          state.dishes[toRemoveFrom].items[findIdx] = dish;
        }
      }

      if (dishType === "categoryDish") {
        console.log("in if");
        const sortedarr = [...state.dishes[categoryId]?.items].sort((a, b) => {
          if (a.position > b.position) return -1;
          return 1;
        });

        state.dishes[categoryId] = {
          items: sortedarr,
          loaded: true,
        };
      } else if (dishType === "parentCategoryDish") {
        console.log("in else");

        const sortedarr = [...state.dishes[parentCategoryId]?.items].sort(
          (a, b) => {
            if (a.position > b.position) return 1;
            return -1;
          }
        );

        console.log(sortedarr, parentCategoryId);

        state.dishes[parentCategoryId] = {
          items: sortedarr,
          loaded: true,
        };
      }

      fulfilled(state);
    },
  },
];

const DELETE_DISH = [
  { action: deleteDish.pending, callback: pending },
  { action: deleteDish.rejected, callback: rejected },
  {
    action: deleteDish.fulfilled,
    callback: (state, { payload }) => {
      const { dish } = payload.data;
      const { dishType, categoryId, parentCategoryId, id } = dish;
      if (dishType === "categoryDish") {
        if (categoryId in state.dishes) {
          const filterDish = state.dishes[categoryId]?.items?.filter(
            (item) => item.id !== id
          );
          state.dishes[categoryId].items = filterDish;
        }
      } else {
        if (parentCategoryId in state.dishes) {
          const filterDish = state.dishes[parentCategoryId]?.items?.filter(
            (item) => item.id !== id
          );
          state.dishes[parentCategoryId].items = filterDish;
        }
      }
      fulfilled(state);
    },
  },
];

const UPDATE_DISH_ORDER = [
  { action: updateDishOrder.pending, callback: pending },
  { action: updateDishOrder.rejected, callback: rejected },
  {
    action: updateDishOrder.fulfilled,
    callback: (state, { payload }) => {
      fulfilled(state);
    },
  },
];

const MOVE_DISHES = [
  { action: moveDishes.pending, callback: pending },
  { action: moveDishes.rejected, callback: rejected },
  {
    action: moveDishes.fulfilled,
    callback: (state, { payload }) => {
      const {
        fromParentCategory,
        toParentCategory,
        fromCategory,
        toCategory,
        moveDishTypeFrom,
        moveDishTypeTo,
      } = payload.data;

      let removedDishes;
      if (moveDishTypeFrom === "categoryDish") {
        if (
          state?.dishes[fromCategory] &&
          state?.dishes[fromCategory]?.loaded
        ) {
          removedDishes = state.dishes[fromCategory].items;
          state.dishes[fromCategory].items = [];
        }
      } else {
        if (
          state?.dishes[fromParentCategory] &&
          state?.dishes[fromParentCategory]?.loaded
        ) {
          removedDishes = state.dishes[fromParentCategory].items;
          state.dishes[fromParentCategory].items = [];
        }
      }

      if (moveDishTypeTo === "categoryDish") {
        if (state.dishes[toCategory] && state?.dishes[toCategory]?.loaded) {
          state.dishes[toCategory].items = [
            ...state?.dishes[toCategory]?.items,
            ...removedDishes,
          ];
        } else {
          state.dishes[toCategory] = {
            items: [],
            loaded: false,
          };
        }
      } else {
        if (
          state.dishes[toParentCategory] &&
          state?.dishes[toParentCategory]?.loaded
        ) {
          state.dishes[toParentCategory].items = [
            ...state?.dishes[toParentCategory]?.items,
            ...removedDishes,
          ];
        } else {
          state.dishes[toParentCategory] = {
            items: [],
            loaded: false,
          };
        }
      }
      fulfilled(state);
    },
  },
];

const extraReducers = ({ addCase }) => {
  const addToReducers = (arr) => {
    arr.forEach(({ action, callback }) => addCase(action, callback));
  };

  addToReducers(GET_ALL_DISHES);
  addToReducers(GET_PARENT_DISHES);
  addToReducers(ADD_DISH);
  addToReducers(UPDATE_DISH);
  addToReducers(DELETE_DISH);
  addToReducers(UPDATE_DISH_ORDER);
  addToReducers(MOVE_DISHES);
};

export default extraReducers;
