import { pending, rejected, fulfilled } from "store/utils";
import { addNewBadge, deleteBadgeById, getAllBadges, updateBadgeById } from "./badge.action";

const GET_ALL_BADGES = [
  { action: getAllBadges.pending, callback: pending },
  { action: getAllBadges.rejected, callback: rejected },
  {
    action: getAllBadges.fulfilled,
    callback: (state, { payload }) => {
      const { data } = payload;
      state.badges = data?.badges;
      state.loaded = true;

      fulfilled(state);
    },
  },
];

const ADD_BADGE = [
  { action: addNewBadge.pending, callback: pending },
  { action: addNewBadge.rejected, callback: rejected },
  {
    action: addNewBadge.fulfilled,
    callback: (state, { payload }) => {
      const { badge } = payload.data;

      state.badges = [...state?.badges, badge];

      fulfilled(state);
    },
  },
];

const UPDATE_BADGE_BY_ID = [
  { action: updateBadgeById.pending, callback: pending },
  { action: updateBadgeById.rejected, callback: rejected },
  {
    action: updateBadgeById.fulfilled,
    callback: (state, { payload }) => {
      const { badge } = payload.data;

      const findIdx = state.badges.findIndex((item) => item.id === badge.id);
      if (findIdx === -1) return;

      state.badges[findIdx] = badge;

      fulfilled(state);
    },
  },
];

const DELETE_BADGE_BY_ID = [
  { action: deleteBadgeById.pending, callback: pending },
  { action: deleteBadgeById.rejected, callback: rejected },
  {
    action: deleteBadgeById.fulfilled,
    callback: (state, { payload }) => {
      const { badge } = payload.data;

      const filteredBadges = state.badges.filter((item) => item.id !== badge.id);

      state.badges = filteredBadges;

      fulfilled(state);
    },
  },
];




const extraReducers = ({ addCase }) => {
  const addToReducers = (arr) => {
    arr.forEach(({ action, callback }) => addCase(action, callback));
  };

  addToReducers(GET_ALL_BADGES);
  addToReducers(ADD_BADGE);
  addToReducers(UPDATE_BADGE_BY_ID);
  addToReducers(DELETE_BADGE_BY_ID);
};

export default extraReducers;
