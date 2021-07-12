import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import transiter from "./reducers/transiter";

const rootReducer = combineReducers({
  transiter,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, middleware);

export default store;
