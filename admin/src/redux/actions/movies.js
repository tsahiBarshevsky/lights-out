const addNewMovie = (newMovie) => {
    return {
        type: 'ADD_NEW_MOVIE',
        payload: newMovie
    }
};

export { addNewMovie };