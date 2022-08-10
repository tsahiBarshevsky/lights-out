const signOutUser = () => {
    return {
        type: 'SIGN_OUT_USER'
    }
};

const updatePersonalDeatil = (field, value) => {
    return {
        type: 'UPDATE_PERSONAL_DETAIL',
        payload: {
            field: field,
            value: value
        }
    }
};

export { signOutUser, updatePersonalDeatil };