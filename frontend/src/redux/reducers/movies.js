const INITIAL_STATE = [];

const moviesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.movies;
        default:
            return state;
    }
}

export default moviesReducer;