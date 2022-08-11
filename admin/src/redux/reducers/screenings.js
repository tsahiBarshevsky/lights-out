import update from 'immutability-helper';

const INITIAL_STATE = [];

const screeningsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_SCREENINGS':
            return action.screenings;
        case 'BOOK_SEATS':
        case 'UNBOOK_SEATS':
            return update(state, {
                [action.payload.index]: {
                    $merge: {
                        seats: action.payload.seats
                    }
                }
            });
        default:
            return state;
    }
}

export default screeningsReducer;