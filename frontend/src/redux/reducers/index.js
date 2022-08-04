import { combineReducers } from "redux";
import hallsReducer from "./halls";
import moviesReducer from "./movies";
import screeningsReducer from "./screenings";

const rootReducer = combineReducers({
    halls: hallsReducer,
    movies: moviesReducer,
    screenings: screeningsReducer
});

export default rootReducer;