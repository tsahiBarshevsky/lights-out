const INITIAL_STATE = [];

const hallsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_HALLS':
            return action.halls;
        default:
            return state;
    }
}

export default hallsReducer;