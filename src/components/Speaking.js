import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { speakingExercises } from '../data'; // Import exercises

const Speaking = () => {
    // Take only the first 3 exercises for display as requested
    const displayedExercises = speakingExercises.slice(0, 4);

    return (
        <div className="home-container">
            <Header />
            <main className="speaking home-content">
                <div className="page-content-wrapper">
                    <h1>Luyện Nói Tiếng Anh</h1>
                    <p>Hãy chọn một bài luyện tập để bắt đầu:</p>
                    <div className="exercises-list-container cards-container"> {/* Re-using cards-container for flex properties */}
                        {displayedExercises.map(exercise => (
                            <div key={exercise.id} className="exercise-card card">
                                <h2>Bài {exercise.id.toUpperCase()}</h2>
                                <p>" {exercise.text} "</p>
                                <Link to={`/speaking/${exercise.id}`}>
                                    <button>Luyện Tập</button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Link to="/">
                        <button>Quay Lại Trang Chủ</button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Speaking;
