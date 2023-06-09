import React from 'react';
import '../App.css';
import { Routes, Route} from 'react-router-dom';
import About from '../pages/About.jsx'
import Home from '../pages/Home.jsx'
import Auth from '../pages/Auth.jsx'
import Object from '../pages/Object.jsx'
import Protocol from '../pages/Protocol.jsx'

const AppRouted = () => {

    return (
        <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/object/:id" element={<Object />} />
            <Route path="/protocol/:id" element={<Protocol />} />
        </Routes>

    );
};

export default AppRouted;
