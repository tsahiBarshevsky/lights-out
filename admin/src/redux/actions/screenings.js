const bookSeats = (seats, index) => {
    return {
        type: 'BOOK_SEATS',
        payload: {
            seats: seats,
            index: index
        }
    }
};

const unbookSeats = (seats, index) => {
    return {
        type: 'UNBOOK_SEATS',
        payload: {
            seats: seats,
            index: index
        }
    }
};

export { bookSeats, unbookSeats };