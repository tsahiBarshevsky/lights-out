import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import FloatingButton from '../Floating Button';
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
                dispatch(deleteMovie(index));
                toast(res, {
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
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            <FloatingButton onClick={() => setIsOpen(true)} />
            {/* <div className="movies-container">
                <Button onClick={() => setIsOpen(true)} variant="contained">Add New Movie</Button>
                <table id="movies">
                    <thead>
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
                    </thead>
                    <tbody>
                        {movies.map((movie, index) => {
                            return (
                                <tr key={movie._id}>
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
                    </tbody>
                </table>
            </div> */}
            <SearchModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Movies;