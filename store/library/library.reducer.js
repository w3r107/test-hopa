import { pending, rejected, fulfilled } from "store/utils";
import { getAllImages } from "./library.action";

const GET_ALL_IMAGES = [
    { action: getAllImages.pending, callback: pending },
    { action: getAllImages.rejected, callback: rejected },
    {
        action: getAllImages.fulfilled,
        callback: (state, { payload }) => {
            const { data } = payload;
            state.images = data?.library;
            state.loaded = true;

            fulfilled(state);
        },
    },
];


const extraReducers = ({ addCase }) => {
    const addToReducers = (arr) => {
        arr.forEach(({ action, callback }) => addCase(action, callback));
    };

    addToReducers(GET_ALL_IMAGES);
};

export default extraReducers;
