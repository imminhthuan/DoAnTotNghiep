import { legacy_createStore as createStore,  applyMiddleware, compose} from 'redux';
import { thunk } from 'redux-thunk';
import reducers from "./redux/reducers";

const initialState = {
  sidebarShow: true,
  theme: 'light',
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

const store = createStore( reducers, enhancer);

export default store;
