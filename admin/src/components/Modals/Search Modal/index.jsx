import React, { useState } from 'react';
import Modal from 'styled-react-modal';
import { Button, Input, Typography } from '@mui/material';
import moment from 'moment';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addNewMovie } from '../../../redux/actions/movies';
import { useStyles } from '../../../services/inputsStyles';
import { modalBackground } from '../../../services/theme';
import './styles.sass';

const SearchModal = ({ isOpen, setIsOpen }) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
    const dispatch = useDispatch();
    const classes = useStyles();

    const notify = (type, message) => {
        toast(message, {
            position: "bottom-center",
            type: type,
            autoClose: 5000,
            theme: 'dark',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

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
            .then((res) => {
                if (res.results.length > 0)
                    setSearchResults(res);
                else {
                    setSearchResults({});
                    notify('info', 'No movie found');
                }
            })
            .catch((error) => {
                notify('error', error.message);
            });
    }

    const onAddNewMovie = async (id) => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=en-US&append_to_response=releases`),
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}&language=en-US`),
        ])
            .then(([movie, credits]) => Promise.all([
                movie.json(),
                credits.json()
            ]))
            .then(([movie, credits]) => {
                const certification = movie.releases.countries.find((country) => country.iso_3166_1 === 'US').certification;
                const newMovie = {
                    title: movie.title,
                    tmdbID: id,
                    genre: movie.genres[0].name,
                    overview: movie.overview,
                    duration: movie.runtime,
                    posterPath: movie.poster_path.substring(1),
                    releaseDate: movie.release_date,
                    rating: movie.vote_average,
                    backdropPath: movie.backdrop_path.substring(1),
                    language: movie.spoken_languages[0].english_name,
                    certification: certification,
                    cast: credits.cast,
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
                            notify('success', 'The movie has been added successfully');
                        }, 200);
                    });
            });
    }

    return (
        <StyledModal
            isOpen={isOpen}
            onBackgroundClick={handleClose}
            onEscapeKeydown={handleClose}
        >
            <form onSubmit={onSearchMovie} id="search-bar">
                <Input
                    required
                    autoFocus
                    disableUnderline
                    placeholder="Movie name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="text-input"
                    classes={{ root: classes.input }}
                />
                <Button
                    variant="contained"
                    className="button"
                    type="submit"
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
                                    <AiOutlinePlus color='black' size={20} />
                                </Button>
                                {movie.poster_path &&
                                    <img
                                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                        alt={movie.title}
                                        className="poster"
                                    />
                                }
                                <div className="date">
                                    <Typography variant="subtitle1" className="text">
                                        {movie.title}
                                    </Typography>
                                    <Typography variant="caption" className="text">
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
    background-color: ${modalBackground};
    cursor: default;
    padding: 20px;

    @media (max-width: 400px) {
        width: 100%;
    }
`;

export default SearchModal;