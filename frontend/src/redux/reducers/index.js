import { combineReducers } from "redux";
import hallsReducer from "./halls";
import moviesReducer from "./movies";
import screeningsReducer from "./screenings";
import userReducer from "./user";

const rootReducer = combineReducers({
    halls: hallsReducer,
    movies: moviesReducer,
    screenings: screeningsReducer,
    user: userReducer
});

export default rootReducer;