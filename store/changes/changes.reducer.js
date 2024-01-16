import { pending, rejected, fulfilled } from "store/utils";
import { addChanges, addOptionToChanges, deleteChanges, getAllChanges, removeChangesOption, updateChanges, updateOption } from "./changes.action";

const GET_ALL_CHANGES = [
    { action: getAllChanges.pending, callback: pending },
    { action: getAllChanges.rejected, callback: rejected },
    {
        action: getAllChanges.fulfilled,
        callback: (state, { payload }) => {
            const { changes } = payload.data;
            state.allchanges = changes;
            state.loaded = true;

            fulfilled(state);
        },
    },
];
const ADD_OPTION_TO_CHANGES = [
    { action: addOptionToChanges.pending, callback: pending },
    { action: addOptionToChanges.rejected, callback: rejected },
    {
        action: addOptionToChanges.fulfilled,
        callback: (state, { payload }) => {
            const { changes } = payload.data;
            const findIdx = state.allchanges.findIndex((c) => c.id === changes.id);

            if (findIdx !== -1) {
                let sortedOptions = [];
                if (changes?.options && changes.options.constructor === Array) {
                    sortedOptions = changes?.options.sort((a, b) => {
                        if (a.position < b.position) {
                            return -1;
                        }
                        if (a.position > b.position) {
                            return 1;
                        }
                        return -1;
                    })
                }
                state.allchanges[findIdx] = {
                    ...changes,
                    options: sortedOptions
                };
            }

            fulfilled(state);
        },
    },
];
const REMOVE_OPTION_FROM_CHANGES = [
    { action: removeChangesOption.pending, callback: pending },
    { action: removeChangesOption.rejected, callback: rejected },
    {
        action: removeChangesOption.fulfilled,
        callback: (state, { payload }) => {
            const { changes } = payload.data;
            const findIdx = state.allchanges.findIndex((c) => c.id === changes.id);

            if (findIdx !== -1) {
                let sortedOptions = [];
                if (changes?.options && changes.options.constructor === Array) {
                    sortedOptions = changes?.options.sort((a, b) => {
                        if (a.position < b.position) {
                            return -1;
                        }
                        if (a.position > b.position) {
                            return 1;
                        }
                        return -1;
                    })
                }
                state.allchanges[findIdx] = {
                    ...changes,
                    options: sortedOptions
                };
            }

            fulfilled(state);
        },
    },
];
const UPDATE_OPTION = [
    { action: updateOption.pending, callback: pending },
    { action: updateOption.rejected, callback: rejected },
    {
        action: updateOption.fulfilled,
        callback: (state, { payload }) => {
            const { changes } = payload.data;
            const findIdx = state.allchanges.findIndex((c) => c.id === changes.id);

            if (findIdx !== -1) {
                let sortedChanges = [];
                if (changes?.options && changes.options.constructor === Array) {
                    sortedChanges = changes?.options.sort((a, b) => {
                        if (a.position < b.position) {
                            return -1;
                        }
                        if (a.position > b.position) {
                            return 1;
                        }
                        return -1;
                    })
                }
                state.allchanges[findIdx] = {
                    ...changes,
                    option: sortedChanges
                };
            }

            fulfilled(state);
        },
    },
];

const ADD_CHANGES = [
    { action: addChanges.pending, callback: pending },
    { action: addChanges.rejected, callback: rejected },
    {
        action: addChanges.fulfilled,
        callback: (state, { payload }) => {
            const { changes } = payload.data;

            state.allchanges = [...state.allchanges, changes]
            fulfilled(state);
        },
    },
];

const UPDATE_CHANGES = [
    { action: updateChanges.pending, callback: pending },
    { action: updateChanges.rejected, callback: rejected },
    {
        action: updateChanges.fulfilled,
        callback: (state, { payload }) => {
            const { changes } = payload.data;

            state.allchanges = state.allchanges.map((c) => {
                if (c.id === changes.id) {
                    return changes
                }
                return c;
            })
            fulfilled(state);
        },
    },
];
const DELETE_CHANGES = [
    { action: deleteChanges.pending, callback: pending },
    { action: deleteChanges.rejected, callback: rejected },
    {
        action: deleteChanges.fulfilled,
        callback: (state, { payload }) => {
            const { changes } = payload.data;

            const filterChanges = state.allchanges.filter((c) => c.id !== changes.id);
            state.allchanges = filterChanges

            fulfilled(payload);
        },
    },
];


const extraReducers = ({ addCase }) => {
    const addToReducers = (arr) => {
        arr.forEach(({ action, callback }) => addCase(action, callback));
    };

    addToReducers(GET_ALL_CHANGES);
    addToReducers(ADD_OPTION_TO_CHANGES);
    addToReducers(REMOVE_OPTION_FROM_CHANGES);
    addToReducers(UPDATE_OPTION);
    addToReducers(ADD_CHANGES);
    addToReducers(UPDATE_CHANGES);
    addToReducers(DELETE_CHANGES);
};

export default extraReducers;
