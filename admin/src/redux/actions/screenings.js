const addNewScreening = (newScreening) => {
    return {
        type: 'ADD_NEW_SCREENING',
        payload: newScreening
    }
};

const deleteScreening = (index) => {
    return {
        type: 'DELETE_SCREENING',
        payload: index
    }
};

export { addNewScreening, deleteScreening };