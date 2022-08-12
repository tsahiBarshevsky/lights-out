const addNewScreening = (newScreening) => {
    return {
        type: 'ADD_NEW_SCREENING',
        payload: newScreening
    }
};

export { addNewScreening };