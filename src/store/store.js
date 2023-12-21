import { configureStore, combineReducers, compose } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { organizationReducer } from "./organizationSlice";
import { userTableDataReducer } from "./userTableDataSlice";
import thunk from "redux-thunk";
import { authReducer } from "./authSlice";
import { createOrderFormReducer } from "./createOrderFormSlice";
import { allOrdersDataReducer } from "./orderSlice";

const rootReducer = combineReducers({
  organizationTable: organizationReducer,
  userTable: userTableDataReducer,
  auth: authReducer,
  createOrderTabs: createOrderFormReducer,
  allOrdersData: allOrdersDataReducer,
});

const composeEnhancers =
  typeof window !== "undefined" && window.REDUX_DEVTOOLS_EXTENSION_COMPOSE
    ? window.REDUX_DEVTOOLS_EXTENSION_COMPOSE
    : compose;

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(thunk),
    enhancers: [composeEnhancers],
  });

export const wrapper = createWrapper(makeStore);
