import update from 'immutability-helper';

const INITIAL_STATE = {};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        case 'SIGN_OUT_USER':
            return INITIAL_STATE;
        case 'UPDATE_PERSONAL_DETAIL':
            return update(state, {
                $merge: {
                    [`${action.payload.field}`]: action.payload.value
                }
            })
        default:
            return state;
    }
}

export default userReducer;