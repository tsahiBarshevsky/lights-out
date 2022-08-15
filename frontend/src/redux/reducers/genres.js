const INITIAL_STATE = [];

const genresReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_GENRES':
            return action.genres;
        default:
            return state;
    }
}

export default genresReducer;