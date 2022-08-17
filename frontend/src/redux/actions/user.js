const signOutUser = () => {
    return {
        type: 'SIGN_OUT_USER'
    }
};

const updatePersonalDeatil = (firstName, lastName, phone, image) => {
    return {
        type: 'UPDATE_PERSONAL_DETAIL',
        payload: {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            image: image
        }
    }
};

export { signOutUser, updatePersonalDeatil };