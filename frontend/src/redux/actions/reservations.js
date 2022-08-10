const addNewReservation = (reservation) => {
    return {
        type: 'ADD_NEW_RESERVATION',
        payload: reservation
    }
};

const cancelReservation = (index) => {
    return {
        type: 'CANCEL_RESERVATION',
        payload: index
    }
};

export { addNewReservation, cancelReservation };