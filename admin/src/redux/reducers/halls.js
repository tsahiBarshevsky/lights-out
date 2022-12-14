import update from 'immutability-helper';

const INITIAL_STATE = [];

const hallsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_HALLS':
            return action.halls;
        case 'ADD_NEW_HALL':
            return update(state, {
                $push: [action.payload]
            });
        case 'DELETE_HALL':
            return update(state, { $splice: [[action.payload, 1]] });
        default:
            return state;
    }
}

export default hallsReducer;