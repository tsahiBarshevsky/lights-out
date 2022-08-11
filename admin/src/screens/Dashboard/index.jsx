import React, { useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './styles.sass';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const movies = useSelector(state => state.movies);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchData = useCallback(() => {
        Promise.all([
            fetch(`/get-all-movies?field=title`),
            fetch(`/get-all-halls`),
            fetch(`/get-all-screenings`)
        ])
            .then(([movies, halls, screenings]) => Promise.all([
                movies.json(),
                halls.json(),
                screenings.json()
            ]))
            .then(([movies, halls, screenings]) => {
                dispatch({ type: 'SET_MOVIES', movies: movies });
                dispatch({ type: 'SET_HALLS', halls: halls });
                dispatch({ type: 'SET_SCREENINGS', screenings: screenings });
            });
    }, [dispatch]);

    useEffect(() => {
        if (!user) {
            navigate('/', { replace: true });
            return;
        }
        fetchData();
    }, [user, navigate, fetchData]);

    return (
        <div className="dashboard-container">
            {movies.map((movie) => {
                return (
                    <div key={movie._id}>
                        <h3>{movie.title}</h3>
                        <img
                            src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`}
                            style={{ width: 270, height: 400, borderRadius: 15 }}
                            alt={movie.title}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default Dashboard;