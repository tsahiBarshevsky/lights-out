import update from 'immutability-helper';

const INITIAL_STATE = [];

const reservationsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_RESERVATIONS':
            return action.reservations;
        case 'ADD_NEW_RESERVATION':
            return update(state, {
                $push: [action.payload]
            });
        default:
            return state;
    }
}

export default reservationsReducer;