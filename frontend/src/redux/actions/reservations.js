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

const resetReservations = () => {
    return {
        type: 'RESET_RESERVATIONS'
    }
};

export { addNewReservation, cancelReservation, resetReservations };