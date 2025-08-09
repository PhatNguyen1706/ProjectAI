import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Speaking from './components/Speaking';
import Writing from './components/Writing';
import ExerciseDetail from './components/ExerciseDetail'; // Import new component
import './styles.css';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/speaking" element={<Speaking />} />
                    <Route path="/speaking/:id" element={<ExerciseDetail />} /> // New route for exercise details
                    <Route path="/writing" element={<Writing />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

