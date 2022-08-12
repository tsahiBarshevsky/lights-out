import React, { useState } from 'react';
import Modal from 'styled-react-modal';
import { Button, Input, Typography } from '@mui/material';
import moment from 'moment';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addNewMovie } from '../../../redux/actions/movies';
import './styles.sass';

const SearchModal = ({ isOpen, setIsOpen }) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
    const dispatch = useDispatch();

    const handleClose = () => {
        setIsOpen(false);
        setQuery('');
        setSearchResults({});
    }

    const sortByDate = (a, b) => {
        if (a.release_date < b.release_date)
            return 1;
        else
            if (b.release_date < a.release_date)
                return -1;
        return 0;
    }

    const onSearchMovie = (e) => {
        e.preventDefault();
        fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${tmdbApiKey}&language=en-US&page=1&include_adult=false`)
            .then((res) => res.json())
            .then((res) => setSearchResults(res))
            .catch((error) => console.log(error));
    }

    const onAddNewMovie = async (id) => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=en-US`);
        const movieFound = await response.json();
        const newMovie = {
            title: movieFound.title,
            tmdbID: id,
            genre: movieFound.genres[0].name,
            overview: movieFound.overview,
            duration: movieFound.runtime,
            posterPath: movieFound.poster_path.substring(1),
            releaseDate: movieFound.release_date,
            rating: movieFound.vote_average,
            backdropPath: movieFound.backdrop_path.substring(1)
        };
        fetch(`/add-new-movie`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newMovie: newMovie
                })
            })
            .then((res) => res.json())
            .then((res) => {
                newMovie._id = res;
                dispatch(addNewMovie(newMovie));
                handleClose();
                setTimeout(() => {
                    toast('The movie has been added successfully', {
                        position: "bottom-center",
                        type: 'success',
                        autoClose: 5000,
                        theme: 'dark',
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    });
                }, 200);
            })
    }

    return (
        <StyledModal
            isOpen={isOpen}
            onBackgroundClick={handleClose}
            onEscapeKeydown={handleClose}
        >
            <form onSubmit={onSearchMovie} className="search-bar">
                <Input
                    required
                    autoFocus
                    disableUnderline
                    placeholder="Movie name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={onSearchMovie}
                >
                    Search
                </Button>
            </form>
            <div className="results">
                {Object.keys(searchResults).length > 0 &&
                    searchResults.results.sort(sortByDate).map((movie) => {
                        return (
                            <div className="movie" key={movie.id}>
                                <Button
                                    className="add-button"
                                    disableRipple
                                    disableFocusRipple
                                    onClick={() => onAddNewMovie(movie.id)}
                                >
                                    <AiOutlinePlus color='white' size={20} />
                                </Button>
                                {movie.poster_path &&
                                    <img
                                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                        alt={movie.title}
                                        className="poster"
                                    />
                                }
                                <div className="date">
                                    <Typography>
                                        {movie.title}
                                    </Typography>
                                    <Typography variant="caption">
                                        {moment(movie.release_date).format('DD/MM/YY')}
                                    </Typography>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </StyledModal>
    )
}

const StyledModal = Modal.styled`
    width: 50vw;
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 25px;
    background-color: #ffffff;
    cursor: default;
    padding: 20px;

    @media (max-width: 400px) {
        width: 100%;
    }
`;

export default SearchModal;