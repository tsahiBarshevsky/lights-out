const bookSeats = (seats, index) => {
    return {
        type: 'BOOK_SEATS',
        payload: {
            seats: seats,
            index: index
        }
    }
};

export { bookSeats };