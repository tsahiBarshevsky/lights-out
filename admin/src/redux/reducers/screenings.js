import update from 'immutability-helper';

const INITIAL_STATE = [];

const screeningsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_SCREENINGS':
            return action.screenings;
        case 'ADD_NEW_SCREENING':
            return update(state, {
                $push: [action.payload]
            });
        case 'DELETE_SCREENING':
            return update(state, { $splice: [[action.payload, 1]] });
        default:
            return state;
    }
}

export default screeningsReducer;