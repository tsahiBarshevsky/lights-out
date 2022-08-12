import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AuthProvider } from './services/AuthContext';
import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import './styles.sass';

const App = () => {
    return (
        <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <AuthProvider>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                    </Routes>
                </AuthProvider>
            </LocalizationProvider>
        </BrowserRouter>
    )
}

export default App;