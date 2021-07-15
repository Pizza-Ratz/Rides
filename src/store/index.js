import transiter from "./reducers/transiter";
import trip from "./reducers/trip"

const rootReducer = combineReducers({
  transiter, trip
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, middleware);

export default store;
