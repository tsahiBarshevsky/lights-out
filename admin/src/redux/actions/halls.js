const addNewHall = (newHall) => {
    return {
        type: 'ADD_NEW_HALL',
        payload: newHall
    }
};

export { addNewHall };