import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import Home from './screens/Home';
import './styles.sass';

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App;