import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import moment from 'moment';
import './styles.sass';

const Movies = () => {
    const [name, setName] = useState('avatar');
    const [searchResults, setSearchResults] = useState({});
    const movies = useSelector(state => state.movies);

    const onSearchMovie = () => {
        fetch(`https://api.themoviedb.org/3/search/movie?query=${name}&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1&include_adult=false`)
            .then((res) => res.json())
            .then((res) => setSearchResults(res))
            .catch((error) => console.log(error));
    }

    console.log('searchResults.results', searchResults.results)

    return (
        <div className="movies-container">
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
            {/* <Button onClick={onSearchMovie} variant="contained">Search</Button> */}
            {/* {Object.keys(searchResults).length > 0 &&
                <div>
                    {searchResults.results.map((movie) => {
                        return (
                            <div key={movie.id}>
                                <h3>{movie.title}</h3>
                                <h4>{moment(movie.release_date).format('DD/MM/YY')}</h4>
                                <img
                                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                    style={{ width: 270, height: 400, borderRadius: 15 }}
                                    alt={movie.title}
                                />
                            </div>
                        )
                    })}
                </div>
            } */}
        </div>
    )
}

export default Movies;