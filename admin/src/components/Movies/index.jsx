import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import moment from 'moment';
import SearchModal from '../Modal';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';

const Movies = () => {
    const [isOpen, setIsOpen] = useState(false);
    const movies = useSelector(state => state.movies);

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
                    </tr>
                    {movies.map((movie) => {
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