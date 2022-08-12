const addNewMovie = (newMovie) => {
    return {
        type: 'ADD_NEW_MOVIE',
        payload: newMovie
    }
};

const deleteMovie = (index) => {
    return {
        type: 'DELETE_MOVIE',
        payload: index
    }
};

export { addNewMovie, deleteMovie };