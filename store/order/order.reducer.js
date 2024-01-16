import { pending, rejected, fulfilled } from "store/utils";
import { getAllOrders, getOrderById, getOrderHistory, updateOrderStatus } from "./order.action";

const GET_ALL_ORDERS = [
    { action: getAllOrders.pending, callback: pending },
    { action: getAllOrders.rejected, callback: rejected },
    {
        action: getAllOrders.fulfilled,
        callback: (state, { payload }) => {
            const { data } = payload;
            state.orders = data?.orders;
            state.loaded = true;

            fulfilled(state);
        },
    },
];
const GET_ORDERS_HISTORY = [
    { action: getOrderHistory.pending, callback: pending },
    { action: getOrderHistory.rejected, callback: rejected },
    {
        action: getOrderHistory.fulfilled,
        callback: (state, { payload }) => {
            const { data } = payload;
            state.orderHistory = data?.orders;
            state.orderHistoryLoaded = true;

            fulfilled(state);
        },
    },
];

const GET_ORDER_BY_ID = [
    { action: getOrderById.pending, callback: pending },
    { action: getOrderById.rejected, callback: rejected },
    {
        action: getOrderById.fulfilled,
        callback: (state, { payload }) => {
            const { data } = payload;
            state.orders = data?.orders;
            state.loaded = true;

            fulfilled(state);
        },
    },
];

const UPDATE_ORDER_STATUS = [
    { action: updateOrderStatus.pending, callback: pending },
    { action: updateOrderStatus.rejected, callback: rejected },
    {
        action: updateOrderStatus.fulfilled,
        callback: (state, { payload }) => {
            const { order } = payload.data;

            if (String(order.status).toLowerCase() === "delivered") {
                // remove from order and put in order_history 
                const getOrder = state.orders.find((o) => o.id === order.id);
                const filterOrders = state.orders.filter((o) => o.id !== order.id);
                state.orders = filterOrders

                state.orderHistory = [
                    ...state.orderHistory,
                    {
                        ...order,
                        user: getOrder.user
                    }
                ]

            } else {
                // upadate the order 
                const orderIdx = state.orders.findIndex((o) => o.id === order.id);

                state.orders[orderIdx] = {
                    ...order,
                    user: state.orders[orderIdx].user
                };

            }
            fulfilled(state);
        },
    },
];


const extraReducers = ({ addCase }) => {
    const addToReducers = (arr) => {
        arr.forEach(({ action, callback }) => addCase(action, callback));
    };

    addToReducers(GET_ALL_ORDERS);
    addToReducers(GET_ORDER_BY_ID);
    addToReducers(UPDATE_ORDER_STATUS);
    addToReducers(GET_ORDERS_HISTORY);
};

export default extraReducers;
