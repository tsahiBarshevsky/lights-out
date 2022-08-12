const addNewHall = (newHall) => {
    return {
        type: 'ADD_NEW_HALL',
        payload: newHall
    }
};

const deleteHall = (index) => {
    return {
        type: 'DELETE_HALL',
        payload: index
    }
};

export { addNewHall, deleteHall };