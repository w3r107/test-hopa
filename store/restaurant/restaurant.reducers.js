import { pending, rejected, fulfilled } from "store/utils";

import {
  addRestaurantUser,
  deleteRestaurantUser,
  getRestaurantInfo,
  getRestaurantUsers,
  signupRestaurant,
  updatePlaceholder,
  updateRestaurantInfo,
  updateRestaurantUser
} from "./restaurant.actions";


// Get Restaurant Info
const GET_RESTAURANT_INFO = [
  { action: getRestaurantInfo.pending, callback: pending },
  { action: getRestaurantInfo.rejected, callback: rejected },
  {
    action: getRestaurantInfo.fulfilled,
    callback: (state, { payload }) => {
      const { restaurant } = payload.data;
      state.data = {
        ...restaurant,
        loaded: true
      };
      fulfilled(state);
    },
  },
];


const UPDATE_RESTAURANT = [
  { action: updateRestaurantInfo.pending, callback: pending },
  { action: updateRestaurantInfo.rejected, callback: rejected },
  {
    action: updateRestaurantInfo.fulfilled,
    callback: (state, { payload }) => {
      const { restaurant } = payload.data;
      state.data = {
        ...restaurant,
        loaded: true
      };
      fulfilled(state);
    },
  },
];

const UPDATE_RESTAURANT_PLACEHOLDER = [
  { action: updatePlaceholder.pending, callback: pending },
  { action: updatePlaceholder.rejected, callback: rejected },
  {
    action: updatePlaceholder.fulfilled,
    callback: (state, { payload }) => {
      const { restaurant } = payload.data;
      state.data = {
        ...restaurant,
        loaded: true
      };
      fulfilled(state);
    },
  },
];

const ADD_RESTAURANT_USER = [
  { action: addRestaurantUser.pending, callback: pending },
  { action: addRestaurantUser.rejected, callback: rejected },
  {
    action: addRestaurantUser.fulfilled,
    callback: (state, { payload }) => {
      const { user } = payload.data;
      state.users = [
        ...state.users,
        user
      ]
      fulfilled(state);
    },
  },
];

const GET_RESTAURANT_USERS = [
  { action: getRestaurantUsers.pending, callback: pending },
  { action: getRestaurantUsers.rejected, callback: rejected },
  {
    action: getRestaurantUsers.fulfilled,
    callback: (state, { payload }) => {
      const { users } = payload.data;
      state.users = users;
      fulfilled(state);
    },
  },
];

const DELETE_RESTAURANT_USER = [
  { action: deleteRestaurantUser.pending, callback: pending },
  { action: deleteRestaurantUser.rejected, callback: rejected },
  {
    action: deleteRestaurantUser.fulfilled,
    callback: (state, { payload }) => {
      const { userId } = payload.data;
      const fu = state.users.filter((u) => u.userId !== userId);
      state.users = fu;
      fulfilled(state);
    },
  },
];
const UPDATE_RESTAURANT_USER = [
  { action: updateRestaurantUser.pending, callback: pending },
  { action: updateRestaurantUser.rejected, callback: rejected },
  {
    action: updateRestaurantUser.fulfilled,
    callback: (state, { payload }) => {
      const { user } = payload.data;

      console.log(user);
      let fu = state.users.findIndex((u) => u.userId === user.userId);
      console.log(fu);
      if (fu === -1) return;
      console.log(fu);

      let newuser = { ...state.users[fu], ...user };
      console.log(newuser);

      state.users[fu] = newuser;
      fulfilled(state);
    },
  },
];

const extraReducers = ({ addCase }) => {
  const addToReducers = (arr) => {
    arr.forEach(({ action, callback }) => addCase(action, callback));
  };

  addToReducers(GET_RESTAURANT_INFO);
  addToReducers(UPDATE_RESTAURANT);
  addToReducers(UPDATE_RESTAURANT_PLACEHOLDER);
  addToReducers(ADD_RESTAURANT_USER);
  addToReducers(GET_RESTAURANT_USERS);
  addToReducers(DELETE_RESTAURANT_USER);
  addToReducers(UPDATE_RESTAURANT_USER);
};

export default extraReducers;
