const signOutUser = () => {
    return {
        type: 'SIGN_OUT_USER'
    }
};

const updatePersonalDeatil = (firstName, lastName, phone) => {
    return {
        type: 'UPDATE_PERSONAL_DETAIL',
        payload: {
            firstName: firstName,
            lastName: lastName,
            phone: phone
        }
    }
};

export { signOutUser, updatePersonalDeatil };