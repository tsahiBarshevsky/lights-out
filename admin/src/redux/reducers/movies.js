import update from 'immutability-helper';

const INITIAL_STATE = [];

const moviesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.movies;
        case 'ADD_NEW_MOVIE':
            return update(state, {
                $push: [action.payload]
            });
        case 'DELETE_MOVIE':
            return update(state, { $splice: [[action.payload, 1]] });
        default:
            return state;
    }
}

export default moviesReducer;