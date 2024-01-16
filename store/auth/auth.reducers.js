import { loginWithEmailPassword, signupRestaurant } from "./auth.action";
import { pending, rejected, fulfilled } from "store/utils";

const LOGIN_USER_WITH_EMAIL_PASSWORD = [
  { action: loginWithEmailPassword.pending, callback: pending },
  { action: loginWithEmailPassword.rejected, callback: rejected },
  {
    action: loginWithEmailPassword.fulfilled,
    callback: (state, { payload }) => {
      console.log(payload);
      state.data = payload;
      fulfilled(state);
    },
  },
];

const ADD_RESTAURANT = [
  { action: signupRestaurant.pending, callback: pending },
  { action: signupRestaurant.rejected, callback: rejected },
  {
    action: signupRestaurant.fulfilled,
    callback: (state, { payload }) => {
      fulfilled(payload);
    },
  },
];


const extraReducers = ({ addCase }) => {
  const addToReducers = (arr) => {
    arr.forEach(({ action, callback }) => addCase(action, callback));
  };

  addToReducers(LOGIN_USER_WITH_EMAIL_PASSWORD);
  addToReducers(ADD_RESTAURANT);
};

export default extraReducers;
