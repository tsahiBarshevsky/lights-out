import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';
// import './styles.sass';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/', { replace: true });
            return;
        }
    }, [user, navigate]);

    return (
        <div>Dashboard</div>
    )
}

export default Dashboard;