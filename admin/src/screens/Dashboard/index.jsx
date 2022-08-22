import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { LoopCircleLoading } from 'react-loadingg';
import { Halls, Movies, Screenings, Sidebar } from '../../components';
import './styles.sass';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [loaded, setLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('movies');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchData = useCallback(() => {
        Promise.all([
            fetch(`/get-all-movies`),
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
            })
            .catch((error) => console.log(error.message))
            .finally(() => setLoaded(true));
    }, [dispatch]);

    useEffect(() => {
        if (!user) {
            navigate('/', { replace: true });
            return;
        }
        fetchData();
    }, [user, navigate, fetchData]);

    return loaded ? (
        <>
            <div className="dashboard-container">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                {(() => {
                    switch (activeTab) {
                        case 'movies':
                            return <Movies />;
                        case 'halls':
                            return <Halls />;
                        case 'screenings':
                            return <Screenings />;
                        default:
                            return null;
                    }
                })()}
            </div>
            <ToastContainer />
        </>
    ) : (
        <div className="loading-container">
            <LoopCircleLoading size="small" color="white" />
        </div>
    )
}

export default Dashboard;