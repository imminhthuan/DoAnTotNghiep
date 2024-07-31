import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import adminReduces from "./adminReduces";

export default combineReducers({
  admin: adminReduces,
  errors: errorReducer,
});
