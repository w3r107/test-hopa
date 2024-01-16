import { pending, rejected, fulfilled } from "store/utils";
import { getAllCustomers } from "./customer.action";

const GET_ALL_CUSTOMERS = [
    { action: getAllCustomers.pending, callback: pending },
    { action: getAllCustomers.rejected, callback: rejected },
    {
        action: getAllCustomers.fulfilled,
        callback: (state, { payload }) => {
            const { customers } = payload.data;
            state.customers = customers;
            state.loaded = true;

            fulfilled(state);
        },
    },
];

const extraReducers = ({ addCase }) => {
    const addToReducers = (arr) => {
        arr.forEach(({ action, callback }) => addCase(action, callback));
    };

    addToReducers(GET_ALL_CUSTOMERS);
};

export default extraReducers;
