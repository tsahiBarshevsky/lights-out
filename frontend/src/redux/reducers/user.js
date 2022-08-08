const INITIAL_STATE = {};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.user;
        case 'SIGN_OUT_USER':
            return INITIAL_STATE;
        default:
            return state;
    }
}

export default userReducer;