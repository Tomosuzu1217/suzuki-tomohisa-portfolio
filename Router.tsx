import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const basename = import.meta.env.PROD ? '/suzuki-tomohisa-portfolio' : '/';

const Router: React.FC = () => {
    return (
        <BrowserRouter basename={basename}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;

