import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import SearchModal from '../Modals/Search Modal';
import { deleteMovie } from '../../redux/actions/movies';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';

const Movies = () => {
    const [isOpen, setIsOpen] = useState(false);
    const movies = useSelector(state => state.movies);
    const dispatch = useDispatch();

    const onDeleteMovie = (id, index) => {
        fetch(`/delete-movie?id=${id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((res) => {
                toast(res);
                dispatch(deleteMovie(index));
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            <div className="movies-container">
                <Button onClick={() => setIsOpen(true)} variant="contained">Add New Movie</Button>
                <table id="movies">
                    <tr>
                        <th style={{ width: 130 }}>
                            <h3>Poster</h3>
                        </th>
                        <th><h3>Title</h3></th>
                        <th><h3>Genre</h3></th>
                        <th><h3>Duration</h3></th>
                        <th><h3>Release Date</h3></th>
                        <th><h3>Options</h3></th>
                    </tr>
                    {movies.map((movie, index) => {
                        return (
                            <tr key={movie.id}>
                                <td>
                                    <img
                                        src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`}
                                        alt={movie.title}
                                        style={{ width: 90, height: '100%', borderRadius: 10 }}
                                    />
                                </td>
                                <td><h3>{movie.title}</h3></td>
                                <td><h3>{movie.genre}</h3></td>
                                <td><h3>{movie.duration}</h3></td>
                                <td><h3>{moment(movie.releaseDate).format('DD/MM/YY')}</h3></td>
                                <td>
                                    <Button
                                        variant="contained"
                                        onClick={() => onDeleteMovie(movie._id, index)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div>
            <SearchModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Movies;