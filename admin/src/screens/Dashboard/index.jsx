import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Movies, Sidebar } from '../../components';
import './styles.sass';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('movies');
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
                        default:
                            return null;
                    }
                })()}
            </div>
            <ToastContainer
                position="bottom-center"
                theme='dark'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default Dashboard;