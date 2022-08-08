const addNewReservation = (reservation) => {
    return {
        type: 'ADD_NEW_RESERVATION',
        payload: reservation
    }
};

export { addNewReservation };