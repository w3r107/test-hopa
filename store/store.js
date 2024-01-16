// Redux Toolkit Imports
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// Root Reducer
import reducer from "./rootReducer";

const combinedReducers = combineReducers(reducer)

// Initialize and Export the Redux Store

const rootReducer = (state, action) => {
    if (action.type === 'logoutUser/fulfilled') {
        state = undefined
    }
    return combinedReducers(state, action)
}
const store = configureStore({ reducer: rootReducer });

export default store;
